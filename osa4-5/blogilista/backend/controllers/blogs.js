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

  await result.populate("user", {
    name: 1,
    username: 1,
  });

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
  console.log(request.user);
  if (blog.user && blog.user.toString() === request.user.id.toString()) {
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

  if (!blog) {
    return response.status(404).end();
  }

  if (blog.user?.toString() !== request.user.id.toString()) {
    return response
      .status(403)
      .json({ error: "only the creator can edit this blog" })
      .end();
  }

  const { title, author, url, likes } = request.body;

  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes ?? blog.likes ?? 0;

  const updatedBlog = await blog.save();
  return response.status(200).json(updatedBlog);
});

blogsRouter.patch("/like/:id", userAthorization, async (request, response) => {
  const { type } = request.body ?? {};

  if (!["like", "dislike"].includes(type)) {
    return response.status(400).json({
      error: "type must be like or dislike",
    });
  }
  const amount = type === "like" ? 1 : -1;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $inc: { likes: amount } },
    {
      new: true,
      runValidators: true,
    },
  ).populate("user", {
    name: 1,
    username: 1,
  });

  if (!updatedBlog) {
    return response.status(404).end();
  }
  return response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
