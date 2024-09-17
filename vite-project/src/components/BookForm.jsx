import React, { useState } from "react";
import { addBook } from "../services/api";

const BookForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = { title, description };
    addBook(newBook, file).then(() => {
      setTitle("");
      setDescription("");
      setFile(null);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Book</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered"
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="file-input" />
      <button type="submit" className="btn btn-primary">Add Book</button>
    </form>
  );
};

export default BookForm;
