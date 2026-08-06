const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div className="mt-4 flex flex-col justify-center items-center">
      <h2 className="">Login</h2>

      <form
        className="grid w-fit grid-cols-[max-content_1fr] items-center gap-2"
        onSubmit={handleSubmit}
      >
        <div className="contents">
          <label className="contents">
            username
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div className="contents">
          <label className="contents">
            password
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button className="col-start-2 basic-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
