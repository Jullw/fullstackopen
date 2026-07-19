const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userAthorization } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  return response.json(blogs);
});

blogsRouter.post("/", userAthorization, async (request, response) => {
  const body = request.body;

  const user = await User.findById(request.user.id);

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const result = await newBlog.save();

  user.blogs = user.blogs.concat(result.id);
  await user.save();

  return response.status(201).json(result);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    name: 1,
    username: 1,
  });

  if (blog) {
    response.status(200).json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", userAthorization, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(blog._id);
    response.status(204).end();
  }

  response
    .status(403)
    .json({ error: "only the creator can delete this blog" })
    .end();
});

blogsRouter.put("/:id", userAthorization, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog.user?.toString() !== request.user.id.toString()) {
    response
      .status(403)
      .json({ error: "only the creator can edit this blog" })
      .end();
  }

  blog.likes = request.body.likes;

  const updatedBlog = await blog.save();
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
