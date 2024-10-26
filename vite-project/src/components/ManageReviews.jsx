/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getAllReviews, deleteReview } from "../services/api";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getAllReviews();
        setReviews(reviewsData);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: "Are you sure ?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#b90303",
      cancelButtonColor: "#e2e8f0",
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.borderRadius = "12px";
          const cancelButton = popup.querySelector(".swal2-cancel");
          if (cancelButton) cancelButton.style.color = "black";
        }
      },
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((review) => review._id !== reviewId));
        setLoading(false);
        Swal.fire("Deleted!", "The review has been deleted.", "success", {
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.borderRadius = "12px";
            }
          },
        });
      } catch (err) {
        Swal.fire("Error!", "Failed to delete review.", "error", {
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.borderRadius = "12px";
            }
          },
        });
      }
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.bookId.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <span
          className="loading loading-bars loading-lg text-blue-800"
          style={{ width: "20%", margin: "30vh 30vw" }}
        ></span>
      </div>
    );
  }
  if (error) return <p>{error}</p>;

  return (
    <div className="py-6 mt-16 lg:mt-11 bg-base-100 text-neutral font-sans p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-x-4 sm:justify-between">
          <h1 className="text-3xl font-bold mb-4 text-primary-brown">
            Manage Reviews
          </h1>
          <input
            type="text"
            placeholder="Search Reviews..."
            className="input input-bordered mb-4 text-primary-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto w-full">
          {/* className="table-auto table-pin-rows table-pin-cols border w-full text-center shadow-md rounded-lg mb-8" */}
          <table className="table w-full text-center rounded-lg mb-3">
            <thead>
              <tr className="rounded-sm bg-[#f7f9fc] tab-border-2 text-sm">
                <th className="px-4 py-2 text-start">Comment</th>
                <th className="px-4 py-2 text-start">Rating</th>
                <th className="px-4 py-2 text-start">Book Title</th>
                <th className="px-4 py-2 text-start">User</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr
                    key={review._id}
                    className="border-t hover:bg-gray-100"
                    // className="bg-white hover:bg-accent text-neutral"
                  >
                    <td className="px-4 py-2 text-start">{review.comment}</td>
                    <td className="px-4 py-2 text-start">{review.rating}</td>
                    <td className="px-4 py-2 text-start">
                      {review.bookId.title}
                    </td>
                    <td className="px-4 py-2 text-start">
                      {review.userId.username}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-800 duration-500 ml-2 hover:text-black p-2"
                        onClick={() => handleDelete(review._id)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
