const { test, after, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

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

beforeEach(async () => {
  await Blog.deleteMany({});
  let blog = new Blog(predefinedBlogs[0]);
  await blog.save();
  blog = new Blog(predefinedBlogs[1]);
  await blog.save();
});

describe("api tests", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs count equal 2", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, predefinedBlogs.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const contents = response.body.map((e) => e.title);
    assert(contents.includes("Koodarin päiväkirja"), true);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
