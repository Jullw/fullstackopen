import { useRef, useState, useEffect } from "react";
import Blogs from "./blogs/Blogs";
import Login from "./login/Login";
import Toast from "./toast/Toast";
import CreateBlog from "./blogs/CreateBlog";
import blogService, { setToken } from "./services/blogs";
import Togglable from "./toggable/Toggable";
import { getStoredUser } from "./utils/storage";

const initialBlogsPromise = blogService.index();

function App() {
  const [user, setUser] = useState(getStoredUser);
  const [blogsPromise, setBlogsPromise] = useState(initialBlogsPromise);

  useEffect(() => {
    setToken(user?.token ?? null);
  }, [user]);

  const blogCreateRef = useRef();

  const logOut = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const onBlogCreateOrCancel = (key) => {
    if (key === "created") {
      refreshBlogs();
    }
    blogCreateRef.current.toggleVisibility();
  };

  const refreshBlogs = () => {
    setBlogsPromise(blogService.index());
  };

  return (
    <>
      <Toast />

      {!user && (
        <Togglable textShow="show login" textHide="hide login">
          <Login setUser={setUser} />
        </Togglable>
      )}
      {user && (
        <div className="header">
          <p>{user.username} logged in</p>
          <button type="button" onClick={logOut}>
            log out
          </button>
        </div>
      )}

      {user && (
        <Togglable
          textShow="create blog"
          textHide="hide blog create"
          ref={blogCreateRef}
        >
          <CreateBlog onAction={onBlogCreateOrCancel} />
        </Togglable>
      )}
      {user && (
        <Blogs blogsPromise={blogsPromise} refreshBlogs={refreshBlogs} />
      )}
    </>
  );
}

export default App;
