import React, { useState } from "react";
import { toast } from "react-toastify";
import ApiRequest from "../utils/apiRequests";

const CreateBlogForm = ({
  selectedTemplateId,
  selectedCategoryId,
  selectedSubCategoryId,
  onCreateSuccess,
}) => {
  const [blogName, setBlogName] = useState("");
  const [titleTag, setTitleTag] = useState("");
  const [metaTag, setMetaTag] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [titleDescription, setTitleDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightDescription, setHighlightDescription] = useState("");

  const [blogImage, setBlogImage] = useState(null);
  const [sections, setSections] = useState([{ name: "", text: "" }]);
  const [highlightSections, setHighlightSections] = useState([
    { title: "", description: "" },
  ]);
  const [highlightImages, setHighlightImages] = useState([]);
  const [sectionImages, setSectionImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSectionChange = (index, key, value) => {
    const updatedSections = [...sections];
    updatedSections[index][key] = value;
    setSections(updatedSections);
  };
  const handleHighlightSectionChange = (index, key, value) => {
    const updatedHighlightSections = [...highlightSections];
    updatedHighlightSections[index][key] = value;
    setHighlightSections(updatedHighlightSections);
  };

  const handleSectionImageChange = (index, e) => {
    const files = e.target.files;
    const updatedSectionImages = [...sectionImages];
    updatedSectionImages[index] = files[0];
    setSectionImages(updatedSectionImages);
  };
  const handleHighlightSectionImageChange = (index, e) => {
    const files = e.target.files;
    const updatedHighlightImages = [...highlightImages];
    updatedHighlightImages[index] = files[0];
    setHighlightImages(updatedHighlightImages);
  };

  const handleAddSection = () => {
    if (sections.length < 5) {
      setSections([...sections, { name: "", text: "" }]);
      setSectionImages([...sectionImages, null]);
    }
  };
  const handleAddHighlightSection = () => {
    if (highlightSections.length < 3) {
      setHighlightSections([
        ...highlightSections,
        { title: "", description: "" },
      ]);
      setHighlightImages([...highlightImages, null]);
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
  const handleRemoveHighlightSection = (index) => {
    const updatedHighlightSections = [...highlightSections];
    updatedHighlightSections.splice(index, 1);
    setHighlightSections(updatedHighlightSections);

    const updatedHighlightImages = [...highlightImages];
    updatedHighlightImages.splice(index, 1);
    setSectionImages(highlightImages);
  };

  const handleBlogImageChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!highlightSections.length) {
      toast.error("Highlight sections cannot be empty");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    const highlightFormData = new FormData();
    formData.append("blogName", blogName);
    formData.append("blogDescription", blogDescription);
    formData.append("titleTag", titleTag);
    formData.append("metaTag", metaTag);
    formData.append("blogTitle", blogTitle);
    formData.append("titleDescription", titleDescription);
    formData.append("slug", slug);
    formData.append("sections", JSON.stringify(sections));
    highlightFormData.append("highlightTitle", highlightTitle);
    highlightFormData.append("highlightDescription", highlightDescription);
    highlightFormData.append(
      "highlightSections",
      JSON.stringify(highlightSections)
    );
    if (blogImage) {
      formData.append("blogImage", blogImage);
    }
    sectionImages.forEach((image, index) => {
      if (image) {
        formData.append(`sectionImages`, image);
      }
    });
    highlightImages.forEach((image, index) => {
      if (image) {
        highlightFormData.append(`highlightSectionImages`, image);
      }
    });

    try {
      let apiUrl;
      if (selectedCategoryId) {
        apiUrl = `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog`;
      } else {
        apiUrl = `/${selectedTemplateId}/${selectedSubCategoryId}/blog`;
      }
      const blog_res = await ApiRequest.post(apiUrl, formData);
      const blogId = blog_res.data.blog.id;
      const highlight_res = await ApiRequest.post(
        `/${blogId}/highlight`,
        highlightFormData
      );

      onCreateSuccess();
      toast.success("Blog Created Successfully");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Error occurred while creating blog!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
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
          placeholder="Blog Description"
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
        ></textarea>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />

        <input type="file" onChange={handleBlogImageChange} className="mb-4" />

        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={section.name}
              onChange={(e) =>
                handleSectionChange(index, "name", e.target.value)
              }
              placeholder={`Section ${index + 1}`}
              className="w-full px-4 py-2 mb-2 border rounded-md"
            />
            <textarea
              value={section.text}
              onChange={(e) =>
                handleSectionChange(index, "text", e.target.value)
              }
              placeholder={`Section Text ${index + 1}`}
              className="w-full px-4 py-2 mb-2 border rounded-md"
            ></textarea>
            <input
              type="file"
              onChange={(e) => handleSectionImageChange(index, e)}
              className="mb-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveSection(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 "
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
        <input
          type="text"
          value={highlightTitle}
          onChange={(e) => setHighlightTitle(e.target.value)}
          placeholder="Highlight Title"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <textarea
          type="text"
          value={highlightDescription}
          onChange={(e) => setHighlightDescription(e.target.value)}
          placeholder="Highlight Description"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        ></textarea>
        {highlightSections.map((section, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={section.title}
              onChange={(e) =>
                handleHighlightSectionChange(index, "title", e.target.value)
              }
              placeholder={`Highlight Section ${index + 1}`}
              className="w-full px-4 py-2 mb-2 border rounded-md"
            />
            <textarea
              value={section.description}
              onChange={(e) =>
                handleHighlightSectionChange(
                  index,
                  "description",
                  e.target.value
                )
              }
              placeholder={`Highlight Section Text ${index + 1}`}
              className="w-full px-4 py-2 mb-2 border rounded-md"
            ></textarea>
            <input
              type="file"
              onChange={(e) => handleHighlightSectionImageChange(index, e)}
              className="mb-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveHighlightSection(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 "
            >
              Remove Highlight Section
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddHighlightSection}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4 mr-5"
        >
          Add Highlight Section
        </button>
        <br />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {isLoading ? "Creating Blog..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
