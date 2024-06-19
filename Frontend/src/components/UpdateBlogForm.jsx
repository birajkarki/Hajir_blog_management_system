<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApiRequest from "../utils/apiRequests";

const UpdateBlogForm = ({
  blogId,
  selectedTemplateId,
  selectedCategoryId,
  selectedSubCategoryId,
  onCreateSuccess,
  handleCancel,
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
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightDescription, setHighlightDescription] = useState("");
  const [highlightSections, setHighlightSections] = useState([
    { title: "", description: "" },
  ]);
  const [highlightImages, setHighlightImages] = useState([]);
  useEffect(() => {
    const fetchBlogData = async () => {
      console.log(
        selectedTemplateId,
        selectedCategoryId,
        selectedSubCategoryId,
        blogId
      );
      try {
        let apiUrl;
        if (selectedCategoryId) {
          apiUrl = `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog/${blogId}`;
        } else {
          apiUrl = `/${selectedTemplateId}/${selectedSubCategoryId}/blog/${blogId}`;
        }
        console.log(apiUrl);
        const response = await ApiRequest.get(apiUrl);
        const highlight_response = await ApiRequest.get(`/${blogId}/highlight`);
        console.log(highlight_response);
        const {
          titleTag,
          metaTag,
          blogName,
          blogDescription,
          blogTitle,
          titleDescription,
          slug,
          blogImage,
          sections,
        } = response.data.result;
        const { highlightTitle, highlightDescription, highlightSections } =
          highlight_response.data.highlights;
        setTitleTag(titleTag);
        setMetaTag(metaTag);
        setBlogName(blogName);
        setBlogDescription(blogDescription);
        setBlogTitle(blogTitle);
        setTitleDescription(titleDescription);
        setBlogImage(blogImage);
        setSlug(slug);
        setSections(Array.isArray(sections) ? sections : []);
        setSectionImages(new Array(sections ? sections.length : 0).fill(null));
        setHighlightTitle(highlightTitle);
        setHighlightDescription(highlightDescription);
        setHighlightSections(
          Array.isArray(highlightSections) ? highlightSections : []
        );
        setHighlightImages(
          new Array(highlightSections ? highlightSections.length : 0).fill(null)
        );
      } catch (error) {
        console.error("Error fetching blog data:", error);
        toast.error("Error fetching blog data");
      }
    };

    fetchBlogData();
  }, [blogId, selectedTemplateId, selectedCategoryId, selectedSubCategoryId]);

  const handleSectionChange = (index, key, id, value) => {
    const updatedSections = [...sections];
    updatedSections[index][key] = value;
    updatedSections[index]["id"] = id;
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

    // if (!highlightSections.length) {
    //   toast.error("Highlight sections cannot be empty");
    //   setIsLoading(false);
    //   return;
    // }

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
        apiUrl = `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog/${blogId}`;
      } else {
        apiUrl = `/${selectedTemplateId}/${selectedSubCategoryId}/blog/${blogId}`;
      }
      await ApiRequest.patch(apiUrl, formData);
      highlightSections
        ? await ApiRequest.patch(`/${blogId}/highlight`, highlightFormData)
        : null;
      // const highlight_res = await ApiRequest.patch(
      //   `/${blogId}/highlight`,
      //   highlightFormData
      // );

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
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-row justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Update Blog</h2>
        <button
          onClick={handleCancelUpdate}
          className="bg-red-600 p-3 rounded-md text-white"
        >
          Cancel
        </button>
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
        {Array.isArray(highlightSections) &&
          highlightSections.map((highlight, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                value={highlight.title}
                onChange={(e) =>
                  handleHighlightSectionChange(index, "title", e.target.value)
                }
                placeholder={`Highlight ${index + 1} Name`}
                className="w-full px-4 py-2 mb-2 border rounded-md"
              />
              <textarea
                value={highlight.description}
                onChange={(e) =>
                  handleHighlightSectionChange(
                    index,
                    "description",
                    e.target.value
                  )
                }
                placeholder={`Highlight ${index + 1} Text`}
                className="w-full px-4 py-2 mb-2 border rounded-md"
              />
              <input
                type="file"
                onChange={(e) => handleHighlightSectionImageChange(index, e)}
                className="mb-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveHighlightSection(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
=======
import React, { useState, useEffect } from "react";
import ApiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";

const UpdateBlogForm = ({
  blogId,
  selectedTemplateId,
  selectedCategoryId,
  selectedSubCategoryId,
  onCreateSuccess,
  handleCancel,
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
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightDescription, setHighlightDescription] = useState("");
  const [highlightSections, setHighlightSections] = useState([
    { title: "", description: "" },
  ]);
  const [highlightImages, setHighlightImages] = useState([]);
  useEffect(() => {
    const fetchBlogData = async () => {
      console.log(
        selectedTemplateId,
        selectedCategoryId,
        selectedSubCategoryId,
        blogId
      );
      try {
        let apiUrl;
        if (selectedCategoryId) {
          apiUrl = `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog/${blogId}`;
        } else {
          apiUrl = `/${selectedTemplateId}/${selectedSubCategoryId}/blog/${blogId}`;
        }
        console.log(apiUrl);
        const response = await ApiRequest.get(apiUrl);
        const highlight_response = await ApiRequest.get(`/${blogId}/highlight`);
        console.log(highlight_response);
        const {
          titleTag,
          metaTag,
          blogName,
          blogDescription,
          blogTitle,
          titleDescription,
          slug,
          blogImage,
          sections,
        } = response.data.result;
        const { highlightTitle, highlightDescription, highlightSections } =
          highlight_response.data.highlights;
        setTitleTag(titleTag);
        setMetaTag(metaTag);
        setBlogName(blogName);
        setBlogDescription(blogDescription);
        setBlogTitle(blogTitle);
        setTitleDescription(titleDescription);
        setBlogImage(blogImage);
        setSlug(slug);
        setSections(Array.isArray(sections) ? sections : []);
        setSectionImages(new Array(sections ? sections.length : 0).fill(null));
        setHighlightTitle(highlightTitle);
        setHighlightDescription(highlightDescription);
        setHighlightSections(
          Array.isArray(highlightSections) ? highlightSections : []
        );
        setHighlightImages(
          new Array(highlightSections ? highlightSections.length : 0).fill(null)
        );
      } catch (error) {
        console.error("Error fetching blog data:", error);
        toast.error("Error fetching blog data");
      }
    };

    fetchBlogData();
  }, [blogId, selectedTemplateId, selectedCategoryId, selectedSubCategoryId]);

  const handleSectionChange = (index, key, id, value) => {
    const updatedSections = [...sections];
    updatedSections[index][key] = value;
    updatedSections[index]["id"] = id;
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

    // if (!highlightSections.length) {
    //   toast.error("Highlight sections cannot be empty");
    //   setIsLoading(false);
    //   return;
    // }

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
        apiUrl = `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog/${blogId}`;
      } else {
        apiUrl = `/${selectedTemplateId}/${selectedSubCategoryId}/blog/${blogId}`;
      }
      await ApiRequest.patch(apiUrl, formData);
      highlightSections
        ? await ApiRequest.patch(`/${blogId}/highlight`, highlightFormData)
        : null;
      // const highlight_res = await ApiRequest.patch(
      //   `/${blogId}/highlight`,
      //   highlightFormData
      // );

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
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-row justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Update Blog</h2>
        <button
          onClick={handleCancelUpdate}
          className="bg-red-600 p-3 rounded-md text-white"
        >
          Cancel
        </button>
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
        {Array.isArray(highlightSections) &&
          highlightSections.map((highlight, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                value={highlight.title}
                onChange={(e) =>
                  handleHighlightSectionChange(index, "title", e.target.value)
                }
                placeholder={`Highlight ${index + 1} Name`}
                className="w-full px-4 py-2 mb-2 border rounded-md"
              />
              <textarea
                value={highlight.description}
                onChange={(e) =>
                  handleHighlightSectionChange(
                    index,
                    "description",
                    e.target.value
                  )
                }
                placeholder={`Highlight ${index + 1} Text`}
                className="w-full px-4 py-2 mb-2 border rounded-md"
              />
              <input
                type="file"
                onChange={(e) => handleHighlightSectionImageChange(index, e)}
                className="mb-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveHighlightSection(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
>>>>>>> 10992ef38803a0e429524ac685fafe5facf8cb6d
