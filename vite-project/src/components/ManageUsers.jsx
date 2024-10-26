/* eslint-disable no-unused-vars */
// src/components/ManageUsers.jsx
import React, { useState, useEffect } from "react";
import { getUsers, deleteUser, userStatus } from "../services/api";
import { CgBlock, CgUnblock } from "react-icons/cg";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [enable, setEnable] = useState(true);
  const [loading, setLoading] = useState(true);

  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Customize items per page

  useEffect(() => {
    getUsers()
      .then((data) => {
        if (data && data.data && data.data.Users) {
          setUsers(data.data.Users);
          setFilteredUsers(data.data.Users);
        } else {
          setError("No users found in the response.");
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter users based on search query
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [users, searchQuery]);

  const handleStatus = (id, newStatus) => {
    setEnable(false);
    userStatus(id, newStatus)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
        toast.success(
          `User status updated to ${newStatus ? "active" : "blocked"}`
        );
      })
      .catch(() => toast.error("Failed to update user status"))
      .finally(() => setEnable(true));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id)
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
          alert("User deleted successfully!");
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
          alert("Failed to delete user");
        });
    }
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  if (error) return <div>Error: {error}</div>;

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
      <h2 className="text-3xl lg:self-start text-center sm:text-left font-bold mb-6">
        Manage Users
      </h2>
      
      {/* Search Input */}
      <div className="my-4 w-full">
        <input
          type="text"
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full"
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table w-full text-center rounded-lg mb-3">
          <thead>
            <tr className="rounded-sm bg-[#f7f9fc] tab-border-2 text-sm">
              <th className="px-4 py-2 text-start">ID</th>
              <th className="px-4 py-2 text-start">Username</th>
              <th className="px-4 py-2 text-start">Email</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 text-start">{user._id}</td>
                  <td className="px-4 py-2 text-start">{user.username}</td>
                  <td className="px-4 py-2 text-start">{user.email}</td>
                  <td className="px-4 py-2">
                    <button
                      disabled={!enable}
                      className={`btn border text-white ${
                        user.status
                          ? "bg-blue-800 hover:bg-blue-950"
                          : "bg-red-700 hover:bg-red-900"
                      } mr-2`}
                      onClick={() => handleStatus(user._id, !user.status)}
                    >
                      {user.status ? <CgUnblock size={24} /> : <CgBlock size={24} />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No users found
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
    </div>
  );
};

export default ManageUsers;
