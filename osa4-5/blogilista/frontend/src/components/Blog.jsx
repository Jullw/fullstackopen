import React, { useState } from "react";

const Blog = ({ blog, deleteBlog, updateLike }) => {
  const [view, setView] = useState(false);
  const { title, author, likes, user } = blog;
  return (
    <div className="blog">
      <div className="blog-header">
        <EmojiButton onClick={() => setView(!view)} text={view ? "🙈" : "👁️"} />
        <EmojiButton onClick={() => deleteBlog(blog.id)} text="❌" />
      </div>
      <div>Title: {title}</div>
      {view && (
        <div>
          {user ? <div> Added by: {user.username} </div> : <></>}
          <div> Author: {author} </div>
          <div>
            Likes: {likes}
            <EmojiButton
              onClick={() => updateLike(blog.id, "dislike")}
              text="👎"
            />
            <EmojiButton
              onClick={() => updateLike(blog.id, "like")}
              text="👍"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const EmojiButton = ({ text, onClick }) => {
  return (
    <button
      className="emoji-button"
      onClick={onClick}
      aria-label={text}
      title={text}
      type="button"
    >
      <span className="outlined-emoji"> {text} </span>
    </button>
  );
};

export default Blog;

// const Blog = ({ blog }) => {
//   const [currentBlog, setCurrentBlog] = useState(blog);

//   const { title, author, likes, user } = currentBlog;
//   const { showToast } = useToast();
//   const [view, setView] = useState(false);

//   const updateLike = async (type) => {
//     const body = { type: type };
//     const [data, error] = await service.likeOrDislike(blog.id, body);
//     if (data) {
//       showToast(`you ${type}d blog`, "success");
//       setCurrentBlog(data);
//     }
//     if (error) {
//       showToast(error, "error");
//     }
//   };

//   const deleteBlog = async () => {
//     const [data, error] = await service.deleteBlog(blog.id);
//     if (data) {
//       showToast(`blog deleted`, "success");
//       refreshBlogs();
//     }
//     if (error) {
//       console.log(error);
//       showToast(error, "error");
//     }
//   };
