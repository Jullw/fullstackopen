import { useEffect, useState } from "react";
import service from "./blogService";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchIndex = async () => {
      const [data, error] = await service.index("/api/blogs");
      data ? setBlogs(data) : alert(error.message || "something went wrong");
    };
    fetchIndex();
  }, []);

  return (
    <div>
      {blogs.map((e) => {
        return (
          <div key={e.id}>
            {" "}
            {e.author} {e.title} {e.likes}{" "}
          </div>
        );
      })}
    </div>
  );
};

export default Blogs;
