import { useState } from "react";
import service from "../services/blogs";
import { useToast } from "../toast/ToastContext";

const blogTemplate = {
  title: "",
  author: "",
  url: "",
  likes: 0,
};

const CreateBlog = ({ onAction }) => {
  const { showToast } = useToast();
  const [newBlog, setNewBlog] = useState(blogTemplate);

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const [data, error] = await service.create(newBlog);

    if (data) {
      onAction("created");
      showToast("Blog created", "success");
    }

    if (error) {
      showToast(error, "error");
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
        <button type="button" onClick={() => onAction("cancel")}>
          Cancel
        </button>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default CreateBlog;
