import React, { useState } from "react";

const Blog = ({ blog, deleteBlog, updateLike }) => {
  const [view, setView] = useState(false);
  const { title, author, likes, url, user } = blog;
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
          <div> URL: {url} </div>
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
