import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/api"; 

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

        return (!latestDate || (bookDate && bookDate > latestDate)) ? book : latest;
    }, null);

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString() : "N/A";
    };

    if (loading) {
        return <span className="loading loading-bars  loading-lg text-cyan-900" style={{width:"350px",margin:"30vh 40vw"}}></span>
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold text-cyan-900 mb-4">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="p-6 bg-white rounded shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-cyan-800">Total Books</h2>
                    <p className="text-2xl font-bold text-cyan-900">{totalBooks}</p>
                </div>

                {lastBook && (
                    <div className="p-6 bg-white rounded shadow-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-cyan-800">Last Uploaded Book</h2>
                        <p className="text-lg font-bold text-cyan-900">{lastBook.title}</p>
                        <p className="text-sm text-gray-600">
                            Uploaded On: {formatDate(lastBook.createdAt)}
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Link
                    to="/admin/books"
                    className="p-6 bg-cyan-900 text-white rounded shadow-lg hover:transform hover:scale-105 transition-transform"
                >
                    <h2 className="text-xl font-semibold">Manage Books</h2>
                    <p className="text-sm">(Add, edit, and delete books)</p>
                </Link>

                <Link
                    to="/admin/users"
                    className="p-6 bg-cyan-900 text-white rounded shadow-lg hover:transform hover:scale-105 transition-transform"
                >
                    <h2 className="text-xl font-semibold">Manage Users</h2>
                    <p className="text-sm ">(View and manage registered users)</p>
                </Link>
                <Link
                    to="/admin/authors"
                    className="p-6 bg-cyan-900 text-white rounded shadow-lg hover:transform hover:scale-105 transition-transform"
                >
                    <h2 className="text-xl font-semibold">Manage Authors</h2>
                    <p className="text-sm ">(View and manage registered Authors)</p>
                </Link>
                <Link
                    to="/admin/categories"
                    className="p-6 bg-cyan-900 text-white rounded shadow-lg hover:transform hover:scale-105 transition-transform"
                >
                    <h2 className="text-xl font-semibold">Manage Categories</h2>
                    <p className="text-sm ">(View and manage Categories)</p>
                </Link>
                <Link
                    to="/admin/orders"
                    className="p-6 bg-cyan-900 text-white rounded shadow-lg hover:transform hover:scale-105 transition-transform"
                >
                    <h2 className="text-xl font-semibold">Manage Orders</h2>
                    <p className="text-sm ">(View orders)</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminPanel;
