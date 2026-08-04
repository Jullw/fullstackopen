import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("renders content", () => {
  const blog = {
    title: "olen nakyva title",
    author: "test author",
    likes: 100,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("Title: olen nakyva title");
  expect(element).toBeDefined();
});

test("doesn't render author and likes", () => {
  const blog = {
    title: "olen nakyva title",
    author: "test author",
    likes: 100,
  };

  render(<Blog blog={blog} />);

  const authorElement = screen.queryByText("Author: test author");
  expect(authorElement).not.toBeInTheDocument();

  const likesElement = screen.queryByText("Likes: 100");
  expect(likesElement).not.toBeInTheDocument();
});

test("doesn't render author and likes", () => {
  const blog = {
    title: "olen nakyva title",
    author: "test author",
    likes: 100,
  };

  const { container } = render(<Blog blog={blog} />);

  const div = container.querySelector(".blog");
  expect(div).toHaveTextContent("Title: olen nakyva title");
});

test("debug outlined-emoji class container", () => {
  const blog = {
    title: "olen nakyva title",
    author: "test author",
    likes: 100,
  };
  const { container } = render(<Blog blog={blog} />);

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

  render(<Blog blog={blog} loggedUser={{ username: "testuser" }} />);

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

  const mockUpdateLike = vi.fn();
  const user = userEvent.setup();

  render(<Blog blog={blog} updateLike={mockUpdateLike} />);

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
