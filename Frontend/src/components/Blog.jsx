import { useEffect, useState } from "react";
import ApiRequest from "../utils/apiRequest";
import { FiDelete } from "react-icons/fi";
import { RxUpdate } from "react-icons/rx";
import CreateBlogForm from "./CreateBlogForm";
import { toast } from "react-toastify";
import UpdateBlogForm from "./UpdateBlogForm";
import ShowBlog from "./ShowBlog";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showUpdateBlog, setShowUpdateBlog] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);
  const [updateBlogId, setUpdateBlogId] = useState(null);
  const [blogId, setBlogId] = useState(null);

  // Fetch Templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await ApiRequest.get("/template");
        setTemplates(res.data.templates);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch templates.");
      }
    };

    fetchTemplates();
  }, []);

  // Fetch All Blogs
  useEffect(() => {
    fetchAllBlogs();
  }, [selectedTemplateId, selectedCategoryId, selectedSubCategoryId]);

  const fetchAllBlogs = async () => {
    if (!selectedTemplateId) {
      setBlogs([]);
      setLoading(false);
      return;
    }

    let apiUrl;
    if (selectedCategoryId) {
      apiUrl = `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog`;
    } else {
      apiUrl = `/${selectedTemplateId}/${selectedSubCategoryId}/blog`;
    }

    try {
      const res = await ApiRequest.get(apiUrl);
      const data = res?.data?.blogs;
      const formattedBlogs = data.map((item) => ({
        id: item.id,
        titleTag: item.titleTag || null,
        metaTag: item.metaTag || null,
        blogName: item.blogName,
        blogDescription: item.blogDescription,
        blogTitle: item.blogTitle,
        titleDescription: item.titleDescription,
        slug: item.slug,
        blogImage: item.blogImage,
        status: item.status,
        templateId: item.templateId,
        categoryId: item.categoryId,
        subcategoryId: item.subcategoryId,
        sections: JSON.parse(item.sections),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        subCategory: item.SubCategory,
      }));

      console.log("Formatted Blogs", blogs);

      setBlogs(formattedBlogs);
      console.log("blog", blogs);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load blogs");
      setLoading(false);
    }
  };

  // Set Categories and show Categories
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

  // Fetch SubCategories if no categories
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedTemplateId && categories.length === 0) {
        try {
          const subcategoryRes = await ApiRequest.get(
            `/${selectedTemplateId}/subcategory`
          );
          const subcategoriesData = subcategoryRes.data.subCategories;
          setSubCategories(subcategoriesData);
          setShowSubCategories(true);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
          setError("Failed to fetch subcategories.");
        }
      }
    };

    fetchSubCategories();
  }, [categories, selectedTemplateId]);

  // Set subCategories and show SubCategories
  useEffect(() => {
    if (selectedCategoryId) {
      const selectedCategory = categories.find(
        (c) => c.id === parseInt(selectedCategoryId)
      );
      setSubCategories(selectedCategory ? selectedCategory.SubCategories : []);
      setShowSubCategories(true);
    } else {
      setShowSubCategories(false);
    }
  }, [selectedCategoryId, categories]);

  // Handle Template Select
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setShowBlog(false);
  };

  // Handle Category Select
  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null);
    setShowBlog(false);
  };

  // Handle SubCategory Select
  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
    setShowBlogs(true);
    setShowBlog(false);
  };

  const handleShowCreateBlog = () => {
    setShowCreateBlog(!showCreateBlog);
    setShowUpdateBlog(false);
    setShowBlog(false);
  };

  const handleDeleteBlog = async (blog) => {
    let apiUrl;
    if (selectedCategoryId) {
      apiUrl = `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog`;
    } else {
      apiUrl = `/${selectedTemplateId}/${selectedSubCategoryId}/blog`;
    }
    try {
      await ApiRequest.delete(apiUrl);

      toast.success("Blog Deleted Successfully");
      fetchAllBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateBlog(false);
    setShowUpdateBlog(false);
    fetchAllBlogs();
  };

  const handleCancelShowUpdate = () => {
    setShowUpdateBlog(false);
  };

  const handleUpdateBlog = (blog) => {
    setUpdateBlogId(blog.id);
    setShowUpdateBlog(true);
    setShowBlog(false);
  };

  const handleBlogShow = (id) => {
    setBlogId(id);
    setShowBlog(!showBlog);
    setShowBlogs(false);
  };

  const handleBackButton = () => {
    setShowBlog(false);
    setShowBlogs(true);
  };

  function limitDescription(text, sentenceLimit) {
    const words = text.split(".");
    const limitSentence = words.slice(0, sentenceLimit);
    const limitedText = limitSentence.join("");
    return limitedText;
  }

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

  // Filtered Templates
  const filteredTemplates = templates.filter((template) =>
    ["product", "solution"].includes(template.templateName.toLowerCase())
  );

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

      <div className="rounded-lg p-6 mb-6">
        {!showCreateBlog && !showUpdateBlog && showTemplates && (
          <ul className="flex flex-wrap justify-center gap-4 border-4 rounded-full w-full max-w-4xl mx-auto mb-5 px-5 py-2">
            {filteredTemplates.map((item) => (
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

        {/* Show Category */}
        {!(categories.length === 0)
          ? !showCreateBlog &&
            !showUpdateBlog &&
            showCategories && (
              <ul className="flex flex-wrap justify-center gap-4 border-4 rounded-full w-full max-w-4xl mx-auto mb-5 px-5 py-2">
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
            )
          : null}

        {/* Show Sub Category */}
        {!showCreateBlog && !showUpdateBlog && showSubCategories && (
          <ul className="flex flex-wrap justify-center gap-4 border-4 rounded-full w-full max-w-4xl mx-auto mb-5 px-5 py-2">
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

      {/* Show Blog */}
      {showBlog && (
        <ShowBlog
          selectedTemplateId={selectedTemplateId}
          selectedCategoryId={selectedCategoryId}
          selectedSubCategoryId={selectedSubCategoryId}
          blogId={blogId}
          handleBack={handleBackButton}
        />
      )}

      {/* Create Blog Form */}
      {showCreateBlog && (
        <CreateBlogForm
          selectedTemplateId={selectedTemplateId}
          selectedCategoryId={selectedCategoryId}
          selectedSubCategoryId={selectedSubCategoryId}
          onCreateSuccess={handleCreateSuccess}
        />
      )}

      {/* Update Blog Form */}
      {showUpdateBlog && (
        <UpdateBlogForm
          onCreateSuccess={handleCreateSuccess}
          selectedTemplateId={selectedTemplateId}
          selectedCategoryId={selectedCategoryId}
          selectedSubCategoryId={selectedSubCategoryId}
          blogId={updateBlogId}
          handleCancel={handleCancelShowUpdate}
        />
      )}

      {/* Show Blogs */}
      {!showCreateBlog && !showUpdateBlog && showBlogs && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
              >
                <div
                  className="flex justify-center bg-purple-500 p-4 text-xl font-semibold text-white"
                  onClick={() => handleBlogShow(blog.id)}
                >
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg">{blog.blogName}</h2>
                    <p className="text-sm text-white/85">
                      {limitDescription(blog.blogDescription, 1)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-100">
                  <button
                    className="text-purple-600 hover:text-purple-800 transition duration-300"
                    onClick={() => handleUpdateBlog(blog)}
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
            ))
          ) : (
            <p className="text-center col-span-full">"No blogs Found"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
