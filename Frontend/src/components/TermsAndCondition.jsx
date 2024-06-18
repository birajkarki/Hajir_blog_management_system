import React, { useState, useCallback, useRef } from "react";
import Quill from "quill"; // Import Quill library
import "quill/dist/quill.snow.css"; // Import Quill's snow theme CSS
import ApiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";

const TermsAndConditions = () => {
  const [editorHtml, setEditorHtml] = useState(""); // State to store editor HTML content

  const editorRef = useRef(null); // Ref to store Quill editor instance

  // Initialize Quill editor when component mounts
  React.useEffect(() => {
    if (editorRef.current !== null) {
      const editor = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });
      editor.on("text-change", () => {
        setEditorHtml(editor.root.innerHTML);
      });
    }
  }, []);

  // Function to save terms and conditions
  const saveTermsAndConditions = async () => {
    try {
      await ApiRequest.patch("/terms-and-conditions", {
        html: editorHtml,
      });
      toast.success("Terms and Conditions Updated Successfully");
    } catch (error) {
      console.error("Failed to update terms and conditions:", error);
      toast.error("Failed to update terms and conditions");
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    saveTermsAndConditions();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div ref={editorRef} />
      <br />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Update Terms and Conditions
      </button>
    </form>
  );
};

export default TermsAndConditions;
