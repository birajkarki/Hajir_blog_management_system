import React, { useState, useEffect } from "react";
import { FiDelete } from "react-icons/fi";
import { RxUpdate } from "react-icons/rx";
import ApiRequest from "../utils/apiRequests";
import StarRating from "../buttons/StarRating";
import CreateReview from "./CreateReview";
import UpdateReview from "./UpdateReview";
import { toast } from "react-toastify"; // Assuming you are using react-toastify for toast notifications

const Review = () => {
  const [showReviews, setShowReviews] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [showUpdateReview, setShowUpdateReview] = useState(false);
  const [updateReviewId, setUpdateReviewId] = useState(null);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    const apiUrl = `/review`;

    try {
      const res = await ApiRequest.get(apiUrl);
      const data = res?.data?.reviews;
      if (data) {
        setReviews(data);
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load reviews");
      setLoading(false);
    }
  };

  const handleShowCreateReview = () => {
    setShowCreateReview(!showCreateReview);
  };

  const handleCancelShowUpdate = () => {
    setShowUpdateReview(false); // Hide the update review form
    setShowReviews(true); // Show the reviews
  };

  const handleDeleteReview = async (review) => {
    try {
      await ApiRequest.delete(`/review/${review.id}`);

      // Show toast notification
      toast.success("Review Deleted Successfully");

      // Refetch all reviews to update the list
      fetchAllReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateReview(false);
    setShowUpdateReview(false);
    fetchAllReviews();
  };

  const handleUpdateReview = (review) => {
    setUpdateReviewId(review.id);
    setShowUpdateReview(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 pb-2">
        Reviews
      </h1>
      <div className="flex justify-end mb-6">
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300"
          onClick={handleShowCreateReview}
        >
          {showCreateReview ? "Cancel" : "Create New Review"}
        </button>
      </div>
      {showCreateReview && (
        <CreateReview onCreateSuccess={handleCreateSuccess} />
      )}
      {showUpdateReview && (
        <UpdateReview
          reviewId={updateReviewId}
          onCreateSuccess={handleCreateSuccess}
          handleCancel={handleCancelShowUpdate}
        />
      )}
      {!showUpdateReview && !showCreateReview && (
        <div className="rounded-lg p-6 mb-6">
          {showReviews && (
            <div className="flex flex-col lg:flex-row  items-center gap-4 flex-wrap">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white  shadow-md rounded-lg overflow-hidden cursor-pointer p-4"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-center">
                        <img
                          src={review.image}
                          alt={`Profile Image of ${review.name}`}
                          width={168}
                          height={168}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex justify-center">
                        <StarRating rating={review.ratings} />
                      </div>
                      <p className="text-primary/70 mb-8 w-[304px] h-[120px] text-left tracking-normal text-base mt-2">
                        {review.reviewText}
                      </p>
                      <div className="text-primary text-sm font-medium flex justify-center gap-2">
                        <p className="pr-2 border-r-2 border-ctaMain">
                          {review.name}
                        </p>
                        <span>{review.region}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 ">
                      <button
                        className="text-purple-600 hover:text-purple-800 transition duration-300"
                        onClick={() => handleUpdateReview(review)}
                      >
                        <RxUpdate size={24} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition duration-300"
                        onClick={() => handleDeleteReview(review)}
                      >
                        <FiDelete size={24} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full">No Reviews Found</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Review;
