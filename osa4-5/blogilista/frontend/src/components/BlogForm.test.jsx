import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> calls createBlog with form values", async () => {
  const user = userEvent.setup();
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const authorInput = screen.getByLabelText("Author");

  const urlInput = screen.getByLabelText("URL");
  const likesInput = screen.getByLabelText("Likes");

  const titleInput = screen.getByPlaceholderText("write title here");

  await user.type(authorInput, "Test Author");
  await user.type(titleInput, "Testing a form");
  await user.type(urlInput, "https://example.com");

  await user.clear(likesInput);
  await user.type(likesInput, "42");

  const submitButton = await screen.findByText("Create Blog");

  await user.click(submitButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    author: "Test Author",
    title: "Testing a form",
    url: "https://example.com",
    likes: 42,
  });
});
