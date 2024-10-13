import React from 'react';
import { IoIosClose } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

const NotificationDrawer = ({ isOpen, toggleDrawer, messages, handleDelete }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
      <div className="flex justify-between items-center p-4 bg-base-300">
        <h2 className="text-lg font-bold">Notifications</h2>
        <button className="btn btn-circle btn-ghost" onClick={toggleDrawer}>
          <IoIosClose className="text-2xl" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-full">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="border-b py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">{message.name}</h3>
                <p className="text-sm">{message.email}</p>
                <p className="mt-2">{message.message}</p>
              </div>
              <button
                className="btn btn-square btn-error btn-sm"
                onClick={() => handleDelete(message._id)}
              >
                <FaTrash />
              </button>
            </div>
          ))
        ) : (
          <p>No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;
