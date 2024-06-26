import React, { useState } from "react";
import ApiRequest from "../utils/apiRequests";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const CreateReview = ({ onCreateSuccess }) => {
  // Ensure props are received correctly as an object
  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [region, setRegion] = useState("");
  const [ratings, setRatings] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name.toUpperCase());
    formData.append("reviewText", reviewText);
    formData.append("region", region);
    formData.append("ratings", ratings);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await ApiRequest.post("/review", formData);

      onCreateSuccess(); // Assuming onCreateSuccess is a function passed from parent component
      toast.success("Review Created Successfully"); // Example toast notification
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Error occurred while creating review!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Review</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Review"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        ></textarea>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <input
          type="number"
          value={ratings}
          onChange={(e) => setRatings(e.target.value)}
          placeholder="Rating"
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />

        <input type="file" onChange={handleImage} className="mb-4" />
        <br />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {isLoading ? "Creating Review..." : "Create Review"}
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
