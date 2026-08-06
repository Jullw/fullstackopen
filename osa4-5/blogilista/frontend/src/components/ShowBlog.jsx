import Blog from "./Blog";
import { useParams } from "react-router-dom";

const blogNotFound = () => {
  return <div>Blog not found</div>;
};

const ShowBlog = ({ blogs, deleteBlog, updateLike, user }) => {
  const { id } = useParams();

  if (!id || !blogs) {
    return blogNotFound();
  }

  const blog = blogs.find((blog) => blog.id === id);
  if (!blog) {
    return blogNotFound();
  }

  return (
    <Blog
      key={blog.id}
      blog={blog}
      deleteBlog={deleteBlog}
      updateLike={updateLike}
      loggedUser={user}
    />
  );
};

export default ShowBlog;
