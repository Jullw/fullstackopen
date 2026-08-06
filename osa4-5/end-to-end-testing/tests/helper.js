const { expect } = require("@playwright/test");

const loginWith = async (page, username, password) => {
  await page.getByRole("link", { name: "login" }).click();
  await page.getByRole("button", { name: "login" }).click();
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};
// await page.getByRole("textbox").first().fill("tester");
// await page.getByRole("textbox").last().fill("testeR123");

const createBlog = async (page, content) => {
  await page.getByRole("link", { name: "new blog", exact: true }).click();
  await expect(page).toHaveURL("/create");
  await page.getByRole("button", { name: "new blog", exact: true }).click();

  await page.getByLabel("title").fill(content.title);
  await page.getByLabel("author").fill(content.author);
  await page.getByLabel("url").fill(content.url);
  await page.getByLabel("likes").fill(content.likes.toString());
  await page.getByRole("button", { name: "Create Blog" }).click();
  await expect(page).toHaveURL("/blogs");
};
module.exports = { loginWith, createBlog };
