import React, { useState, useEffect } from "react";
import ApiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";

const UpdateBlogForm = ({
  blogId,
  selectedTemplateId,
  selectedCategoryId,
  selectedSubCategoryId,
  onCreateSuccess,
  handleCancel
}) => {
  const [blogName, setBlogName] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [titleTag, setTitleTag] = useState("");
  const [metaTag, setMetaTag] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [titleDescription, setTitleDescription] = useState("");
  const [slug, setSlug] = useState("");

  const [sections, setSections] = useState([]);
  const [blogImage, setBlogImage] = useState(null);
  const [sectionImages, setSectionImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await ApiRequest.get(
          `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog/${blogId}`
        );
        console.log(response);
        const { blogName, blogDescription,blogTitle,titleDescription,slug, blogImage, sections } = response.data.result;
        // console.log("response data", response.data);
        setBlogName(blogName);
        setBlogDescription(blogDescription);
        setBlogTitle(blogTitle)
        setTitleDescription(titleDescription)
        setBlogImage(blogImage)
        setSlug(slug)
        setSections(Array.isArray(sections) ? sections : []);
        setSectionImages(new Array(sections ? sections.length : 0).fill(null));
      } catch (error) {
        console.error("Error fetching blog data:", error);
        toast.error("Error fetching blog data");
      }
    };

    fetchBlogData();
  }, [blogId, selectedTemplateId, selectedCategoryId, selectedSubCategoryId]);

  const handleSectionChange = (index, key, value) => {
    const updatedSections = [...sections];
    updatedSections[index][key] = value;
    setSections(updatedSections);
  };

  const handleSectionImageChange = (index, e) => {
    const files = e.target.files;
    const updatedSectionImages = [...sectionImages];
    updatedSectionImages[index] = files[0];
    setSectionImages(updatedSectionImages);
  };

  const handleAddSection = () => {
    if (sections.length < 5) {
        setSections([...sections, { name: "", text: "" }]);
        setSectionImages([...sectionImages, null]);
      }
  };

  const handleRemoveSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);

    const updatedSectionImages = [...sectionImages];
    updatedSectionImages.splice(index, 1);
    setSectionImages(updatedSectionImages);
  };

  const handleBlogImageChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("blogName", blogName);
    formData.append("blogDescription", blogDescription);
    formData.append("titleTag", titleTag);
    formData.append("metaTag", metaTag);
    formData.append("blogTitle", blogTitle);
    formData.append("titleDescription", titleDescription);
    formData.append("slug", slug);
    formData.append("sections", JSON.stringify(sections));
    if (blogImage) {
      formData.append("blogImage", blogImage);
    }
    sectionImages.forEach((image, index) => {
      if (image) {
        formData.append(`sectionImages`, image);
      }
    });

    try {
        console.log(formData);
      const res = await ApiRequest.patch(
        `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog/${blogId}`,
        formData
      );
      onCreateSuccess();
      toast.success("Blog Updated Successfully");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Error occurred while updating blog!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    handleCancel();
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-row justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Update Blog</h2>
        <button onClick={handleCancelUpdate} className='bg-red-600 p-3 rounded-md text-white'>Cancel</button>
      </div>
      <form onSubmit={handleSubmit}>
      <input
          type="text"
          value={titleTag}
          onChange={(e) => setTitleTag(e.target.value)}
          placeholder="Title Tag"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <input
          type="text"
          value={metaTag}
          onChange={(e) => setMetaTag(e.target.value)}
          placeholder="Meta Tag"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <input
          type="text"
          value={blogName}
          onChange={(e) => setBlogName(e.target.value)}
          placeholder="Blog Name"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <input
          type="text"
          value={blogDescription}
          onChange={(e) => setBlogDescription(e.target.value)}
          placeholder="Blog Decription"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <input
          type="text"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          placeholder="Blog Title"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <textarea
          type="text"
          value={titleDescription}
          onChange={(e) => setTitleDescription(e.target.value)}
          placeholder="Title Description"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Blog Title"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        
        <input type="file" onChange={handleBlogImageChange} className="mb-4" />
        {Array.isArray(sections) &&
          sections.map((section, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                value={section.name}
                onChange={(e) =>
                  handleSectionChange(index, "name", e.target.value)
                }
                placeholder={`Section ${index + 1} Name`}
                className="w-full px-4 py-2 mb-2 border rounded-md"
              />
              <textarea
                value={section.text}
                onChange={(e) =>
                  handleSectionChange(index, "text", e.target.value)
                }
                placeholder={`Section ${index + 1} Text`}
                className="w-full px-4 py-2 mb-2 border rounded-md"
              />
              <input
                type="file"
                onChange={(e) => handleSectionImageChange(index, e)}
                className="mb-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveSection(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Remove Section
              </button>
            </div>
          ))}
        <button
          type="button"
          onClick={handleAddSection}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4 mr-5"
        >
          Add Section
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {isLoading ? "Updating Blog..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBlogForm;
