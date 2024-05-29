import { useEffect, useState } from "react";
import ApiRequest from "../utils/apiRequest";
import { FiDelete } from "react-icons/fi";
import { RxUpdate } from "react-icons/rx";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    getAllBlogs();
  }, []);

  const getAllBlogs = async () => {
    try {
      const res = await ApiRequest.get("/34/11/19/blog");
      const data = res.data.blogs;

      const formattedBlogs = data.map((item) => ({
        id: item.id,
        blogName: item.blogName,
        templateId: item.templateId,
        categoryId: item.categoryId,
        subcategoryId: item.subcategoryId,
        sections: JSON.parse(item.sections),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        subCategory: item.SubCategory,
      }));

      setBlogs(formattedBlogs);
      setLoading(false);
    } catch (error) {
      setError("Failed to load blogs");
      setLoading(false);
    }
  };

  // const updateBlog = async () => {
  //   try {
  //     const res = await ApiRequest.get("/34/11/19/blog");
  //     const data = res.data.blogs;

  //     const formattedBlogs = data.map((item) => ({
  //       id: item.id,
  //       blogName: item.blogName,
  //       templateId: item.templateId,
  //       categoryId: item.categoryId,
  //       subcategoryId: item.subcategoryId,
  //       sections: JSON.parse(item.sections),
  //       createdAt: item.createdAt,
  //       updatedAt: item.updatedAt,
  //       subCategory: item.SubCategory,
  //     }));

  //     setBlogs(formattedBlogs);
  //     setLoading(false);
  //   } catch (error) {
  //     setError("Failed to load blogs");
  //     setLoading(false);
  //   }
  // };
  const handleDelete = async (blog) => {
    setSelectedBlog(blog);
    try {
      await ApiRequest.delete(
        `/${blog.templateId}/${blog.categoryId}/${blog.subcategoryId}/blog/${blog.id}`
      );
      console.log("Blog deleted");
      getAllBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center bg-gray-100 p-4 ">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="m-4 p-4 bg-white shadow-md rounded-lg w-1/4"
        >
          <div className='flex justify-between mb-2'>
            <div>
              <h2 className="text-xl font-bold mb-2">{blog.blogName}</h2>
            </div>
            <div className='flex items-center gap-5'>
              <button className="text-purple-600 hover:text-purple-800 transition duration-300">
                <RxUpdate size={24} />
              </button>
              <button className="text-red-600 hover:text-red-800 transition duration-300" onClick={() => handleDelete(blog)}>
                <FiDelete size={24} />
              </button>
            </div>
          </div>
          {blog.sections.map((section, index) => (
            <div
              key={index}
              className="bg-purple-200 p-2 mb-2 rounded flex justify-between px-2 items-center"
            >
              <div className="border-r-4 w-3/4 border-slate-300">
                <h3 className="text-lg font-semibold">{section.name}</h3>
                <p>{section.text}</p>
              </div>
              {section.image && (
                <img
                  src={`http://${section.image}`}
                  alt={section.name}
                  className=" w-[20%] h-[50px] mt-2 rounded-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Blog;
