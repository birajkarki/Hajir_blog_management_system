import { useEffect, useState } from "react";
import ApiRequest from "../utils/apiRequest";
import { RxUpdate } from "react-icons/rx";
import { FiDelete } from "react-icons/fi";
import { toast } from "react-toastify";

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

  useEffect(() => {
    getTemplate();
  }, []);

  useEffect(() => {
    if (selectedTemplateId) {
      const selectedTemplate = template.find(
        (t) => t.id === parseInt(selectedTemplateId)
      );
      setCategory(selectedTemplate ? selectedTemplate.Categories : []);
      setShowCategories(true);
    } else {
      setShowCategories(false);
    }
  }, [selectedTemplateId, template]);

  const getAllSubCategory = async (categoryId) => {
    console.log("sub category", categoryId)
    if (!categoryId) return;
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
    setSubCategory([]);
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
          <ul className="flex flex-row justify-around gap-4 border-4 rounded-full w-[600px] mx-2 mb-5 px-5 py-2">
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
          <ul className="flex flex-row justify-around gap-4 border-4 rounded-full w-[600px] mx-2 mb-5 px-5 py-2">
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
              className="mb-4 px-4 py-2 border rounded-md w-full               focus:outline-none focus:ring-2 focus:ring-purple-500"
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

      {!showCreateSubCategory && !showUpdateSubCategory && (
        <div>
          {loading ? (
            <p className="text-center col-span-full">Loading...</p>
          ) : (
            <div>
              {subCategory.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {subCategory.map((category) => (
                    <div
                      key={category.id}
                      className={`${
                        category.selected
                          ? "border-purple-500"
                          : "border-transparent"
                      } bg-white shadow-md rounded-lg overflow-hidden cursor-pointer`}
                    >
                      <div className="flex items-center justify-center bg-purple-500 p-4 h-24 text-xl font-semibold text-white">
                        <div className="flex flex-col">
                          <h2>{category.subCategoryName}</h2>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-100">
                        <button
                          className="text-purple-600 hover:text-purple-800 transition duration-300"
                          onClick={() =>
                            handleShowUpdateSubCategory(
                              category.id,
                              category.subCategoryName
                            )
                          }
                        >
                          <RxUpdate size={24} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition duration-300"
                          onClick={() => handleDeleteSubCategory(category.id)}
                        >
                          <FiDelete size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubCategory;
