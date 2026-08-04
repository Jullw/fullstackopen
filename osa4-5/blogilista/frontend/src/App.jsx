import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import loginService from "./services/login";
import blogService from "./services/blogs";
import { getStoredUser } from "./utils/storage";

const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(getStoredUser());

  const blogFormRef = useRef();
  const notificationTimerRef = useRef(null);

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs);
    });
  }, []);

  useEffect(() => {
    blogService.setToken(user?.token ?? null);
  }, [user]);

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    try {
      const returnedBlog = await blogService.create(blogObject);
      console.log("returnedBlog", returnedBlog);
      setBlogs(blogs.concat(returnedBlog));
      handleNotifcation(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        "success",
      );
    } catch (error) {
      handleNotifcation(error.message, "error");
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await blogService.remove(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      handleNotifcation("Blog deleted successfully", "success");
    } catch (error) {
      handleNotifcation(error.message, "error");
    }
  };

  const updateLike = async (blogId, likeType) => {
    try {
      const updatedBlog = await blogService.likeOrDislike(blogId, {
        type: likeType,
      });

      setBlogs((currentBlogs) =>
        currentBlogs.map((blog) =>
          blog.id === updatedBlog.id ? { ...blog, ...updatedBlog } : blog,
        ),
      );
      handleNotifcation(
        `${capitalize(likeType)} updated  successfully`,
        "success",
      );
    } catch (error) {
      handleNotifcation(error.message, "error");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("user", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      handleNotifcation(`${user.username} logged in successfully`, "success");
    } catch (error) {
      handleNotifcation(error.message, "error");
    }
  };

  const handleNotifcation = (text, type) => {
    clearTimeout(notificationTimerRef.current);

    setMessage({ text, type, id: crypto.randomUUID() });
    notificationTimerRef.current = setTimeout(() => {
      setMessage(null);
      notificationTimerRef.current = null;
    }, 5000);
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button
              onClick={() => {
                logout();
              }}
            >
              logout
            </button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          deleteBlog={deleteBlog}
          updateLike={updateLike}
        />
      ))}

      <Footer />
    </div>
  );
};

export default App;
