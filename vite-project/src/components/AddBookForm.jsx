/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { addBook, getAuthors, getCategories } from "../services/api";
import toast from "react-hot-toast";


const AddBookForm = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [sourcePath, setSourcePath] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [samplePdf, setSamplePdf] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Error states
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await getCategories();
        const fetchedAuthors = await getAuthors();
        setCategories(fetchedCategories);
        setAuthors(fetchedAuthors);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e, setFile) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (e.target.name === "samplePdf" && selectedFile.type !== "application/pdf") {
      setErrors((prevErrors) => ({ ...prevErrors, samplePdf: "Only PDF files are allowed for sample!" }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, samplePdf: "" }));
    }

    if (selectedFile.size > 4 * 1024 * 1024) {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "File size must be less than 4MB" }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Inline validation
    const newErrors = {};
    if (!title) newErrors.title = "Title is required!";
    if (!description) newErrors.description = "Description is required!";
    if (!price || price < 0) newErrors.price = "Price must be greater than 0!";
    if (!category) newErrors.category = "Category is required!";
    if (!author) newErrors.author = "Author is required!";
    if (!sourcePath) newErrors.sourcePath = "Full book file is required!";
    if (!coverImage) newErrors.coverImage = "Cover image is required!";
    if (!samplePdf) newErrors.samplePdf = "Sample PDF is required!";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const discountedPrice = price - price * (discountPercentage / 100);
    setUploading(true);

    try {
      await addBook(
        { title, description, price, category, author, discountPercentage },
        sourcePath,
        coverImage,
        samplePdf
      );
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setAuthor("");
      setDiscountPercentage(0);
      setSourcePath(null);
      setCoverImage(null);
      setSamplePdf(null);
      toast.success("Book Added successfully!");

      onAdd();
    } catch (error) {
      console.error("Failed to add book", error);
      toast.error("Failed to Add book");

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 max-w-4xl w-full">
      <form onSubmit={handleSubmit} className="">
        <h2 className="text-3xl text-center font-bold mb-5">Add a New Book</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full focus:border-blue-900 focus:ring"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div>
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-bordered w-full focus:border-blue-900 focus:ring"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div>
            <input
              type="number"
              placeholder="Discount Percentage"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              className="input input-bordered w-full focus:border-blue-900 focus:ring"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered w-full focus:border-blue-900 focus:ring"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          </div>

          <div>
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="select select-bordered w-full focus:border-blue-900 focus:ring"
            >
              <option value="">Select Author</option>
              {authors.map((auth) => (
                <option key={auth._id} value={auth.name}>
                  {auth.name}
                </option>
              ))}
            </select>
            {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full focus:border-blue-900 focus:ring resize-none h-24"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label htmlFor="sourcePath" className="block text-gray-700 mb-2">The Full Book</label>
            <input
              type="file"
              name="sourcePath"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setSourcePath)}
              className="file-input w-full border-gray-300"
            />
            {errors.sourcePath && <p className="text-red-500 text-sm">{errors.sourcePath}</p>}
          </div>

          <div>
            <label htmlFor="samplePdf" className="block text-gray-700 mb-2">Sample</label>
            <input
              type="file"
              name="samplePdf"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, setSamplePdf)}
              className="file-input w-full border-gray-300"
            />
            {errors.samplePdf && <p className="text-red-500 text-sm">{errors.samplePdf}</p>}
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-gray-700 mb-2">Cover</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setCoverImage)}
              className="file-input w-full border-gray-300"
            />
            {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage}</p>}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-3">
          <button
            type="button"
            className="btn bg-slate-200 font-bold py-2 px-2 rounded-lg w-28"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="submit"
            className="btn bg-blue-800 hover:bg-blue-950 w-28 text-white font-bold py-2 px-2 rounded-lg"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
