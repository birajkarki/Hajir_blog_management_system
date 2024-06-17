import { useContext, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Blog from "../components/Blog";
import Category from "../components/Category";
import SubCategory from "../components/SubCategory";
import Template from "../components/Template";
import { Context } from "../context/Context";
import ApiRequest from "../utils/apiRequest";
import PrivacyPolicy from "../components/PrivacyPolicy";
import TermsAndCondition from "../components/TermsAndCondition";

const Homepage = () => {
  const { user, isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [showTemplate, setShowTemplate] = useState(true);
  const [showBlog, setShowBlog] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [showPrivacyAndPolicy, setShowPrivacyAndPolicy] = useState(false);
  const [showTNC, setShowTNC] = useState(false);
  const [selectOption, setSelectOption] = useState("Template");


  const handleShowTemplate = () => {
    setSelectOption("Template");
    setShowTemplate(true);
    setShowBlog(false);
    setShowCategory(false);
    setShowSubCategory(false);
    setShowPrivacyAndPolicy(false)
    setShowTNC(false);
  };
  const handleShowBlog = () => {
    setSelectOption("Blog");
    setShowTemplate(false);
    setShowBlog(true);
    setShowCategory(false);
    setShowSubCategory(false);
    setShowPrivacyAndPolicy(false)
    setShowTNC(false);
  };
  const handleShowCategory = () => {
    setSelectOption("Category");
    setShowTemplate(false);
    setShowBlog(false);
    setShowCategory(true);
    setShowSubCategory(false);
    setShowPrivacyAndPolicy(false)
    setShowTNC(false);
  };
  const handleShowSubCategory = () => {
    setSelectOption("Sub-Category");
    setShowTemplate(false);
    setShowBlog(false);
    setShowCategory(false);
    setShowSubCategory(true);
    setShowPrivacyAndPolicy(false)
    setShowTNC(false);
  };
  const handleShowPrivacyAndPolicy = () => {
    setShowTemplate(false);
    setShowBlog(false);
    setShowCategory(false);
    setShowSubCategory(false);
    setShowPrivacyAndPolicy(true)
    setShowTNC(false);
  };
  const handleShowTNC = () => {
    setShowTemplate(false);
    setShowBlog(false);
    setShowCategory(false);
    setShowSubCategory(true);
    setShowPrivacyAndPolicy(false)
    setShowTNC(true);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await ApiRequest.get("/user/logout");
      setIsAuthenticated(false);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center py-4 px-10 bg-white shadow-sm">
        <div className="text-2xl font-semibold text-gray-900">
          <a href="#" className="hover:text-blue-900 ease-in duration-300">
            Dashboard
          </a>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg capitalize">{user.username}</h1>
          <FaRegUser className="text-2xl text-gray-900 cursor-pointer transition-colors duration-300 hover:text-gray-600" />
        </div>
      </header>
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-1/5 bg-white text-gray-900 min-h-screen py-6 px-4 shadow-sm border-r-2">
          <div className="flex flex-col gap-6 px-6">
            <ul className="space-y-6 text-lg">
              <li
                className={` transition-colors cursor-pointer rounded-md duration-300 ${
                  selectOption === "Template"
                    ? "bg-purple-600 text-white py-2 px-4 "
                    : ""
                }`}
                onClick={handleShowTemplate}
              >
                Template
              </li>

              <li
                className={` transition-colors cursor-pointer rounded-md duration-100 ${
                  selectOption === "Category"
                    ? "bg-purple-600 text-white py-2 px-4 "
                    : ""
                }`}
                onClick={handleShowCategory}
              >
                Category
              </li>
              <li
                className={` transition-colors cursor-pointer rounded-md duration-100 whitespace-nowrap ${
                  selectOption === "Sub-Category"
                    ? "bg-purple-600 text-white py-2 px-4 "
                    : ""
                }`}
                onClick={handleShowSubCategory}
              >
                Sub Category
              </li>
              <li
                className={` transition-colors cursor-pointer rounded-md duration-100 ${
                  selectOption === "Blog"
                    ? "bg-purple-600 text-white py-2 px-4 "
                    : ""
                }`}
                onClick={handleShowBlog}
              >
                Blog
              </li>
              <li
                className={` transition-colors cursor-pointer rounded-md duration-100 ${
                  selectOption === "Blog"
                    ? "bg-purple-600 text-white py-2 px-4 "
                    : ""
                }`}
                onClick={handleShowPrivacyAndPolicy}
              >
                Privacy and Policy
              </li>
              <li
                className={` transition-colors cursor-pointer rounded-md duration-100 ${
                  selectOption === "Blog"
                    ? "bg-purple-600 text-white py-2 px-4 "
                    : ""
                }`}
                onClick={handleShowTNC}
              >
                Terms and Condition
              </li>
            </ul>
            <div className="mt-10">
              <button
                onClick={handleLogout}
                className="px-6 py-1 bg-purple-500 text-white font-semibold rounded-md shadow-2xl ease-in duration-100 hover:bg-purple-700"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 bg-white p-4 md:p-10 text-gray-800">
          {showTemplate && <Template />}
          {showBlog && <Blog />}
          {showCategory && <Category />}
          {showSubCategory && <SubCategory />}
          {showPrivacyAndPolicy && <PrivacyPolicy />}
          {showTNC && <TermsAndCondition />}
        </main>
      </div>
    </div>
  );
};

export default Homepage;
