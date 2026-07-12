const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);

  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};

  let mostLiked = blogs[0];

  blogs.forEach((element) => {
    if (element.likes > mostLiked.likes) {
      mostLiked = element;
    }
  });
  return mostLiked;
};

/*  Return object type
 *   {
 *       author: "Arthut..."
 *       blogs: 3
 *   }
 */
const authorWithMostBlogs = (blogs) => {
  if (blogs.length === 0) return {};

  let tempBlog = [];
  const author = {
    author: "",
    blogs: 0,
  };

  blogs.forEach((blog) => {
    const count = (tempBlog[blog.author] = (tempBlog[blog.author] ?? 0) + 1);

    if (count > author.blogs) {
      author.blogs = count;
      author.author = blog.author;
    }
  });

  return author;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};

  let tempBlog = [];
  const author = {
    author: "",
    likes: 0,
  };

  blogs.forEach((blog) => {
    const likes = (tempBlog[blog.author] =
      blog.likes + (tempBlog[blog.author] ?? 0));

    if (likes > author.likes) {
      author.likes = likes;
      author.author = blog.author;
    }
  });

  return author;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  authorWithMostBlogs,
  mostLikes,
};
