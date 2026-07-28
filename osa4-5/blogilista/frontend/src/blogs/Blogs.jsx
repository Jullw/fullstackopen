import { use, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import service from "../services/blogs";
import { useToast } from "../toast/ToastContext";

const Blogs = ({ blogsPromise, refreshBlogs }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[blogsPromise]}>
      <Suspense fallback={<Loading />}>
        <ShowBlogs blogsPromise={blogsPromise} refreshBlogs={refreshBlogs} />
      </Suspense>
    </ErrorBoundary>
  );
};

const ShowBlogs = ({ blogsPromise, refreshBlogs }) => {
  const data = use(blogsPromise);
  data.sort((a, b) => b.likes - a.likes);
  return (
    <div>
      {data.map((b) => {
        return <Blog key={b.id} blog={b} refreshBlogs={refreshBlogs} />;
      })}
    </div>
  );
};

const Blog = ({ blog, refreshBlogs }) => {
  const [currentBlog, setCurrentBlog] = useState(blog);

  const { title, author, likes, user } = currentBlog;
  const { showToast } = useToast();
  const [view, setView] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    width: "fit-content",
  };

  const updateLike = async (type) => {
    const body = { type: type };
    const [data, error] = await service.likeOrDislike(blog.id, body);
    if (data) {
      showToast(`you ${type}d blog`, "success");
      setCurrentBlog(data);
    }
    if (error) {
      showToast(error, "error");
    }
  };

  const deleteBlog = async () => {
    const [data, error] = await service.deleteBlog(blog.id);
    if (data) {
      showToast(`blog deleted`, "success");
      refreshBlogs();
    }
    if (error) {
      console.log(error);
      showToast(error, "error");
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        <button type="button" onClick={() => setView(!view)}>
          {view ? "hide" : "view"}
        </button>
      </div>
      <div>Title: {title}</div>
      {view && (
        <div>
          {user ? <div> Added by: {user.username} </div> : <></>}
          <div> Author: {author} </div>
          <div>
            Likes: {likes}
            <button type="button" onClick={() => updateLike("like")}>
              like
            </button>
            <button type="button" onClick={() => updateLike("dislike")}>
              dislike
            </button>
            <button type="button" onClick={() => deleteBlog()}>
              delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Loading = () => {
  return <div>loading...</div>;
};

const ErrorFallback = ({ error }) => {
  return <div>Error: {error.message}</div>;
};

export default Blogs;
