import { useEffect, useState } from "react";
import ApiRequest from "../utils/apiRequest";
import { RxUpdate } from "react-icons/rx";
import { FiDelete } from "react-icons/fi";
import { toast } from 'react-toastify';

const Template = () => {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showUpdateTemplate, setShowUpdateTemplate] = useState(false);
  const [updateTemplateId, setUpdateTemplateId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllTemplates();
  }, []);

  const getAllTemplates = async () => {
    try {
      setLoading(true);
      const res = await ApiRequest.get("/template");
      setTemplates(res.data.templates);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to fetch templates.");
    }
  };

  const handleShowCreateTemplate = () => {
    setShowCreateTemplate(!showCreateTemplate);
    setShowUpdateTemplate(false);
  };

  const handleShowUpdateTemplate = (id) => {
    setUpdateTemplateId(id);
    setShowUpdateTemplate(!showUpdateTemplate);
    setShowCreateTemplate(false);
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true);
      const newTemplate = await ApiRequest.post("/template", { templateName });
      setShowCreateTemplate(false);
      setTemplateName("");
      toast.success(newTemplate.data.message);
      getAllTemplates();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to create template.");
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault(); 

    try {
      setLoading(true);
      const updatedTemplate = await ApiRequest.put(`/template/${updateTemplateId}`, { templateName });
      setShowUpdateTemplate(false);
      setTemplateName("");
      toast.success(updatedTemplate.data.message);
      getAllTemplates();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to update template.");
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      setLoading(true);
      const res = await ApiRequest.delete(`/template/${id}`);
      setTemplates(templates.filter((template) => template.id !== id));
      setLoading(false);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to delete template.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-end mb-6">
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300"
          onClick={handleShowCreateTemplate}
        >
          {showCreateTemplate ? 'Cancel' : 'Create New Template'}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 pb-2">Templates</h1>

      {showCreateTemplate && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <form onSubmit={handleCreateTemplate} className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Create New Template</h2>
            <input
              type="text"
              placeholder="Enter Template Name"
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
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

      {showUpdateTemplate && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <button className='bg-purple-600 p-2 rounded-md text-white' onClick={handleShowUpdateTemplate}>{showUpdateTemplate ? 'Cancel' : ''}</button>
          <form onSubmit={handleUpdateTemplate} className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Update Template</h2>
            <input
              type="text"
              placeholder="Enter Template Name"
              className="mb-4 px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
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

      {!showCreateTemplate && !showUpdateTemplate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-center col-span-full">Loading...</p>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center bg-purple-500 p-4 h-24 text-xl font-semibold text-white">
                  {template.templateName}
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-100">
                  <button
                    className="text-purple-600 hover:text-purple-800 transition duration-300"
                    onClick={() => handleShowUpdateTemplate(template.id)}
                  >
                    <RxUpdate size={24} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition duration-300"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <FiDelete size={24} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Template;
