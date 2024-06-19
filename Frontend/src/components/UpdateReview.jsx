import React, { useEffect, useState } from "react";
import ApiRequest from "../utils/apiRequests";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const UpdateReview = ({ reviewId, onCreateSuccess, handleCancel }) => {
  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [region, setRegion] = useState("");
  const [ratings, setRatings] = useState(null);
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await ApiRequest.get(`/review/${reviewId}`);
        const { reviewText, name, region, ratings, image } =
          response.data.review;
        setReviewText(reviewText);
        setName(name);
        setRegion(region);
        setRatings(ratings);
        setImage(image);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        toast.error("Error fetching blog data");
      }
    };

    fetchReviewData();
  }, [reviewId]);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCancelUpdate = () => {
    handleCancel(); // Call handleCancel prop function
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
      const res = await ApiRequest.patch(`/review/${reviewId}`, formData);

      onCreateSuccess(); // Assuming onCreateSuccess is a function passed from parent component
      toast.success("Review Updated Successfully"); // Example toast notification
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Error occurred while updating review!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex flex-row justify-between mb-4">
        <h2 className="text-2xl font-bold mb-4">Update Review</h2>
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
          {isLoading ? "Updating Review..." : "Update Review"}
        </button>
      </form>
    </div>
  );
};

export default UpdateReview;
