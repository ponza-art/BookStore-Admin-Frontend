import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/api";
import AddBookForm from "./AddBookForm";
import EditBookForm from "./EditBookForm"; // Import the new component
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

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
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookToDelete._id)
      );
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
  };

  const handleUpdateSuccess = () => {
    fetchBooks(); // Refresh the book list after editing
    setEditingBook(null);
  };

  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleAddBookSuccess = () => {
    fetchBooks(); // Refresh the book list after adding a new book
    setShowAddBookModal(false);
  };

  const handleCloseAddModal = () => {
    setShowAddBookModal(false); // Close the modal when the "Close" button is clicked
  };

  return (
    <div className="container mx-auto my-8 p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
      <Toaster />
      <h2 className="text-3xl text-amber-900  font-bold mb-12 ">Manage Books</h2>
      <button
        onClick={handleAddBook}
        className="fixed  bg-transparent text-xl  hover:underline font-semibold  right-14 border-[#853e3e] text-[#936767] mb-5  px-3 py-10 "
        
      >
     Add Book
      </button>
      <div className="overflow-x-auto w-full">
        <table className="table-auto border w-full text-center shadow-md rounded-lg mb-8 ">
          <thead>
            <tr className="bg-[#e2d6d6] tab-border-2  text-sm">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Author</th>
              <th className="px-4 py-2 border">Cover</th>
              <th className="px-4 py-2 border"> PDF</th>
              <th className="px-4 py-2 border">Link</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book, index) => (
                <tr key={book._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border text-sm truncate">{book.title}</td>
                  <td className="px-4 py-2 border text-sm truncate max-w-xs">{book.description}</td>
                  <td className="px-4 py-2 border">${book.price}</td>
                  <td className="px-4 py-2 border">{book.category}</td>
                  <td className="px-4 py-2 border">{book.author}</td>
                  <td className="px-4 py-2 border">
                    <img
                      src={book.coverImage}
                      alt="cover"
                      className="w-14 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={book.samplePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-800 hover:underline"
                    >
                       Sample
                    </a>
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={book.sourcePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-800 hover:underline"
                    >
                      Book
                    </a>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex justify-center ">
                      <button
                        className=" text-[#612121] p-2  flex items-center justify-center"
                        onClick={() => handleEdit(book)}
                        title="Edit Book"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className=" text-[#a42323] p-2  flex items-center justify-center"
                        onClick={() => handleDeleteClick(book)}
                        title="Delete Book"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="modal-box bg-amber-900 p-3 rounded  max-w-2xl w-full mx-4">
            <EditBookForm
              book={editingBook}
              onUpdateSuccess={handleUpdateSuccess}
              onCancel={() => setEditingBook(null)}
            />
          </div>
        </div>
      )}

      {showAddBookModal && (
        <div className="fixed  inset-0 flex items-center   justify-center bg-black bg-opacity-90">
          <div className="modal-box bg-amber-900 p-3 rounded  max-w-2xl w-full mx-4">
            <AddBookForm
              onAdd={handleAddBookSuccess}
              onClose={handleCloseAddModal}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85">
          <div className="modal-box bg-orange-50 p-8 rounded shadow-lg max-w-lg w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-[#563c3c] ">
              Delete Confirmation
            </h3>
            <p>Are you sure you want to delete this book?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-danger bg-[#853e3e] hover:bg-red-700 text-white mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn  border-amber-900 bg-transparent  hover:bg-[#853e3e]  text-blue-950 font-bold py-2 px-2 rounded-lg w-20"

              >
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
