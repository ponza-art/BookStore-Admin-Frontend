import React, { useState, useEffect } from 'react';
import { updateBook, getAuthors, getCategories } from '../services/api';
import toast from 'react-hot-toast';

const EditBookForm = ({ book, onUpdateSuccess, onCancel }) => {
  const [title, setTitle] = useState(book.title || '');
  const [description, setDescription] = useState(book.description || '');
  const [price, setPrice] = useState(book.price || '');
  const [category, setCategory] = useState(book.category || '');
  const [authorName, setAuthorName] = useState(book.author || '');
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [sourcePath, setSourcePath] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [samplePdf, setSamplePdf] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch authors and categories when component mounts
    const fetchData = async () => {
      try {
        const fetchedCategories = await getCategories();
        const fetchedAuthors = await getAuthors();
        setCategories(fetchedCategories);
        setAuthors(fetchedAuthors);
      } catch (error) {
        toast.error('Failed to load authors and categories');
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e, setFile) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (e.target.name === 'samplePdf' && selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed for sample!');
      return;
    }

    if (selectedFile.size > 4 * 1024 * 1024) {
      toast.error('File size must be less than 4MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !category || !authorName) {
      toast.error('All fields are required!');
      return;
    }

    if (price < 0) {
        toast.error('Price cannot be less than 0!');
        return;
      }

    const updatedBook = { title, description, price, category, authorName };

    setUploading(true);

    try {
      await updateBook(book._id, updatedBook, coverImage, samplePdf, sourcePath);
      toast.success('Book updated successfully!');
      onUpdateSuccess();
    } catch (error) {
      toast.error('Failed to update book');
      console.error('Failed to update book', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-8">
      <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
      <form onSubmit={handleSubmit}>
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
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-full mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>

        {/* Author Dropdown */}
        <select
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="select select-bordered w-full mb-4"
        >
          <option value="">Select Author</option>
          {authors.map((auth) => (
            <option key={auth._id} value={auth.name}>
              {auth.name}
            </option>
          ))}
        </select>

        <label htmlFor="sourcePath">The Full Book</label>
        <input
          type="file"
          name="sourcePath"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, setSourcePath)}
          className="file-input w-full mb-4"
        />
        <label htmlFor="coverImage">Cover</label>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setCoverImage)}
          className="file-input w-full mb-4"
        />
        <label htmlFor="samplePdf">Sample</label>
        <input
          type="file"
          name="samplePdf"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e, setSamplePdf)}
          className="file-input w-full mb-4"
        />
        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary w-1/2" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Update Book'}
          </button>
          <button type="button" className="btn btn-secondary w-1/2" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
