import { useState } from "react";
import Blogs from "./blogs/Blogs";
import Login from "./login/Login";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Login
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
      <Blogs />
    </>
  );
}

export default App;
