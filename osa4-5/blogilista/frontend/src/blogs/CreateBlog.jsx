import { useState } from "react";
import service from "../services/blogs";

const blogTemplate = {
  title: "",
  author: "",
  url: "",
  likes: 0,
};

const CreateBlog = ({ setToast, onBlogCreated }) => {
  const [newBlog, setNewBlog] = useState(blogTemplate);

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const [data, error] = await service.create(newBlog);

    if (data) {
      onBlogCreated();
      setToast({
        id: crypto.randomUUID(),
        message: "Blog created",
        type: "success",
      });
    }

    if (error) {
      setToast({
        id: crypto.randomUUID(),
        message: error,
        type: "error",
      });
    }

    setNewBlog(blogTemplate);
  };

  return (
    <div>
      <form className="create-blog-form" onSubmit={handleCreateBlog}>
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

export default CreateBlog;
