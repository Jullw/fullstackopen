const Blog = require("../models/blog");

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
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  predefinedBlogs,
  nonExistingId,
  blogsInDb,
};
