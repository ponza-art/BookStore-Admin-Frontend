/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({ name: "", image: null });
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [enable, setEnable] = useState(true);

  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Customize items per page

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    // Filter and paginate authors when search query or authors list changes
    const filtered = authors.filter((author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAuthors(filtered);
    setCurrentPage(1); // Reset to first page on search change
  }, [authors, searchQuery]);

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors();
      setAuthors(data);
      setLoading(true);
    } catch (error) {
      toast.error("Failed to fetch authors");
    }
  };

  const handleImageChange = (e) => {
    setNewAuthor({ ...newAuthor, image: e.target.files[0] });
  };

  const resetForm = () => {
    setNewAuthor({ name: "", image: null });
    setEditingAuthor(null);
    document.getElementById("author-image").value = null;
  };

  const isNameUnique = () => {
    return !authors.some(
      (author) =>
        author.name.toLowerCase() === newAuthor.name.trim().toLowerCase() &&
        author._id !== (editingAuthor ? editingAuthor._id : null)
    );
  };

  const handleAddOrUpdateAuthor = async () => {
    setEnable(false);
    if (!newAuthor.name || (!newAuthor.image && !editingAuthor)) {
      toast.error("Author name and image are required");
      setEnable(true);
      return;
    }
    if (!isNameUnique()) {
      toast.error("Author name must be unique");
      setEnable(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", newAuthor.name);
    if (newAuthor.image) formData.append("file", newAuthor.image);

    try {
      if (editingAuthor) {
        await updateAuthor(editingAuthor._id, formData);
        setLoading(false);
        toast.success("Author updated successfully!");
      } else {
        await addAuthor(formData);
        setLoading(false);
        toast.success("Author added successfully!");
      }
      setEnable(true);
      fetchAuthors();
      resetForm();
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to add/update author");
      setEnable(true);
    } finally {
      setLoading(false);
      setEnable(true);
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setNewAuthor({ name: author.name, image: null });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this author?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b90303",
      cancelButtonColor: "#e2e8f0",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await deleteAuthor(id);
        fetchAuthors();
        setLoading(false);
        Swal.fire("Deleted!", "Author deleted successfully.", "success");
      } catch (error) {
        setLoading(false);
        Swal.fire("Error!", "Failed to delete author.", "error");
        toast.error("Failed to delete author");
      } finally {
        setLoading(false);
      }
    }
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  if (!loading)
    return (
      <div className="flex justify-center items-center">
        <span
          className="loading loading-bars loading-lg text-blue-800"
          style={{ width: "20%", margin: "30vh 30vw" }}
        ></span>
      </div>
    );

  return (
    <div className="py-6 mt-16 lg:mt-11 bg-base-100 text-neutral font-sans p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
      <Toaster />
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-x-4 sm:justify-between">
          <h2 className="text-3xl lg:self-start text-center sm:text-left font-bold">
            Manage Authors
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-transparent text-xl w-fit self-end text-end hover:underline font-semibold px-3 pt-3 pb-5"
          >
            Add Author
          </button>
        </div>

        {/* Search Input */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search by author name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table w-full text-center rounded-lg mb-3">
          <thead>
            <tr className="rounded-sm bg-[#f7f9fc] tab-border-2 text-sm">
              <th className="px-4 py-2 text-start">ID</th>
              <th className="px-4 py-2 text-start min-w-36">Image</th>
              <th className="px-4 py-2 text-start">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAuthors.length > 0 ? (
              paginatedAuthors.map((author, index) => (
                <tr key={author._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 text-start">{index + 1 + startIndex}</td>
                  <td className="px-4 py-2 text-start flex justify-start">
                    {author.image ? (
                      <img
                        src={author.image}
                        alt="cover"
                        className="w-22 h-20 flex justify-center object-fill rounded-lg"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-start">{author.name}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3 justify-center">
                      <button
                        className="text-blue-800 duration-500 ml-2 hover:text-black p-2"
                        onClick={() => handleEdit(author)}
                        title="Edit Author"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-blue-800 duration-500 ml-2 hover:text-black p-2"
                        onClick={() => handleDelete(author._id)}
                        title="Delete Author"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No authors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${
              index + 1 === currentPage ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for Adding/Editing Authors */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-30">
          <div className="p-3 rounded-xl max-w-2xl w-full mx-4">
            <div className="bg-white rounded-xl p-8 max-w-4xl w-full">
              <h3 className="text-2xl text-center font-bold mb-4">
                {editingAuthor ? "Edit Author" : "Add Author"}
              </h3>
              <input
                type="text"
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                placeholder="Author Name"
                className="input input-bordered w-full my-4 border-blue-900 focus:ring"
              />
              <input
                type="file"
                id="author-image"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full mb-4 border-blue-800 focus:border-blue-950 focus:ring focus:ring-blue-800"
              />
              <div className="flex justify-center gap-2 mt-6">
                <button
                  disabled={!enable}
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn bg-slate-200 font-bold py-2 px-2 rounded-lg w-28"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddOrUpdateAuthor}
                  disabled={!enable}
                  className={`btn bg-blue-800 hover:bg-blue-950 text-white font-bold py-2 w-28 px-2 rounded-lg`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAuthors;
