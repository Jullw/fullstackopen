import React, { useState } from "react";
import { Link } from "react-router-dom";

const blogNotFound = () => {
  return <div>Blog not found</div>;
};

const Blog = ({ blog, deleteBlog, updateLike, loggedUser }) => {
  const [view, setView] = useState(false);

  if (!blog) {
    return blogNotFound();
  }

  const { title, author, likes, url, user, id } = blog;

  const userIsOwner =
    blog.user && loggedUser && blog.user.username === loggedUser.username;

  return (
    <div className="blog">
      <div className="blog-header">
        <EmojiButton onClick={() => setView(!view)} text={view ? "🙈" : "👁️"} />
        {userIsOwner && (
          <EmojiButton onClick={() => deleteBlog(blog.id)} text="❌" />
        )}
      </div>
      <Link to={`/blogs/${id}`}>{title}</Link>
      {view && (
        <div>
          {user ? <div> Added by: {user.username} </div> : <></>}
          <div> Author: {author} </div>
          <div> URL: {url} </div>
          <div>
            Likes: {likes}
            {loggedUser && (
              <EmojiButton
                onClick={() => updateLike(blog.id, "dislike")}
                text="👎"
              />
            )}
            {loggedUser && (
              <EmojiButton
                onClick={() => updateLike(blog.id, "like")}
                text="👍"
              />
            )}
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
