const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);

  return total;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};

  let mostLiked = blogs[0];

  blogs.forEach((element) => {
    if (element.likes > mostLiked.likes) {
      mostLiked = element;
    }
  });
  return mostLiked;
};

module.exports = { dummy, totalLikes, mostLikes };
