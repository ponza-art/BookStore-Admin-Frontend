import React, { useState, useEffect } from "react";
import { getBooks, deleteBook } from "../services/api";
import EditBookForm from "./EditBookForm";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);

  useEffect(() => {
    getBooks().then((data) => setBooks(data));
  }, []);

  const handleDelete = (_id) => {
    console.log("Deleting book with ID:", _id); // Log ID to debug
    deleteBook(id)
      .then(() => {
        setBooks(books.filter((book) => book._id !== _id));
      })
      .catch((error) => {
        console.error("Failed to delete book:", error);
        alert("Failed to delete book. Please try again.");
      });
  };

  const handleEditSuccess = () => {
    setEditingBookId(null);
    getBooks().then((data) => setBooks(data)); // Refresh the book list after edit
  };

  return (
    <div className="book-list">
      <h2>Book List</h2>
      {editingBookId ? (
        <EditBookForm bookId={editingBookId} onEditSuccess={handleEditSuccess} />
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} 
              <button onClick={() => handleDelete(book._id)}>Delete</button>
              <button onClick={() => setEditingBookId(book.id)}>Edit</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
