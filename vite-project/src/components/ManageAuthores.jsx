import React, { useEffect, useState } from "react";
import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from "../services/api";
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageAuthors = () => {
    const [authors, setAuthors] = useState([]);
    const [newAuthor, setNewAuthor] = useState({ name: "", image: null });
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleAddAuthor = async () => {
        if (!newAuthor.name || !newAuthor.image) {
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
        formData.append("file", newAuthor.image);

        try {
            await addAuthor(formData);
            toast.success("Author added successfully!");
            fetchAuthors();
            resetForm();
        } catch (error) {
            toast.error("Failed to add author");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (author) => {
        setEditingAuthor(author);
        setNewAuthor({ name: author.name, image: null });
    };

    const handleUpdate = async () => {
        if (!newAuthor.name) {
            toast.error("Author name is required");
            return;
        }
        if (!isNameUnique()) {
            toast.error("Author name must be unique");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", newAuthor.name);
        if (newAuthor.image) {
            formData.append("file", newAuthor.image);
        }

        try {
            await updateAuthor(editingAuthor._id, formData);
            toast.success("Author updated successfully!");
            fetchAuthors();
            resetForm();
        } catch (error) {
            toast.error("Failed to update author");
        } finally {
            setLoading(false);
        }
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
        <div className="container mx-auto my-8 p-4">
            <Toaster />
            <h2 className="text-3xl font-bold mb-6">Manage Authors</h2>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <input
                    type="text"
                    value={newAuthor.name}
                    onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                    placeholder="Author Name"
                    className="input input-bordered w-full max-w-xs"
                />
                <input
                    type="file"
                    id="author-image"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full max-w-xs"
                />
                <button
                    onClick={editingAuthor ? handleUpdate : handleAddAuthor}
                    disabled={loading}
                    className={`btn ${loading ? "btn-disabled" : "btn-primary"}`}
                >
                    {editingAuthor ? "Update Author" : "Add Author"}
                </button>
            </div>
            <table className="table w-full mt-6">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {authors.map((author, index) => (
                        <tr key={author._id}>
                            <td>{index + 1}</td>
                            <td>
                                {author.image ? (
                                    <img
                                        src={author.image}
                                        alt={author.name}
                                        className="w-16 h-16 object-cover rounded-full"
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
                            <td>{author.name}</td>
                            <td className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(author)}
                                    className="btn btn-outline"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(author._id)}
                                    className="btn btn-outline btn-error"
                                    disabled={loading}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageAuthors;
