import { createContext, useEffect, useState } from "react";
import ApiRequest from '../utils/apiRequest';

export const Context = createContext({
  isAuthenticated: false,
});

export const ContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);


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
  console.log(templates);

  const getAllCategory = async () => {
    try {
      setLoading(true);
      const res = await ApiRequest.get(`/${templates.id}/category`);
      console.log(res);
      setCategory(res.data.categories);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getAllSubCategory = async (categoryId) => {
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


  useEffect(async () => {
    await getAllTemplates();
  }, []);
  
  return (
    <Context.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </Context.Provider>
  );
};

