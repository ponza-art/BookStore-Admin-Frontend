import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/api";
import AdminFooter from "./adminFooter";
import { BsGraphUp } from "react-icons/bs";
import { FaBook, FaUsers, FaChartLine } from "react-icons/fa";

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookData = await getBooks();
        setBooks(bookData);
      } catch (err) {
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const totalBooks = books.length;

  const lastBook = books.reduce((latest, book) => {
    const bookDate = book.createdAt ? new Date(book.createdAt) : null;
    const latestDate = latest?.createdAt ? new Date(latest.createdAt) : null;

    return !latestDate || (bookDate && bookDate > latestDate) ? book : latest;
  }, null);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  if (loading) {
    return (
      <span
        className="loading loading-bars  loading-lg text-cyan-900"
        style={{ width: "350px", margin: "30vh 40vw" }}
      ></span>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="p-4 my-5  text-center">
        <h1 className="text-3xl text-amber-900  font-bold mb-12">
          Admin Dashboard
        </h1>
        {/* <Link to="/admin/add-book" className="bg-yellow-800 text-white px-4 py-2 rounded-md hover:bg-yellow-900">Add New Book</Link> */}
        <div className="container  mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-7  mb-6">
          <div className="p-6 bg-white rounded-lg shadow-lg border   border-gray-200 flex flex-col items-center justify-center">
            <FaBook className="text-4xl text-yellow-800 mb-2" />
            <h2 className="text-lg font-semibold text-gray-500 text-center">
              Total Books
            </h2>
            <p className="text-4xl font-bold text-yellow-800 text-center">
              {totalBooks}
            </p>
          </div>

          {lastBook && (
            <div className="p-6  bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col items-center justify-center">
              <FaChartLine className="text-4xl text-yellow-800 mb-2" />
              <h2 className="text-lg font-semibold text-gray-500 text-center">
                Last Uploaded Book
              </h2>
              {/* <p className="text-2xl font-bold  text-yellow-800 text-center">
                {lastBook.title}
              </p> */}
              <p className="text-xl font-semibold text-yellow-800 text-center">
                Uploaded On: {formatDate(lastBook.createdAt)}
              </p>
            </div>
          )}

          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col items-center justify-center">
            <BsGraphUp className="text-4xl text-yellow-800 mb-2" />
            <h2 className="text-lg font-semibold text-gray-500 text-center">
              Pending Leads
            </h2>
            <p className="text-4xl font-bold  text-yellow-800  text-center">
              450
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col items-center justify-center">
            <FaUsers className="text-4xl  text-yellow-800 mb-2" />
            <h2 className="text-lg font-semibold text-gray-500 text-center">
              Active Users
            </h2>
            <p className="text-4xl font-bold text-yellow-800 text-center">
              5.6k
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8   lg:w-[70%] mx-auto">
          <div className="p-8  bg-white h-44  text-black rounded-lg border border-yellow-700">
            <h2 className="text-2xl  font-bold mb-2">Manage Books</h2>
            <p className="text-md mb-2">
              Easily add, update, or remove book details to keep your library
              organized and up-to-date.
            </p>
            <Link
              to="/admin/books"
              className="inline-block px-6 py-2 text-sm font-semibold text-white bg-yellow-800 rounded-md shadow-md hover:bg-yellow-700 transition-colors"
            >
              Books
            </Link>
          </div>

          <div className="p-8 bg-white text-black rounded-lg h-44 border border-yellow-700">
            <h2 className="text-2xl font-bold mb-2">Manage Users</h2>
            <p className="text-md mb-2">
              View and manage registered users to ensure a smooth user
              experience.
            </p>
            <Link
              to="/admin/users"
              className="inline-block px-6 py-2 text-sm font-semibold text-white  bg-yellow-800 rounded-md shadow-md hover:bg-yellow-700 transition-colors"
            >
              Users
            </Link>
          </div>

          <div className="p-8 bg-white text-black h-44 rounded-lg border border-yellow-700">
            <h2 className="text-2xl font-bold mb-2">Manage Authors</h2>
            <p className="text-md mb-2">
              View and manage registered authors to maintain a rich and diverse
              library.
            </p>
            <Link
              to="/admin/authors"
              className="inline-block px-6 py-2 text-sm font-semibold text-white bg-yellow-800 rounded-md shadow-md hover:bg-yellow-700 transition-colors"
            >
              Authors
            </Link>
          </div>

          <div className="p-8 bg-white text-black  h-44 rounded-lg border border-yellow-700">
            <h2 className="text-2xl font-bold mb-2">Manage Categories</h2>
            <p className="text-md mb-2">
              View and organize book categories for better navigation and
              discovery.
            </p>
            <Link
              to="/admin/categories"
              className="inline-block px-6 py-2 text-sm font-semibold text-white bg-yellow-800 rounded-md shadow-md hover:bg-yellow-700 transition-colors"
            >
              Categories
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
