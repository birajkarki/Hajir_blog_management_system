import React, { useEffect, useState } from "react";
import ApiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";

const ShowBlog = ({
  selectedTemplateId,
  selectedCategoryId,
  selectedSubCategoryId,
  blogId,
  handleBack
}) => {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiRequest.get(
          `/${selectedTemplateId}/${selectedCategoryId}/${selectedSubCategoryId}/blog/${blogId}`
        );
        const { blogName, blogDescription, sections, blogImage } = response.data.result;

        const parsedSections = JSON.parse(sections);

        setBlog({
          blogName,
          blogDescription,
          sections: Array.isArray(parsedSections) ? parsedSections : [],
          blogImage,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        toast.error("Error fetching blog data");
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId, selectedTemplateId, selectedCategoryId, selectedSubCategoryId]);

  const handleBackButton = () => {
    handleBack();
  }

  return (
    <div className="px-6 bg-gray-50 min-h-screen">
      {isLoading && <div>Loading...</div>}
      {!isLoading && blog && (
        <div>
          <div className="flex flex-row justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">{blog.blogName}</h2>
        <button onClick={handleBackButton} className='bg-red-600 p-3 rounded-md text-white'>Back</button>
      </div>
          <div className="max-w-3/4">
            <img src={`http://${blog.blogImage}`} alt={blog.blogName} className="mb-4 rounded-lg" />
            <p className="text-lg mb-4">{blog.blogDescription}</p>
            {blog.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">{section.name}</h2>
                {section.image && <img src={`http://${section.image}`} alt="" className="mb-2 rounded-lg" />}
                <p>{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBlog;
