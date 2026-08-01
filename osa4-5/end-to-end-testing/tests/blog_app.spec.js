const { test, expect } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

const content = {
  title: "Test blog title",
  author: "Test Author",
  url: "https://example.com/test-blog",
  likes: 10,
};

test.describe("Blog app", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "tester tester",
        username: "tester",
        password: "testeR123",
      },
    });

    await page.goto("/");
  });
  test("front page can be opened", async ({ page }) => {
    const locator = page.getByText("Blogs");
    await expect(locator).toBeVisible();
    await expect(page.getByText("Blog app")).toBeVisible();
  });

  test.describe("login", () => {
    test("Login form is shown", async ({ page }) => {
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByLabel("username")).toBeVisible();
      await expect(page.getByLabel("password")).toBeVisible();
      await expect(page.getByRole("button", { name: "login" })).toBeVisible();
    });

    test("user can log in", async ({ page }) => {
      await loginWith(page, "tester", "testeR123");
      await expect(page.getByText("tester tester logged in")).toBeVisible();
    });

    test("login fails with wrong password", async ({ page }) => {
      await loginWith(page, "tester", "wrongpassword");
      const errorDiv = page.locator(".notification.error");
      await expect(errorDiv).toHaveCSS("border-radius", "8px");
      await expect(errorDiv).toContainText("invalid username or password");
    });
  });

  test.describe("when logged in", () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, "tester", "testeR123");
    });

    test("a new blog  can be created", async ({ page }) => {
      await createBlog(page, content);
      //   await page.pause();
      // npm test -- -g'a new blog  can be created' --debug
      await expect(page.getByText(`Title: ${content.title}`)).toBeVisible();
    });

    test.describe("and a blog exists", () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(page, {
          ...content,
          title: "Another test blog",
        });
      });

      test("another blog exists", async ({ page }) => {
        await expect(page.getByText("Title: Another test blog")).toBeVisible();
      });

      test("blog can be liked", async ({ page }) => {
        const blog = page.locator(".blog", {
          hasText: "Title: Another test blog",
        });

        await expect(blog).toBeVisible();
        await blog.getByRole("button", { name: "👁️" }).click();

        await expect(blog).toContainText("Likes: 10");
        await blog.getByRole("button", { name: "👍" }).click();

        await expect(blog).toContainText("Likes: 11");
      });

      test("blog can be disliked", async ({ page }) => {
        const blog = page.locator(".blog", {
          hasText: "Title: Another test blog",
        });

        await expect(blog).toBeVisible();
        await blog.getByRole("button", { name: "👁️" }).click();

        await expect(blog).toContainText("Likes: 10");
        await blog.getByRole("button", { name: "👎" }).click();

        await expect(blog).toContainText("Likes: 9");
      });

      test("blog can be deleted", async ({ page }) => {
        const blog = page.locator(".blog", {
          hasText: "Title: Another test blog",
        });

        await expect(blog).toBeVisible();
        await blog.getByRole("button", { name: "❌" }).click();

        await expect(blog).not.toBeVisible();
      });

      test("blog cannot be deleted by another user", async ({
        page,
        request,
      }) => {
        await request.post("/api/users", {
          data: {
            name: "deleter deleter",
            username: "deleter",
            password: "iTryDelete123",
          },
        });

        const blog = page.locator(".blog", {
          hasText: "Title: Another test blog",
        });

        await expect(blog.getByRole("button", { name: "❌" })).toBeVisible();
        await expect(blog).toBeVisible();

        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, "deleter", "iTryDelete123");
        await expect(page.getByText("deleter deleter logged in")).toBeVisible();

        await expect(
          blog.getByRole("button", { name: "❌" }),
        ).not.toBeVisible();
      });

      test("blog with most likes is shown first", async ({ page }) => {
        const mostLikedBlog = {
          ...content,
          title: "Most liked blog",
          likes: 100,
        };

        const secondMostLikedBlog = {
          ...content,
          title: "Second most liked blog",
          likes: 50,
        };
        await createBlog(page, mostLikedBlog);
        await createBlog(page, secondMostLikedBlog);

        await expect(page.getByText("Title: Most liked blog")).toBeVisible();

        const blogs = page.locator(".blog");

        await expect(blogs.first()).toContainText("Title: Most liked blog");
      });
    });
  });
});
