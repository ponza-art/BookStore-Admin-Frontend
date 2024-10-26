/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enable, setEnable] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewCategory("");
    setEditingCategory(null);
  };

  const handleAddOrUpdateCategory = async () => {
    setEnable(false);
    if (!newCategory) {
      toast.error("Category title cannot be empty");
      setEnable(true);
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
      setEnable(true);
      resetForm();
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(`Failed to ${editingCategory ? "update" : "add"} category`);
      setEnable(true);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.title);
    setShowModal(true);
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b90303",
      cancelButtonColor: "#e2e8f0 ",
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.borderRadius = "12px";
          const cancelButton = popup.querySelector(".swal2-cancel");
          if (cancelButton) cancelButton.style.color = "black";
        }
      },
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await deleteCategory(id);
        fetchCategories();
        setLoading(false);
        Swal.fire("Deleted!", "Category deleted successfully.", "success", {
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.borderRadius = "12px";
            }
          },
        });
        // toast.success("Category deleted successfully!");
      } catch (error) {
        setLoading(false);
        Swal.fire("Error!", "Failed to delete category.", "error", {
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
              popup.style.borderRadius = "12px";
            }
          },
        });
        // toast.error("Failed to delete category");
      }
    }
  };

  if (loading)
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
            Manage Categories
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-transparent text-xl w-fit self-end text-end hover:underline font-semibold px-3 pt-3 pb-5"
          >
            Add Category
          </button>
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full text-center rounded-lg mb-3">
          <thead>
            <tr className="rounded-sm bg-[#f7f9fc] tab-border-2 text-sm">
              <th className="px-4 py-2 text-start">ID</th>
              <th className="px-4 py-2 text-start">Category Title</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 text-start">{index + 1}</td>
                  <td className="px-4 py-2 text-start">{category.title}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3 justify-center">
                      <button
                        className="text-blue-800 duration-500 ml-2 hover:text-black p-2"
                        onClick={() => handleEditCategory(category)}
                        title="Edit Category"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className="text-blue-800 duration-500 ml-2 hover:text-black"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-30">
          <div className="p-3 rounded-xl max-w-2xl w-full mx-4">
            <div className="bg-white rounded-xl p-8 max-w-4xl w-full">
              <h3 className="text-2xl text-center font-bold mb-4">
                Add Category
              </h3>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category Title"
                className="input input-bordered w-full my-4 border-blue-900 focus:ring"
              />

              <div className="flex justify-center gap-2 mt-6">
                <button
                  disabled={!enable}
                  onClick={() => {
                    setShowModal(false);
                    setNewCategory("");
                  }}
                  className="btn bg-slate-200 font-bold py-2 px-2 rounded-lg w-28"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddOrUpdateCategory}
                  disabled={!enable}
                  className="btn bg-blue-800 hover:bg-blue-950 text-white font-bold py-2 w-28 px-2 rounded-lg"
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

export default ManageCategories;
