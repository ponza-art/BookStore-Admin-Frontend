/* eslint-disable no-unused-vars */
// src/components/ManageUsers.jsx
import React, { useState, useEffect } from "react";
import { getUsers, deleteUser, userStatus } from "../services/api";
import { CgBlock, CgUnblock } from "react-icons/cg";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [enable, setEnable] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((data) => {
        if (data && data.data && data.data.Users) {
          setUsers(data.data.Users);
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

  const handleStatus = (id, newStatus) => {
    setEnable(false);
    userStatus(id, newStatus)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
        setEnable(true);
        toast.success(
          `User status updated to ${newStatus ? "active" : "blocked"}`
        );
      })
      .catch((err) => {
        setEnable(true);
        toast.error("Failed to update user status");
      })
      .finally(() => {
        setEnable(true);
      });
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <span
          className="loading loading-bars loading-lg text-blue-800"
          style={{ width: "20%", margin: "30vh 30vw" }}
        ></span>
      </div>
    );
  }

  return (
    <div className="py-6 mt-16 lg:mt-11 bg-base-100 text-neutral font-sans p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
      <h2 className="text-3xl lg:self-start text-center sm:text-left font-bold mb-6">
        Manage Users
      </h2>
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
            {users.length > 0 ? (
              users.map((user) => (
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
                      {user.status ? (
                        <CgUnblock size={24} />
                      ) : (
                        <CgBlock size={24} />
                      )}
                    </button>
                  </td>

                  {/* <td className="px-4 py-2">
                  <button className="btn btn-primary mr-2">Edit</button>
                  <button className="btn btn-error" onClick={() => handleDelete(user._id)}>Delete</button>
                </td> */}
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
    </div>
  );
};

export default ManageUsers;
