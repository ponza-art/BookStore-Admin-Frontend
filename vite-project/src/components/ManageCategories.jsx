import React, { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import toast, { Toaster } from "react-hot-toast";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
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
      await addCategory({ title: newCategory });
      setNewCategory("");
      fetchCategories();
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Add Category Error: ", error);
      toast.error("Failed to add category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.title);
  };

  const handleUpdateCategory = async () => {
    try {
      if (!newCategory) {
        toast.error("Category title cannot be empty");
        return;
      }
      await updateCategory(editingCategory._id, { title: newCategory });
      setEditingCategory(null);
      setNewCategory("");
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
    <div className="container mx-auto my-8 p-6 bg-white shadow-lg rounded-lg ">
      <Toaster />
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">
        Manage Categories
      </h2>
      <div className="flex flex-col md:flex-row mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category Title"
          className="flex-grow p-2 border border-gray-300 rounded-md md:rounded-l-md focus:outline-none focus:ring focus:ring-indigo-200 mb-2 md:mb-0 md:mr-2"
        />
        <button
          onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
          className={`px-4 py-2 text-white rounded-md md:rounded-r-md ${
            editingCategory
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {editingCategory ? "Update Category" : "Add Category"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="py-3 px-4 uppercase font-semibold text-sm">
                Category Title
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{category.title}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
