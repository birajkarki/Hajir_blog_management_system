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
        console.log(response)
        const { blogName,
          blogDescription,
          blogTitle,
          titleDescription,
          slug, sections, blogImage } = response.data.result;

        const parsedSections = JSON.parse(sections);

        setBlog({
          blogName,
          blogDescription,
          blogTitle,
          titleDescription,
          slug,
          sections: Array.isArray(parsedSections) ? parsedSections : [],
          blogImage,
        });
        console.log(blog)
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
      {isLoading && <div className="flex items-center justify-center h-screen">Loading...</div>}
      {!isLoading && blog && (
        <div>
          <div className="flex flex-col md:flex-row md:justify-between mb-4">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">{blog.blogName}</h2>
            <button onClick={handleBackButton} className='bg-red-600 p-3 rounded-md text-white'>Back</button>
          </div>
          <div className="max-w-3/4 mx-auto">
            <img src={`${blog.blogImage}`} alt={blog.blogName} className="mb-4 rounded-lg w-full" />
            <h2 className='font-medium text-lg'>{`Blog Title: ${blog.blogTitle}`}</h2>
            <p className='text-gray-600 mb-4'>{`Title Description: ${blog.titleDescription}`}</p>
            {blog.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">{section.name}</h2>
                {section.image && <img src={`${section.image}`} alt="" className="mb-2 rounded-lg w-full" />}
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
