const loginWith = async (page, username, password) => {
  await page.getByRole("button", { name: "login" }).click();
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};
// await page.getByRole("textbox").first().fill("tester");
// await page.getByRole("textbox").last().fill("testeR123");

const createBlog = async (page, content) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByLabel("title").fill(content.title);
  await page.getByLabel("author").fill(content.author);
  await page.getByLabel("url").fill(content.url);
  await page.getByLabel("likes").fill(content.likes.toString());
  await page.getByRole("button", { name: "Create Blog" }).click();
  // hidastaa testejä, mutta varmistaa että blogi on varmasti luotu ennen kuin jatketaan
  await page.getByText(`Title: ${content.title}`).waitFor();
};
module.exports = { loginWith, createBlog };
