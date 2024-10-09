import React, { useEffect, useState } from "react";
import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from "../services/api";
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ManageAuthors = () => {
    const [authors, setAuthors] = useState([]);
    const [newAuthor, setNewAuthor] = useState({ name: "", image: null });
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const data = await getAuthors();
            setAuthors(data);
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
        document.getElementById('author-image').value = null;
    };

    const isNameUnique = () => {
        return !authors.some(
            (author) =>
                author.name.toLowerCase() === newAuthor.name.trim().toLowerCase() &&
                author._id !== (editingAuthor ? editingAuthor._id : null)
        );
    };

    const handleAddOrUpdateAuthor = async () => {
        if (!newAuthor.name || (!newAuthor.image && !editingAuthor)) {
            toast.error("Author name and image are required");
            return;
        }
        if (!isNameUnique()) {
            toast.error("Author name must be unique");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", newAuthor.name);
        if (newAuthor.image) formData.append("file", newAuthor.image);

        try {
            if (editingAuthor) {
                await updateAuthor(editingAuthor._id, formData);
                toast.success("Author updated successfully!");
            } else {
                await addAuthor(formData);
                toast.success("Author added successfully!");
            }
            fetchAuthors();
            resetForm();
            setShowModal(false);
        } catch (error) {
            toast.error("Failed to add/update author");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (author) => {
        setEditingAuthor(author);
        setNewAuthor({ name: author.name, image: null });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this author?");
        if (!confirmed) return;

        setLoading(true);
        try {
            await deleteAuthor(id);
            toast.success("Author deleted successfully!");
            fetchAuthors();
        } catch (error) {
            toast.error("Failed to delete author");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto my-8 p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
            <Toaster />
            <h2 className="text-3xl text-amber-900  font-bold mb-12">Manage Authors</h2>
            <button 
                onClick={() => setShowModal(true)}
                className="fixed bg-transparent text-xl hover:underline font-semibold right-14 border-[#853e3e] text-[#936767] mb-5 px-3 py-10"
            >
                Add Author
            </button>
            <div className="overflow-x-auto w-full">
                <table className="table-auto border w-full text-center shadow-md rounded-lg mb-8">
                    <thead>
                        <tr className="bg-[#e2d6d6] tab-border-2 text-sm">
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Image</th>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.length > 0 ? (
                            authors.map((author, index) => (
                                <tr key={author._id} className="border-t hover:bg-gray-100">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border  flex justify-center">
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
                                    <td className="px-4 py-2 border">{author.name}</td>
                                    <td className="px-4 py-2 border">
                                        <div className="flex justify-center">
                                            <button
                                                className="text-[#612121] p-2 flex items-center justify-center"
                                                onClick={() => handleEdit(author)}
                                                title="Edit Author"
                                            >
                                                <FaEdit size={20} />
                                            </button>
                                            <button
                                                className="text-[#a42323] p-2 flex items-center justify-center"
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

            {showModal && (
                <div className="fixed  inset-0 flex items-center justify-center bg-black bg-opacity-90">
                  
                    <div className="modal-box  bg-amber-900  p-3 rounded max-w-2xl w-full mx-4">
                    <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
                        <h3 className="text-2xl  text-[#612121] text-center font-bold mb-4">{editingAuthor ? "Edit Author" : "Add Author"}</h3>
                        <input
                            type="text"
                            value={newAuthor.name}
                            onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                            placeholder="Author Name"
                            className="input input-bordered mb-4 border-blue-900 w-full focus:border-amber-900 focus:ring focus:ring-amber-900 focus:ring-opacity-60"
                        />
                        <input
                            type="file"
                            id="author-image"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered w-full mb-4   border-blue-950  focus:border-amber-900 focus:ring focus:ring-amber-900 focus:ring-opacity-60"
                        />

                        <div className="flex justify-center gap-2  mt-6">
                        <button
                                onClick={() => setShowModal(false)}
                                className="btn  border-amber-900 bg-transparent  hover:bg-amber-700  text-blue-950 font-bold py-2 px-2 rounded-lg w-20"
                                >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOrUpdateAuthor}
                                disabled={loading}
                                className={`btn  bg-amber-900 hover:bg-amber-700  w-20  text-white font-bold py-2 px-2 rounded-lg   ${loading ? "btn-disabled" : "btn-amber-700"}`}
                            >
                                {editingAuthor ? "Update " : "Add "}
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

