import React, { useEffect, useState } from "react";
import { getAllReviews, deleteReview } from "../services/api";
import Swal from "sweetalert2";

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
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((review) => review._id !== reviewId));
        Swal.fire("Deleted!", "The review has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete review.", "error");
      }
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.bookId.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <span>Loading...</span>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-base-100 text-neutral font-sans">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-primary-brown">Manage Reviews</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Reviews..."
        className="input input-bordered mb-4 text-primary-blue"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <table className="table-auto w-full text-left border border-neutral">
        <thead className="bg-primary-brown text-white">
          <tr>
            <th className="p-2">Comment</th>
            <th className="p-2">Rating</th>
            <th className="p-2">Book Title</th>
            <th className="p-2">User</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((review) => (
            <tr key={review._id} className="bg-white hover:bg-accent text-neutral">
              <td className="p-2">{review.comment}</td>
              <td className="p-2">{review.rating}</td>
              <td className="p-2">{review.bookId.title}</td>
              <td className="p-2">{review.userId.username}</td>
              <td className="p-2">
                <button
                  className="btn btn-accent ml-2 text-base-100"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsPage;
