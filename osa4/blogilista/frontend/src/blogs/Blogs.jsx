import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Blogs = ({ blogsPromise }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[blogsPromise]}>
      <Suspense fallback={<Loading />}>
        <ShowBlogs blogsPromise={blogsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
};

const ShowBlogs = ({ blogsPromise }) => {
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
