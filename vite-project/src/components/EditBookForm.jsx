import React, { useState, useEffect } from 'react';
import { updateBook } from '../services/api';
import toast from 'react-hot-toast';

const EditBookForm = ({ book, onUpdate }) => {
  const [title, setTitle] = useState(book.title);
  const [description, setDescription] = useState(book.description);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTitle(book.title);
    setDescription(book.description);
  }, [book]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error('Only PDF files are allowed!');
        setFile(null);
      } else if (selectedFile.size > 4 * 1024 * 1024) {
        toast.error('File size must be less than 4MB!');
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('All fields are required!');
      return;
    }

    setUploading(true);

    try {
      await updateBook(book._id, { title, description }, file);
      toast.success('Book updated successfully!');
      onUpdate(); 
    } catch (error) {
      toast.error('Failed to update book');
      console.error('Failed to update book:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-8">
        <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full mb-4"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input w-full mb-4"
        />
        <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Update Book'}
        </button>
      </form>
    </div>
  );
};

export default EditBookForm;
