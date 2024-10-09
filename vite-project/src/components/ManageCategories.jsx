import React, { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const resetForm = () => {
    setNewCategory("");
    setEditingCategory(null);
  };

  const handleAddOrUpdateCategory = async () => {
    if (!newCategory) {
      toast.error("Category title cannot be empty");
      return;
    }
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, { title: newCategory });
        toast.success("Category updated successfully!");
      } else {
        await addCategory({ title: newCategory });
        toast.success("Category added successfully!");
      }
      resetForm();
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(`Failed to ${editingCategory ? "update" : "add"} category`);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.title);
    setShowModal(true);
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="container mx-auto my-8 p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
      <Toaster />
      <h2 className="text-3xl text-amber-900  font-bold mb-12 ">Manage Categories</h2>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bg-transparent text-xl hover:underline font-semibold right-14 border-[#853e3e] text-[#936767] mb-5 px-3 py-10"
      >
        Add Category
      </button>
      <div className="overflow-x-auto w-full">
        <table className="table-auto border w-full text-center shadow-md rounded-lg mb-8">
          <thead>
            <tr className="bg-[#e2d6d6] tab-border-2 text-sm">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Category Title</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 text-xl py-2 border">{category.title}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex justify-center">
                      <button
                        className="text-[#612121] p-2 flex items-center justify-center"
                        onClick={() => handleEditCategory(category)}
                        title="Edit Category"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-[#a42323] p-2 flex items-center justify-center"
                        onClick={() => handleDeleteCategory(category._id)}
                        title="Delete Category"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="modal-box bg-amber-900 p-3 rounded max-w-2xl w-full mx-4">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">

            <h3 className="text-2xl  text-[#612121] text-center font-bold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>
            <input
  type="text"
  value={newCategory}
  onChange={(e) => setNewCategory(e.target.value)} 
  placeholder="Category Title"
  className="input input-bordered w-full mb-4 border-blue-900 focus:border-amber-900 focus:ring focus:ring-amber-900 focus:ring-opacity-60"
/>

            <div className="flex justify-center gap-2  mt-6">
            <button
                onClick={() => setShowModal(false)}
                className="btn  border-amber-900 bg-transparent  hover:bg-amber-700  text-blue-950 font-bold py-2 px-2 rounded-lg w-20"
                >
                Cancel
              </button>
          
              <button
                onClick={handleAddOrUpdateCategory}
                className="btn bg-amber-900 hover:bg-amber-700  w-20  text-white font-bold py-2 px-2 rounded-lg"
              >
                {editingCategory ? "Update " : "Add "}
              </button>
         
            </div>


            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default ManageCategories;
