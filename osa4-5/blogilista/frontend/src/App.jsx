import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Navbar from "./components/Navbar";
import loginService from "./services/login";
import blogService from "./services/blogs";
import { getStoredUser } from "./utils/storage";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import Home from "./components/Home";

const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(getStoredUser());
  const navigate = useNavigate();
  const blogFormRef = useRef();

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

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
      setBlogs(blogs.concat(returnedBlog));
      handleNotifcation(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        "success",
      );
      navigate("/blogs");
    } catch (error) {
      handleNotifcation(error.message, "error");
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await blogService.remove(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      handleNotifcation("Blog deleted successfully", "success");
      navigate("/blogs");
    } catch (error) {
      handleNotifcation(error.message, "error");
    }
  };

  const updateLike = async (blogId, likeType) => {
    if (!user) return;

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

  const handleLogin = async () => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("user", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      handleNotifcation(`${user.username} logged in successfully`, "success");
      navigate("/blogs");
    } catch (error) {
      handleNotifcation(error.message, "error");
    }
  };

  const handleNotifcation = (text, type) => {
    setMessage({ text, type, id: crypto.randomUUID() });
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
    navigate("/blogs");
  };

  const sortedBlogs = [...blogs].sort(
    (a, b) => (b.likes ?? 0) - (a.likes ?? 0),
  );

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
    <div className="flex flex-col min-h-svh">
      <Notification message={message} />
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route
          path="/blogs"
          element={
            <div className="mt-4 flex flex-col items-center flex-grow">
              {sortedBlogs.map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  deleteBlog={deleteBlog}
                  updateLike={updateLike}
                  loggedUser={user}
                />
              ))}
            </div>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <div className="mt-4 flex flex-col justify-center items-center">
              <Blog
                key={blog?.id}
                blog={blog}
                deleteBlog={deleteBlog}
                updateLike={updateLike}
                loggedUser={user}
              />
            </div>
          }
        />
        <Route
          path="/create"
          element={
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user && loginForm()} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
