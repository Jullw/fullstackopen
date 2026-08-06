import { Link } from "react-router-dom";

const Navbar = ({ user, logout }) => {
  const loggedInUser = () => (
    <div className="flex items-center justify-end flex-grow gap-5 mr-2">
      <div>{user.name} logged in </div>
      <div>
        <button
          className="p-1 bg-black text-white hover:cursor-pointer border-white rounded-md"
          onClick={logout}
        >
          logout
        </button>
      </div>
    </div>
  );

  const styledLink = (to, link) => {
    return (
      <Link className="nav-link" to={to}>
        {link}
      </Link>
    );
  };
  return (
    <div className="flex flex-row items-center pl-2 gap-5 min-h-12 border-0 border-b border-solid ">
      {styledLink("/", "home")}
      {styledLink("/blogs", "blogs")}
      {styledLink("/create", "new blog")}
      {styledLink("/login", "login")}
      {user && loggedInUser()}
    </div>
  );
};

export default Navbar;
