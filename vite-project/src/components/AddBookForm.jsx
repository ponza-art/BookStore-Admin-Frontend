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
    <div className="flex justify-center items-center ">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full ">
        <h2 className="text-3xl font-bold mb-6 text-center  text-[#844f4f] ">Add a New Book</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered border-blue-950 w-full focus:border-amber-900 focus:ring focus:ring-amber-900 focus:ring-opacity-60"
          />

          {/* Price Input */}
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered border-blue-900 w-full focus:border-amber-900 focus:ring focus:ring-amber-900 focus:ring-opacity-60"
          />

          
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered input  text-[#5b2c2c] font-medium   border-blue-950 w-full focus:border-amber-900 focus:ring focus:ring-amber-900 focus:ring-opacity-60"
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
            className="select  text-[#5b2c2c] font-medium select-bordered input  border-blue-950 w-full focus:border-amber-900 focus:ring focus:ring-amber-900 focus:ring-opacity-60"
          >
            <option  className='text-[#936767]'  value="">Select Author</option>
            {authors.map((auth) => (
              <option className='text-[#936767]'  key={auth._id} value={auth.name}>
                {auth.name}
              </option>
            ))}
          </select>

   {/* Description Input */}
   <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full input  border-blue-950 w focus:border-amber-900 focus:ring focus:ring-amber-900 focus:ring-opacity-60 md:col-span-2"
          />


        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Source Path Upload */}
          <div className="mb-4">
            <label htmlFor="sourcePath" className="block text-[#936767] -600 mb-2">The Full Book</label>
            <input
              type="file"
              name="sourcePath"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setSourcePath)}
              className="file-input w-full border-gray-300"
            />
          </div>
  {/* Sample PDF Upload */}
  <div className="mb-6">
            <label htmlFor="samplePdf" className="block text-[#936767] mb-2">Sample</label>
            <input
              type="file"
              name="samplePdf"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, setSamplePdf)}
              className="file-input w-full border-gray-300"
            />
          </div>


          {/* Cover Image Upload */}
          <div className="mb-4">
            <label htmlFor="coverImage" className="block text-[#936767] mb-2">Cover</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setCoverImage)}
              className="file-input w-full border-gray-300"
            />
          </div>

        
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-2  mt-6">
              {/* Close Button */}
              <button
            type="button"
            onClick={onClose}
            className="btn  border-amber-900 bg-transparent  hover:bg-amber-700  text-blue-950 font-bold py-2 px-2 rounded-lg w-20"
          >
            Close
          </button>

          <button
            type="submit"
            className={`btn bg-amber-900 hover:bg-amber-700  w-20  text-white font-bold py-2 px-2 rounded-lg  ${uploading && 'cursor-not-allowed'}`}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add'}
          </button>

      
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
