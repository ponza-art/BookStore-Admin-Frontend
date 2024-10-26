import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/api";
import AddBookForm from "./AddBookForm";
import EditBookForm from "./EditBookForm";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); 
  const [editingBook, setEditingBook] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
    setCurrentPage(1); 
  }, [books, searchQuery]);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch books");
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await deleteBook(bookToDelete._id);
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookToDelete._id)
      );
      setLoading(false);
      Swal.fire("Deleted!", "Book deleted successfully.", "success");
    } catch (error) {
      setLoading(false);
      Swal.fire("Error!", "Failed to delete book.", "error");
      console.error("Failed to delete book", error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setBookToDelete(null);
    } 
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleUpdateSuccess = () => {
    fetchBooks();
    setEditingBook(null);
  };

  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleAddBookSuccess = () => {
    fetchBooks();
    setShowAddBookModal(false);
  };

  const handleCloseAddModal = () => {
    setShowAddBookModal(false);
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

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

  return (
    <div className="py-6 mt-16 lg:mt-11 bg-base-100 text-neutral font-sans p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
      <Toaster />

      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-x-4 sm:justify-between">
          <h2 className="text-3xl lg:self-start text-center sm:text-left font-bold">
            Manage Books
          </h2>

          <button
            onClick={handleAddBook}
            className="bg-transparent text-xl w-fit self-end text-end hover:underline font-semibold px-3 pt-3 pb-5"
          >
            Add Book
          </button>
        </div>

        {/* Search Input */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
      </div>

      {/* Book Table */}
      <div className="overflow-x-auto w-full">
        <table className="table w-full text-center rounded-lg mb-3">
          <thead>
            <tr className="rounded-sm bg-[#f7f9fc] tab-border-2 text-sm">
              <th className="px-4 py-2 text-start">ID</th>
              <th className="px-4 py-2 text-start">Title</th>
              <th className="px-4 py-2 text-start">Description</th>
              <th className="px-4 py-2 text-start">Original</th>
              <th className="px-4 py-2 text-start">Discount</th>
              <th className="px-4 py-2 text-start">Total</th>
              <th className="px-4 py-2 text-start">Category</th>
              <th className="px-4 py-2 text-start">Author</th>
              <th className="px-4 py-2 text-start">Cover</th>
              <th className="px-4 py-2 text-start">PDF</th>
              <th className="px-4 py-2 text-start">Link</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((book, index) => (
                <tr key={book._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 text-start">{index + 1 + startIndex}</td>
                  <td className="px-4 py-2 text-start max-w-28">{book.title}</td>
                  <td className="px-4 py-2 text-start truncate max-w-48">{book.description}</td>
                  <td className="px-4 py-2 text-start">${book.originalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-start">{book.discountPercentage}%</td>
                  <td className="px-4 py-2 text-start">${book.discountedPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-start max-w-24">{book.category}</td>
                  <td className="px-4 py-2 text-start max-w-24">{book.author}</td>
                  <td className="px-4 py-2 text-start">
                    <img src={book.coverImage} alt="cover" className="w-14 min-h-12 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2 text-start">
                    <a href={book.samplePdf} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline">Sample</a>
                  </td>
                  <td className="px-4 py-2 text-start">
                    <a href={book.sourcePath} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline">Book</a>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3 justify-center">
                      <button className="text-blue-800 duration-500 ml-2 hover:text-black p-2" onClick={() => handleEdit(book)} title="Edit Book">
                        <FaEdit size={20} />
                      </button>
                      <button className="text-blue-800 duration-500 ml-2 hover:text-black p-2" onClick={() => handleDeleteClick(book)} title="Delete Book">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 hover:bg-slate-400 hover:text-white py-1 rounded ${index + 1 === currentPage ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {editingBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-30">
          <div className="p-3 rounded-xl max-w-2xl w-full mx-4">
            <EditBookForm book={editingBook} onUpdateSuccess={handleUpdateSuccess} onCancel={() => setEditingBook(null)} />
          </div>
        </div>
      )}

      {showAddBookModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-30">
          <div className="p-3 rounded-xl max-w-2xl w-full mx-4">
            <AddBookForm onAdd={handleAddBookSuccess} onClose={handleCloseAddModal} />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-30">
          <div className="p-3 rounded-xl max-w-2xl w-full mx-4">
            <div className="bg-white rounded-xl p-8 max-w-4xl w-full">
              <h3 className="text-2xl text-start font-bold mb-4">Delete Confirmation</h3>
              <p>Are you sure you want to delete this book?</p>

              <div className="flex justify-end mt-4">
                <button onClick={() => setShowDeleteModal(false)} className="btn bg-slate-200 font-bold py-2 px-2 rounded-lg w-28">Cancel</button>
                <button onClick={handleDeleteConfirm} className="btn btn-danger bg-red-700 hover:bg-red-900 text-white w-28 ms-2">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
