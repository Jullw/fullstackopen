const Blog = require("../models/blog");
const User = require("../models/user");

const predefinedBlogs = [
  {
    title: "Koodarin päiväkirja",
    author: "Matti Meikäläinen",
    url: "https://example.com/koodarin-paivakirja",
    likes: 7,
  },
  {
    title: "React helposti haltuun",
    author: "Liisa Virtanen",
    url: "https://example.com/react-helposti-haltuun",
    likes: 12,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "remove",
    url: "wwwww.removesoon.fi",
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate("user", {
    name: 1,
    username: 1,
  });
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  predefinedBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
