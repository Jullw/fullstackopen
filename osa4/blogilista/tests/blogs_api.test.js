const { test, after, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const jwt = require("jsonwebtoken");

const api = supertest(app);
let testUser;
let testToken;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  testUser = await new User({
    name: "Matti Meikalainen",
    username: "MatMei3",
    passwordHash: "expltrL1ENWX4mWAWyAPOHhv0ti8XqqgHi",
  }).save();

  const userForToken = {
    username: testUser.username,
    id: testUser._id,
  };

  testToken = jwt.sign(userForToken, process.env.SECRET);

  const blogObjects = helper.predefinedBlogs.map(
    (blog) => new Blog({ ...blog, user: testUser._id }),
  );
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  // Toinen tapa ja jos järjestyksellä on väliä
  //   for (let blog of predefinedBlogs) {
  //   let blogObject = new Blog(blog)
  //   await blogObject.save()
  // }
  //  Kolmas tapa
  //  await Blog.insertMany(helper.predefinedBlogs)
});

describe("api tests", () => {
  describe("index of blog", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("blog return json has key id instead _id", async () => {
      const blogs = await helper.blogsInDb();

      blogs.forEach((blog) => {
        assert.ok(Object.hasOwn(blog, "id"));
        assert.ok(!Object.hasOwn(blog, "_id"));
      });
    });

    test("blogs count equal 2", async () => {
      const blogs = await helper.blogsInDb();
      assert.strictEqual(blogs.length, helper.predefinedBlogs.length);
    });

    test("a specific blog is within the returned blogs", async () => {
      const blogs = await helper.blogsInDb();
      const contents = blogs.map((e) => e.title);
      assert(contents.includes("Koodarin päiväkirja"), true);
    });
  });

  describe("viewing a specific blog", () => {
    test("a specific blog can be viewed", async () => {
      const blogs = await helper.blogsInDb();
      const blogToView = blogs[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test("non existing id, blog not found", async () => {
      const invalidId = await helper.nonExistingId();
      await api.get(`/api/blogs/${invalidId}`).expect(404);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe("create a blog", () => {
    test("valid blog can be created", async () => {
      const newBlog = {
        title: "Testaajan Arki",
        author: "Tepi Testaaja",
        url: "wwww.testaajanarki.exp.fi",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${testToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await helper.blogsInDb();

      const contents = blogs.map((e) => e.title);
      assert.strictEqual(blogs.length, helper.predefinedBlogs.length + 1);
      assert(contents.includes("Testaajan Arki"), true);
    });

    test("blog created without likes put zero as likes", async () => {
      const newBlog = {
        title: "Testaajan Arki",
        author: "Tepi Testaaja",
        url: "wwww.testaajanarki.exp.fi",
      };

      const result = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${testToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(result.body.likes, 0);

      const blogs = await helper.blogsInDb();
      const createdBlog = blogs.find((e) => e.id === result.body.id);

      assert.strictEqual(createdBlog.likes, 0);
    });

    test("invalid blog can't be created", async () => {
      const newBlog = {
        title: "Testaajan Arki",
        author: "Tepi Testaaja",
        userId: testUser.id,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${testToken}`)
        .send(newBlog)
        .expect(400);

      const blogs = await helper.blogsInDb();
      assert.strictEqual(blogs.length, helper.predefinedBlogs.length);
    });
  });

  describe("delete a blog", () => {
    test("a blog can be deleted with valid id", async () => {
      const blogsInStart = await helper.blogsInDb();
      const blogToDelete = blogsInStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(204);

      const blogsInEnd = await helper.blogsInDb();
      const ids = blogsInEnd.map((blog) => blog.id);

      assert(!ids.includes(blogToDelete.id));
      assert.strictEqual(blogsInEnd.length, helper.predefinedBlogs.length - 1);
    });
  });

  describe("blog update", () => {
    test("with valid id and body blog can be updated", async () => {
      const blogsInStart = await helper.blogsInDb();
      const blogToUpdate = blogsInStart[0];
      blogToUpdate.likes = 100;

      const result = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(blogToUpdate)
        .expect(200);

      const blogsInEnd = await helper.blogsInDb();
      const updatedBlog = blogsInEnd.find((e) => e.id === result.body.id);

      assert.strictEqual(updatedBlog.likes, 100);
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
