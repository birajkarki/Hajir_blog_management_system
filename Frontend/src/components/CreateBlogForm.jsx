import React, { useState } from "react";
import ApiRequest from "../utils/apiRequest";

const CreateBlogForm = ({ onCreateSuccess }) => {
  const [blogName, setBlogName] = useState("");
  const [sections, setSections] = useState([{ name: "", text: "", image: null }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddSection = () => {
    setSections([...sections, { name: "", text: "", image: null }]);
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = sections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    );
    setSections(updatedSections);
  };

  const handleImageChange = (index, file) => {
    const updatedSections = sections.map((section, i) =>
      i === index ? { ...section, image: file } : section
    );
    setSections(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("blogName", blogName);
      formData.append("sections", JSON.stringify(sections.map(({ name, text }) => ({ name, text }))));

      sections.forEach((section, index) => {
        if (section.image) {
          formData.append(`sectionImage${index}`, section.image);
        }
      });

      const res = await ApiRequest.post(`/${blog.templateId}/${blog.categoryId}/${blog.subcategoryId}/blog`, formData);

      if (res.data.status === "success") {
        onCreateSuccess();
        setBlogName("");
        setSections([{ name: "", text: "", image: null }]);
      } else {
        setError("Failed to create blog");
      }
    } catch (error) {
      setError("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-700">Blog Name</label>
        <input
          type="text"
          value={blogName}
          onChange={(e) => setBlogName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      {sections.map((section, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Section {index + 1}</h3>
          <div className="mb-2">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={section.name}
              onChange={(e) => handleSectionChange(index, "name", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Text</label>
            <textarea
              value={section.text}
              onChange={(e) => handleSectionChange(index, "text", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(index, e.target.files[0])}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      ))}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleAddSection}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Section
        </button>
      </div>
      <div className="mb-4">
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </div>
    </form>
  );
};

export default CreateBlogForm;
