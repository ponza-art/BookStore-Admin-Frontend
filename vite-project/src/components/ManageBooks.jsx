import React, { useEffect, useState } from "react";
import { getBooks, deleteBook, updateBook } from "../services/api";
import AddBookForm from "./AddBookForm";
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaBook } from "react-icons/fa";

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [editingBook, setEditingBook] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newFile, setNewFile] = useState(null);
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (error) {
            toast.error("Failed to fetch books");
            console.error("Failed to fetch books", error);
        }
    };

    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteBook(bookToDelete._id);
            setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookToDelete._id));
            toast.success("Book deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete book");
            console.error("Failed to delete book", error);
        } finally {
            setShowDeleteModal(false);
            setBookToDelete(null);
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setNewTitle(book.title);
        setNewDescription(book.description);
        setNewFile(null); // Reset file input
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
    
        if (selectedFile) {
            // Check if the file is a PDF
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed');
                return;
            }

            // Check if the file size is less than 4MB
            if (selectedFile.size > 4 * 1024 * 1024) {
                toast.error('File size must be less than 4MB');
                return;
            }

            // Set the file if it meets the conditions
            setNewFile(selectedFile);
        }
    };

    const handleUpdate = async (id) => {
        if (!newTitle || !newDescription) {
            toast.error("All fields are required");
            return;
        }

        const updatedBook = { title: newTitle, description: newDescription };

        setUploading(true);

        try {
            await updateBook(id, updatedBook, newFile);
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book._id === id ? { ...book, ...updatedBook } : book))
            );
            setEditingBook(null);
            toast.success("Book updated successfully!");
        } catch (error) {
            toast.error("Failed to update book");
            console.error("Failed to update book:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleAddBook = () => {
        setShowAddBookModal(true);
    };

    const handleAddBookSuccess = () => {
        fetchBooks(); // Refresh the book list after adding a new book
        setShowAddBookModal(false);
    };

    return (
        <div className="container mx-auto my-8 p-4 lg:p-8 flex flex-col items-center">
            <Toaster />
            <h2 className="text-3xl font-bold mb-4 text-cyan-900 flex items-center">
                <FaBook className="mr-2" /> Manage Books
            </h2>

            <button
                onClick={handleAddBook}
                className="btn btn-primary mb-4 bg-cyan-900 hover:bg-cyan-800 text-white rounded-md px-4 py-2 flex items-center"
            >
                <FaPlus className="mr-2" /> Add Book
            </button>

            <table className="table w-full bg-white shadow-md rounded mb-8 border text-center">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 border">#</th>
                        <th className="px-4 py-2 border">Title</th>
                        <th className="px-4 py-2 border">Description</th>
                        <th className="px-4 py-2 border">Source Path</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length > 0 ? (
                        books.map((book, index) => (
                            <tr key={book._id} className="border-t hover:bg-gray-100">
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{book.title}</td>
                                <td className="px-4 py-2 border">{book.description}</td>
                                <td className="px-4 py-2 border">
                                    {book.sourcePath ? (
                                        <a href={book.sourcePath} target="_blank" rel="noopener noreferrer" className="text-cyan-900">
                                            View File
                                        </a>
                                    ) : (
                                        <span>No file</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border">
                                    <button className="btn btn-outline mr-2 text-cyan-900" onClick={() => handleEdit(book)}>
                                        <FaEdit />
                                    </button>
                                    <button className="btn btn-outline text-red-600" onClick={() => handleDeleteClick(book)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">No books found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editingBook && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="modal-box bg-white p-8 rounded shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-cyan-900">Edit Book</h3>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="New Title"
                            className="input input-bordered w-full mb-4"
                            required
                        />
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="New Description"
                            className="textarea textarea-bordered w-full mb-4"
                            required
                        />
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="file-input w-full mb-4"
                        />
                        <button
                            onClick={() => handleUpdate(editingBook._id)}
                            className="btn btn-primary bg-cyan-900 hover:bg-cyan-800 text-white mr-2"
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Update"}
                        </button>
                        <button onClick={() => {
                            setEditingBook(null);
                            setNewTitle('');
                            setNewDescription('');
                            setNewFile(null);
                        }} className="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showAddBookModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="modal-box bg-white p-8 rounded shadow-lg">
                        <AddBookForm onAdd={handleAddBookSuccess} />
                        <button onClick={() => setShowAddBookModal(false)} className="btn btn-secondary mt-4">Close</button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="modal-box bg-white p-8 rounded shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-red-600">Delete Confirmation</h3>
                        <p>Are you sure you want to delete this book?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn btn-danger bg-red-600 hover:bg-red-700 text-white mr-2"
                            >
                                Delete
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBooks;
