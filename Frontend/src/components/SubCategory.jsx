import { useEffect, useState } from "react";
import { RxUpdate } from "react-icons/rx";
import { FiDelete } from "react-icons/fi";
import { toast } from "react-toastify";
import ApiRequest from "../utils/apiRequests";

const SubCategory = () => {
  const [subCategory, setSubCategory] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [showCreateSubCategory, setShowCreateSubCategory] = useState(false);
  const [showUpdateSubCategory, setShowUpdateSubCategory] = useState(false);
  const [updateSubCategoryName, setUpdateSubCategoryName] = useState(null);
  const [updateSubCategoryId, setUpdateSubCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  console.log("subcategories", subCategory);

  useEffect(() => {
    getTemplate();
  }, []);

  useEffect(() => {
    if (selectedTemplateId) {
      const selectedTemplate = template.find(
        (t) => t.id === parseInt(selectedTemplateId)
      );
      setCategory(selectedTemplate ? selectedTemplate.Categories : []);
      console.log(selectedTemplate);
      if (selectedTemplate && selectedTemplate.Categories.length === 0) {
        getAllSubCategory();
      }
      setShowCategories(true);
    } else {
      setShowCategories(false);
    }
  }, [selectedTemplateId, template]);

  const getAllSubCategory = async (categoryId) => {
    // console.log("sub category", categoryId);
    try {
      if (!categoryId) {
        setLoading(true);
        const res = await ApiRequest.get(`/${selectedTemplateId}/subcategory`);
        console.log(res);
        setSubCategory(res.data.subCategories);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      setLoading(true);

      const res = await ApiRequest.get(
        `/${selectedTemplateId}/${categoryId}/subcategory`
      );
      setSubCategory(res.data.subCategories);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to fetch subcategories.");
    }
  };

  const getTemplate = async () => {
    try {
      const res = await ApiRequest.get("/template");
      setTemplate(res.data.templates);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch templates.");
    }
  };

  const handleShowCreateSubCategory = () => {
    setShowCreateSubCategory(!showCreateSubCategory);
    setShowUpdateSubCategory(false);
  };

  const handleShowUpdateSubCategory = (id, name) => {
    setUpdateSubCategoryId(id);
    setUpdateSubCategoryName(name);
    setShowUpdateSubCategory(!showUpdateSubCategory);
    setShowCreateSubCategory(false);
  };

  const handleCreateSubCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedCategoryId) {
        const newSubCategory = await ApiRequest.post(
          `/${selectedTemplateId}/${selectedCategoryId}/subcategory`,
          {
            subCategoryName,
          }
        );
        setShowCreateSubCategory(false);
        setSubCategoryName("");
        toast.success(newSubCategory.data.message);
        getAllSubCategory(selectedCategoryId);
      } else {
        const newSubCategory = await ApiRequest.post(
          `/${selectedTemplateId}/subcategory`,
          {
            subCategoryName,
          }
        );
        setShowCreateSubCategory(false);
        setSubCategoryName("");
        toast.success(newSubCategory.data.message);
        getAllSubCategory(selectedCategoryId);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to create subcategory.");
    }
  };

  const handleUpdateSubCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedSubCategory = await ApiRequest.put(
        `/${selectedTemplateId}/${selectedCategoryId}/subcategory/${updateSubCategoryId}`,
        {
          subCategoryName: updateSubCategoryName,
        }
      );
      setShowUpdateSubCategory(false);
      setUpdateSubCategoryName("");
      toast.success(updatedSubCategory.data.message);
      getAllSubCategory(selectedCategoryId);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      setLoading(true);
      const res = await ApiRequest.delete(
        `/${selectedTemplateId}/${selectedCategoryId}/subcategory/${id}`
      );
      setSubCategory(subCategory.filter((category) => category.id !== id));
      setLoading(false);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to delete subcategory.");
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    // When a template is selected, reset the selected category and subcategory
    setSelectedCategoryId(null);
    // setSubCategory([]);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    getAllSubCategory(categoryId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-end mb-6">
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300"
          onClick={handleShowCreateSubCategory}
        >
          {showCreateSubCategory ? "Cancel" : "Create New Sub Category"}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 pb-2">
        Sub Categories
      </h1>

      <div className="rounded-lg p-6 mb-6">
        {!showCreateSubCategory && !showUpdateSubCategory && (
          <ul className="flex flex-wrap justify-center gap-4 border-4 rounded-full w-full max-w-4xl mx-auto mb-5 px-5 py-2">
            {template.map((item) => (
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

        {!showCreateSubCategory && !showUpdateSubCategory && showCategories && (
          <ul className="flex flex-wrap justify-center gap-4 border-4 rounded-full w-full max-w-4xl mx-auto mb-5 px-5 py-2">
            {category.map((item) => (
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
      </div>
      {/* -------------------- Create Sub Category Form -------------------------------- */}
      {showCreateSubCategory && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <form
            onSubmit={handleCreateSubCategory}
            className="flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold mb-4">
              Create New Sub Category
            </h2>
            <input
              type="text"
              placeholder="Enter Sub Category Name"
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-300"
            >
              {loading ? "Creating..." : "Submit"}
            </button>
          </form>
        </div>
      )}
      {/* -------------------- Create Update Category Form -------------------------------- */}

      {showUpdateSubCategory && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <button
            className="bg-purple-600 p-2 rounded-md text-white"
            onClick={handleShowUpdateSubCategory}
          >
            {showUpdateSubCategory ? "Cancel" : ""}
          </button>
          <form
            onSubmit={handleUpdateSubCategory}
            className="flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold mb-4">Update Sub Category</h2>
            <input
              type="text"
              placeholder="Enter Sub Category Name"
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={updateSubCategoryName}
              onChange={(e) => setUpdateSubCategoryName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-6 rounded-full hover:bg-yellow-600 transition duration-300"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}

      {!showCreateSubCategory && !showUpdateSubCategory && subCategory && (
        <div>
          {loading ? (
            <p className="text-center col-span-full">Loading...</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {subCategory.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg p-4 shadow-md flex justify-between items-center"
                >
                  <span className="font-semibold text-lg">
                    {category.subCategoryName}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 text-white p-2 rounded-md"
                      onClick={() =>
                        handleShowUpdateSubCategory(
                          category.id,
                          category.subCategoryName
                        )
                      }
                    >
                      <RxUpdate />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-md"
                      onClick={() => handleDeleteSubCategory(category.id)}
                    >
                      <FiDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubCategory;
