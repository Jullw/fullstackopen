import { useEffect } from "react";
import loginService from "../services/login";
import { setToken } from "../services/blogs";

const Login = ({
  username,
  setUsername,
  password,
  setPassword,
  setUser,
  setToast,
}) => {
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    const [user, error] = await loginService.login({ username, password });

    if (user) {
      setUser(user);
      setUsername("");
      setPassword("");
      setToast({
        id: crypto.randomUUID(),
        message: `${user.username} logged in successfully`,
        type: "success",
      });
      return;
    }

    setToast({
      id: crypto.randomUUID(),
      message: error,
      type: "error",
    });
  };
  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default Login;
