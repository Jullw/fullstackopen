import { use, Suspense } from "react";
import service from "../services/blogs";
import { ErrorBoundary } from "react-error-boundary";

const blogsPromise = service.index("/api/blogs");

const Blogs = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <ShowBlogs />
      </Suspense>
    </ErrorBoundary>
  );
};

const ShowBlogs = () => {
  const data = use(blogsPromise);
  return (
    <div>
      {data.map((b) => {
        return <Blog key={b.id} blog={b} />;
      })}
    </div>
  );
};

const Blog = ({ blog }) => {
  const { title, author, likes, user } = blog;

  return (
    <div
      style={{
        borderBottom: "1px dotted black",
        padding: "0.2rem",
        width: "fit-content",
      }}
    >
      {user ? <div> Added by: {user.username} </div> : <></>}
      Title: {title}, Author: {author}, Likes: {likes}{" "}
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
