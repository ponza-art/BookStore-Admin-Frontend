/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getBooks,
  getUsers,
  getAuthors,
  getCategories,
  getAllReviews,
} from "../services/api";
// import { BsGraphUp } from "react-icons/bs";
import { FaBook, FaUsers, FaChartLine, FaPencilAlt } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookData = await getBooks();
        const usersData = await getUsers();
        const categoriesData = await getCategories();
        const authorsData = await getAuthors();
        const reviewsData = await getAllReviews();
        setBooks(bookData);
        setAllCategories(categoriesData);
        setAllAuthors(authorsData);
        setReviews(reviewsData.length);
        setUsers(usersData.data.Users.length);
      } catch (err) {
        console.log(err);
        setError("Failed to load Data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalBooks = books.length;
  const categories = allCategories.length;
  const authors = allAuthors.length;

  const lastBook = books.reduce((latest, book) => {
    const bookDate = book.createdAt ? new Date(book.createdAt) : null;
    const latestDate = latest?.createdAt ? new Date(latest.createdAt) : null;
    return !latestDate || (bookDate && bookDate > latestDate) ? book : latest;
  }, null);
  const lastCategory = allCategories.reduce((last, cat) => {
    const catDate = cat.createdAt ? new Date(cat.createdAt) : null;
    const lastDate = last?.createdAt ? new Date(last.createdAt) : null;
    return !lastDate || (catDate && catDate > lastDate) ? cat : last;
  }, null);
  const lastAuthor = allAuthors.reduce((last, auth) => {
    const authDate = auth.createdAt ? new Date(auth.createdAt) : null;
    const lastDate = last?.createdAt ? new Date(last.createdAt) : null;
    return !lastDate || (authDate && authDate > lastDate) ? auth : last;
  }, null);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  if (loading) {
    return (
      <span
        className="loading loading-bars  loading-lg text-cyan-900"
        style={{ width: "20%", margin: "30vh 30vw" }}
      ></span>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  let statistics = [
    {
      icon: FaBook,
      label: "Total Books",
      value: totalBooks,
      condition: true,
    },
    // {
    //   icon: BsGraphUp,
    //   label: "Pending Leads",
    //   value: 450,
    //   condition: true,
    // },
    {
      icon: FaPencilAlt,
      label: "Total Authors",
      value: authors,
      condition: true,
    },
    {
      icon: BiCategoryAlt,
      label: "Total Categories",
      value: categories,
      condition: true,
    },
    {
      icon: FaUsers,
      label: "Total Users",
      value: users,
      condition: true,
    },
    {
      icon: MdRateReview,
      label: "Total Reviews",
      value: reviews,
      condition: true,
    },
    {
      icon: FaChartLine,
      label: "Last Uploaded Book",
      value: lastBook?.title,
      options: `Date: ${formatDate(lastBook.createdAt)}`,
      condition: lastBook,
    },
    {
      icon: FaChartLine,
      label: "Last Uploaded Category",
      value: lastCategory?.title,
      options: `Date: ${formatDate(lastCategory.createdAt)}`,
      condition: lastCategory,
    },
    {
      icon: FaChartLine,
      label: "Last Uploaded Author",
      value: lastAuthor?.name,
      options: `Date: ${formatDate(lastAuthor.createdAt)}`,
      condition: lastAuthor,
    },
  ];

  let blocks = [
    {
      label: "Manage Books",
      description:
        "Easily add, update, or remove book details to keep your library organized and up-to-date.",
      route: "/books",
      routeLabel: "Books",
    },
    {
      label: "Manage Users",
      description:
        "View and manage registered users to ensure a smooth user experience.",
      route: "/users",
      routeLabel: "Users",
    },
    {
      label: "Manage Authors",
      description:
        "View and manage registered authors to maintain a rich and diverse library.",
      route: "/authors",
      routeLabel: "Authors",
    },
    {
      label: "Manage Categories",
      description:
        "View and organize book categories for better navigation and discovery.",
      route: "/categories",
      routeLabel: "Categories",
    },
    {
      label: "Manage Reviews",
      description:
        "View and manage reviews to maintain user feedback and quality control.",
      route: "/reviews",
      routeLabel: "Reviews",
    },
  ];

  return (
    <>
      <div className="p-4 my-5 text-center">
        <h1 className="text-3xl text-blue-950  font-bold mb-12">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
          {statistics.map((stat, index) =>
            stat.condition ? (
              <div
                key={index}
                className="py-8 flex flex-col items-center gap-2 justify-center bg-white rounded-lg shadow-lg border border-gray-200"
              >
                <stat.icon className="text-3xl text-blue-950 mb-2" />
                <h2 className="text-lg font-semibold text-gray-500 text-center">
                  {stat.label}
                </h2>
                <p
                  className={`${
                    typeof stat.options != "string"
                      ? "text-2xl"
                      : "text-lg mb-1"
                  } font-bold text-blue-950 text-center`}
                >
                  {stat.value}
                </p>
                {stat.options && (
                  <p className="text-xl font-semibold text-cyan-7 00 text-center">
                    {stat.options}
                  </p>
                )}
              </div>
            ) : (
              ""
            )
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7 my-8 mb-7 mx-auto">
          {blocks.map((block, index) => (
            <div
              key={index}
              // className="min-w-80 max-w-[50%] p-8 flex flex-col justify-between gap-4 bg-white text-black rounded-lg border border-yellow-700"
              className="py-8 px-3 flex flex-col justify-between gap-4 overflow-hidden bg-white text-black rounded-lg border border-blue-800"
            >
              <div className="">
                <h2 className="text-2xl font-bold mb-2">{block.label}</h2>
              </div>
              <p className="text-md mb-2 text-ellipsis overflow-hidden line-clamp-2">
                {block.description}
              </p>
              <Link
                to={block.route}
                className="w-fit mx-auto px-6 py-2 text-sm font-semibold text-white bg-blue-800 rounded-md shadow-md hover:bg-blue-950 transition-colors"
              >
                {block.routeLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
