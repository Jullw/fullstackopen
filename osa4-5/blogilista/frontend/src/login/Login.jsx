import { useState } from "react";
import loginService from "../services/login";
import { useToast } from "../toast/ToastContext";

const Login = ({ setUser }) => {
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const [user, error] = await loginService.login({ username, password });

    if (user) {
      setUser(user);
      setUsername("");
      setPassword("");
      showToast(`${user.username} logged in successfully`, "success");
      return;
    }
    showToast(`${error}`, "error");
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
