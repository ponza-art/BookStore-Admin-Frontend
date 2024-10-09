// src/components/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser,userStatus  } from '../services/api';

import { toast } from'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    getUsers()
      .then((data) => {
        console.log("API Response:", data); // Check if users are in data.Users
        if (data && data.data && data.data.Users) { // Adjust to access data.Users
          setUsers(data.data.Users); // Set users from the correct path
        } else {
          setError("No users found in the response.");
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      });
  }, []);


  const handleStatus = (id, newStatus) => {
    userStatus(id, newStatus)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
        toast.success(`User status updated to ${newStatus ? 'active' : 'blocked'}`);
      })
      .catch((err) => {
        toast.error('Failed to update user status');
      });
  };
  




  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id).then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        alert('User deleted successfully!');
      }).catch((err) => {
        console.error("Error deleting user:", err);
        alert('Failed to delete user');
      });
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto my-8 p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
      <h2 className="text-3xl text-amber-900  font-bold mb-12">Manage Users</h2>
      <table className="table-auto tab-border-3 w-full text-center shadow-md rounded-lg mb-8 ">
        <thead>
          <tr className="bg-[#e2d6d6] tab-border-2  text-sm">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Status</th>
       
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2 border">{user._id}</td>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">
                  <button
                    className={`btn border   ${user.status ? 'text-rose-900 ' : 'btn-primary'} mr-2`}
                    onClick={() => handleStatus(user._id, !user.status)}
                  >
                    {user.status ? 'Block' : 'active'}
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
              <td colSpan="4" className="text-center py-4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
