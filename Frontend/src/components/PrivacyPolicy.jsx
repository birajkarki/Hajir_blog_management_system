import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ApiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";
import "quill/dist/quill.core.css"; // Import Quill core CSS

const PrivacyPolicy = () => {
  const [value, setValue] = useState("");
  console.log(value);
  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ align: [] }], // Include alignment options
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
  };

  const savePrivacyPolicy = async () => {
    try {
      const response = await ApiRequest.patch("/privacy-policy", {
        html: value,
      });
      toast.success("Privacy Policy Updated Successfully");
    } catch (error) {
      console.error("Failed to update privacy and policy:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    savePrivacyPolicy();
  };

  return (
    <form onSubmit={handleSubmit}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules} // Pass the modules configuration
      />
      <br />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Update Privacy and Policy
      </button>
    </form>
  );
};

export default PrivacyPolicy;
