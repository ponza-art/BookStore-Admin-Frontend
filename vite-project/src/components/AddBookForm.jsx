import React, { useState, useEffect } from 'react';
import { addBook, getAuthors, getCategories } from '../services/api';
import toast from 'react-hot-toast';

const AddBookForm = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [sourcePath, setSourcePath] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [samplePdf, setSamplePdf] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
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
    if (!title || !description || !price || !category || !author || !sourcePath || !coverImage || !samplePdf) {
      toast.error('All fields are required!');
      return;
    }

    if (price < 0) {
      toast.error('Price cannot be less than 0!');
      return;
    }

    setUploading(true);

    try {
      await addBook({ title, description, price, category, author }, sourcePath, coverImage, samplePdf);
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setAuthor('');
      setSourcePath(null);
      setCoverImage(null);
      setSamplePdf(null);
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
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
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
          {uploading ? 'Uploading...' : 'Add Book'}
        </button>

        {/* Close Button inside the form */}
        <button type='button' onClick={onClose} className="btn btn-secondary w-1/2">
          Close
        </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
