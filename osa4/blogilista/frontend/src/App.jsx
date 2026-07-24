import { useState } from "react";
import Blogs from "./blogs/Blogs";
import Login from "./login/Login";
import Toast from "./toast/Toast";
import CreateBlog from "./blogs/CreateBlog";
import blogService from "./services/blogs";

const initialBlogsPromise = blogService.index();

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [blogsPromise, setBlogsPromise] = useState(initialBlogsPromise);

  const logOut = () => {
    window.localStorage.removeItem("user");
    setUsername(null);
  };

  const refreshBlogs = () => {
    setBlogsPromise(blogService.index());
  };

  return (
    <>
      <Toast toast={toast} setToast={setToast} />
      {!user && (
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          setUser={setUser}
          setToast={setToast}
        />
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
        <CreateBlog setToast={setToast} onBlogCreated={refreshBlogs} />
      )}
      {user && <Blogs blogsPromise={blogsPromise} />}
    </>
  );
}

export default App;
