// src/components/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/api';

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
    <div className="container mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="table-auto w-full bg-white shadow-md rounded mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            {/* <th className="px-4 py-2">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user._id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
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
