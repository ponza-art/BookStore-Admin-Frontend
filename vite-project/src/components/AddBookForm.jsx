import React, { useState } from 'react';
import { addBook } from '../services/api';
import toast from 'react-hot-toast';

const AddBookForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (selectedFile && selectedFile.size > 4 * 1024 * 1024) {
      toast.error('File size must be less than 4MB');
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      toast.error('All fields are required!');
      return;
    }

    setUploading(true);

    try {
      await addBook({ title, description }, file);

      setTitle('');
      setDescription('');
      setFile(null);
      toast.success('Book added successfully!');

      onAdd();
    } catch (error) {
      toast.error('Failed to add book');
      console.error('Failed to add book', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-8">
        <h2 className="text-2xl font-bold mb-4">Add a New Book</h2>
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
          accept="application/pdf"
          onChange={handleFileChange}
          className="file-input w-full mb-4"
        />
        <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;
