import { useState } from "react";

const blogTemplate = {
  title: "",
  author: "",
  url: "",
  likes: 0,
};

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState(blogTemplate);

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog(blogTemplate);
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form className="create-blog-form" onSubmit={addBlog}>
        <div>
          <label>
            Author
            <input
              type="text"
              value={newBlog.author}
              onChange={({ target }) =>
                setNewBlog({ ...newBlog, author: target.value })
              }
            />
          </label>
        </div>
        <div>
          <label>
            title
            <input
              type="text"
              value={newBlog.title}
              onChange={({ target }) =>
                setNewBlog({ ...newBlog, title: target.value })
              }
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={newBlog.url}
              onChange={({ target }) =>
                setNewBlog({ ...newBlog, url: target.value })
              }
            />
          </label>
        </div>
        <div>
          <label>
            likes
            <input
              type="number"
              value={newBlog.likes}
              onChange={({ target }) =>
                setNewBlog({ ...newBlog, likes: Number(target.value) })
              }
            />
          </label>
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default BlogForm;
