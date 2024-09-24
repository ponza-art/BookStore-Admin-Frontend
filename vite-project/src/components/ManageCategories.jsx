import React, { useEffect, useState } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    const handleAddCategory = async () => {
        try {
            if (!newCategory) {
                toast.error("Category title cannot be empty");
                return;
            }
            await addCategory({ title: newCategory }); // Updated to use 'title'
            setNewCategory('');
            fetchCategories();
            toast.success("Category added successfully!");
        } catch (error) {
            console.error("Add Category Error: ", error);
            toast.error("Failed to add category");
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory(category.title); // Ensure you're using 'title'
    };

    const handleUpdateCategory = async () => {
        try {
            if (!newCategory) {
                toast.error("Category title cannot be empty");
                return;
            }
            await updateCategory(editingCategory._id, { title: newCategory }); // Updated to use 'title'
            setEditingCategory(null);
            setNewCategory('');
            fetchCategories();
            toast.success("Category updated successfully!");
        } catch (error) {
            console.error("Update Category Error: ", error);
            toast.error("Failed to update category");
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id);
            fetchCategories();
            toast.success("Category deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    return (
        <div className="container mx-auto my-8 p-4">
            <Toaster />
            <h2 className="text-3xl font-bold mb-4">Manage Categories</h2>
            <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category Title"
                className="input mb-4"
            />
            <button onClick={editingCategory ? handleUpdateCategory : handleAddCategory} className="btn">
                {editingCategory ? "Update Category" : "Add Category"}
            </button>
            <ul className="mt-4">
                {categories.map((category) => (
                    <li key={category._id} className="flex justify-between items-center">
                        <span>{category.title}</span> {/* Display 'title' */}
                        <div>
                            <button onClick={() => handleEditCategory(category)} className="btn btn-edit">Edit</button>
                            <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-delete">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageCategories;
