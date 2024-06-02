import { useEffect, useState } from "react";
import ApiRequest from "../utils/apiRequest";
import { FiDelete } from "react-icons/fi";
import { RxUpdate } from "react-icons/rx";
import CreateBlogForm from "./CreateBlogForm";
import { toast } from 'react-toastify';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showUpdateBlog, setShowUpdateBlog] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);

  console.log("blogs", blogs);

  // -------------------------- Fetch Templates  -------------------------------------------
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await ApiRequest.get("/template");
        setTemplates(res.data.templates);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch templates.");
      }
    };

    fetchTemplates();
  }, []);

  // -------------------------- Fetch All Blogs  -------------------------------------------
  useEffect(() => {
    fetchAllBlogs();
  }, [selectedTemplateId, selectedCategoryId, selectedSubCategoryId]);

  const fetchAllBlogs = async () => {
    if (!selectedTemplateId || !selectedCategoryId || !selectedSubCategoryId) {
      setBlogs([]);
      setLoading(false);
      return;
    }

    try {
      const res = await ApiRequest.get(
        `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog`
      );
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
  //  -------------------------  Set Categories and show Categories ------------------------
  useEffect(() => {
    if (selectedTemplateId) {
      const selectedTemplate = templates.find(
        (t) => t.id === parseInt(selectedTemplateId)
      );
      setCategories(selectedTemplate ? selectedTemplate.Categories : []);
      setShowCategories(true);
    } else {
      setShowCategories(false);
    }
  }, [selectedTemplateId, templates]);

  //  -------------------------  Set subCategories and show SubCategories ------------------------
  useEffect(() => {
    if (selectedCategoryId) {
      const selectedCategory = categories.find(
        (c) => c.id === parseInt(selectedCategoryId)
      );
      // console.log("Selected Category Id", selectedCategoryId)
      // console.log("Selected Category", selectedCategory)
      setSubCategories(selectedCategory ? selectedCategory.SubCategories : []);
      console.log("selected sub categories", selectedCategory.subCategories);
      setShowSubCategories(true);
    } else {
      setShowSubCategories(false);
    }
  }, [selectedCategoryId, categories]);

  // ------------------------ Handle Template Select ---------------------------------------------
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
  };
  // ------------------------ Handle Category Select ---------------------------------------------

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null);
  };

  // ------------------------ Handle SubCategory Select ---------------------------------------------
  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
  };

  const handleShowCreateBlog = () => setShowCreateBlog(!showCreateBlog);

  const handleDeleteBlog = async (blog) => {
    setSelectedBlog(blog);
    try {
      await ApiRequest.delete(
        `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog/${blog.id}`
      );
      console.log("Blog deleted");
      toast.success("Blog Deleted Successfully");
      fetchAllBlogs();
      console.log("Blog fetched");
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateBlog(false);
    fetchAllBlogs();
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-end mb-6">
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300"
          onClick={handleShowCreateBlog}
        >
          {showCreateBlog ? "Cancel" : "Create New Blog"}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 pb-2">
        Blogs
      </h1>

      {/* -----------------------  Show Template ----------------------------------- */}
      <div className="rounded-lg p-6 mb-6">
        {!showCreateBlog && !showUpdateBlog && (
          <ul className="flex flex-row justify-around gap-4 border-4 rounded-full w-[600px] mx-2 mb-5 px-5 py-2">
            {templates.map((item) => (
              <li
                key={item.id}
                onClick={() => handleTemplateSelect(item.id)}
                className={`cursor-pointer px-4 py-2 rounded-full transition-colors duration-300 ${
                  selectedTemplateId === item.id
                    ? "bg-purple-500 text-white"
                    : " text-black hover:bg-purple-200"
                }`}
              >
                {item.templateName}
              </li>
            ))}
          </ul>
        )}

        {/* -----------------------  Show Category ----------------------------------- */}

        {!showCreateBlog && !showUpdateBlog && showCategories && (
          <ul className="flex flex-row justify-around gap-4 border-4 rounded-full w-[600px] mx-2 mb-5 px-5 py-2">
            {categories.map((item) => (
              <li
                key={item.id}
                onClick={() => handleCategorySelect(item.id)}
                className={`cursor-pointer px-4 py-2 rounded-full transition-colors duration-300 ${
                  selectedCategoryId === item.id
                    ? "bg-purple-500 text-white"
                    : " text-black hover:bg-purple-200"
                }`}
              >
                {item.categoryName}
              </li>
            ))}
          </ul>
        )}
        {/* -----------------------  Show Sub Category ----------------------------------- */}

        {!showCreateBlog && !showUpdateBlog && showSubCategories && (
          <ul className="flex flex-row justify-around gap-4 border-4 rounded-full w-[600px] mx-2 mb-5 px-5 py-2">
            {subCategories.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSubCategorySelect(item.id)}
                className={`cursor-pointer px-4 py-2 rounded-full transition-colors duration-300 ${
                  selectedSubCategoryId === item.id
                    ? "bg-purple-500 text-white"
                    : " text-black hover:bg-purple-200"
                }`}
              >
                {item.subCategoryName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*----------------- Show Create Blog Form --------------------------------  */}

      {showCreateBlog && (
        <CreateBlogForm
          onSuccess={handleCreateSuccess}
          selectedTemplateId={selectedTemplateId}
          selectedCategoryId={selectedCategoryId}
          selectedSubCategoryId={selectedSubCategoryId}
          onCreateSuccess={handleCreateSuccess}
        />
      )}

      {/*----------------- Show Blogs --------------------------------  */}

      {!showCreateBlog && !showUpdateBlog && (
        <div>
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center justify-center bg-purple-500 p-4 h-24 text-xl font-semibold text-white">
                    <h2>{blog.blogName}</h2>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-100">
                    <button
                      className="text-purple-600 hover:text-purple-800 transition duration-300"
                      onClick={() => setShowUpdateBlog(true)}
                    >
                      <RxUpdate size={24} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition duration-300"
                      onClick={() => handleDeleteBlog(blog)}
                    >
                      <FiDelete size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center col-span-full">No blogs available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
