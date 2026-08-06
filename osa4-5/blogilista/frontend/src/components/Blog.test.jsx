import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

test("renders content", () => {
  const blog = {
    id: 1234,
    title: "olen nakyva title",
    author: "test author",
    likes: 100,
  };

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>,
  );

  const element = screen.getByText("olen nakyva title");
  expect(element).toBeDefined();
});

test("doesn't render author and likes", () => {
  const blog = {
    title: "olen nakyva title",
    author: "test author",
    likes: 100,
  };

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>,
  );

  const authorElement = screen.queryByText("Author: test author");
  expect(authorElement).not.toBeInTheDocument();

  const likesElement = screen.queryByText("Likes: 100");
  expect(likesElement).not.toBeInTheDocument();
});

test("doesn't render likes buttons if user not logged in", async () => {
  const blog = {
    title: "olen nakyva title",
    author: "test author",
    likes: 100,
  };

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();

  expect(screen.queryByText("Author: test author")).not.toBeInTheDocument();

  const viewButton = screen.getByRole("button", { name: "👁️" });
  await user.click(viewButton);

  expect(screen.queryByRole("button", { name: "👍" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "👎" })).not.toBeInTheDocument();
});

test("debug outlined-emoji class container", () => {
  const blog = {
    title: "olen nakyva title",
    author: "test author",
    likes: 100,
  };
  const { container } = render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>,
  );

  const div = container.querySelector(".outlined-emoji");
  screen.debug(div);
});

test("clicking the view button shows blog details", async () => {
  const blog = {
    title: "test title",
    author: "test author",
    likes: 100,
    url: "http://testurl.com",
    user: { username: "testuser" },
  };
  const loggedInUser = { username: "testuser" };

  render(
    <MemoryRouter>
      <Blog blog={blog} loggedUser={loggedInUser} />
    </MemoryRouter>,
  );

  const user = userEvent.setup();

  expect(screen.queryByText("Author: test author")).not.toBeInTheDocument();

  const viewButton = screen.getByRole("button", { name: "👁️" });
  await user.click(viewButton);

  expect(screen.getByText("Author: test author")).toBeVisible();
  expect(screen.getByText("Likes: 100")).toBeVisible();
  expect(screen.getByRole("button", { name: "🙈" })).toBeVisible();
  expect(screen.getByRole("button", { name: "❌" })).toBeVisible();
  expect(screen.getByRole("button", { name: "👍" })).toBeVisible();
  expect(screen.getByRole("button", { name: "👎" })).toBeVisible();
  expect(screen.getByText("URL: http://testurl.com")).toBeVisible();
  expect(screen.getByText("Added by: testuser")).toBeVisible();
});

test("clicking like twice calls updateLike twice", async () => {
  const blog = {
    id: "123",
    title: "test title",
    author: "test author",
    likes: 100,
  };
  const loggedInUser = { username: "testuser" };
  const mockUpdateLike = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Blog blog={blog} updateLike={mockUpdateLike} loggedUser={loggedInUser} />
    </MemoryRouter>,
  );

  const viewButton = screen.getByRole("button", { name: "👁️" });
  await user.click(viewButton);

  const likeButton = screen.getByRole("button", {
    name: "👍",
  });

  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockUpdateLike).toHaveBeenCalledTimes(2);
  expect(mockUpdateLike.mock.calls).toHaveLength(2);
  expect(mockUpdateLike).toHaveBeenCalledWith("123", "like");
});

test("dontä show delete if not owner of the blog", async () => {
  const blog = {
    title: "test title",
    author: "test author",
    likes: 100,
    url: "http://testurl.com",
    user: { username: "testuser" },
  };
  const loggedInUser = { username: "icantseedelete" };

  render(
    <MemoryRouter>
      <Blog blog={blog} loggedUser={loggedInUser} />
    </MemoryRouter>,
  );

  const user = userEvent.setup();

  expect(screen.queryByText("Author: test author")).not.toBeInTheDocument();

  const viewButton = screen.getByRole("button", { name: "👁️" });
  await user.click(viewButton);

  expect(screen.queryByRole("button", { name: "❌" })).not.toBeInTheDocument();

  expect(screen.getByRole("button", { name: "🙈" })).toBeVisible();
  expect(screen.getByRole("button", { name: "👍" })).toBeVisible();
  expect(screen.getByRole("button", { name: "👎" })).toBeVisible();
});
