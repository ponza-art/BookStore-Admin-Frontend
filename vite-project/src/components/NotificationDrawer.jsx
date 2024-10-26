/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { IoIosClose } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

const NotificationDrawer = ({
  isOpen,
  toggleDrawer,
  messages,
  handleDelete,
}) => {
  return (
    <div
      className={`z-30 fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300`}
    >
      <div className="flex justify-between items-center p-4 border-b-2">
        <h2 className="text-lg font-bold">Notifications</h2>
        <button className="btn btn-circle btn-ghost" onClick={toggleDrawer}>
          <IoIosClose className="text-2xl" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-full">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className="border-b py-4 flex justify-between items-center"
            >
              <div className="w-full px-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{message.name}</h3>

                  <button
                    className="text-blue-800 hover:text-black duration-500"
                    onClick={() => handleDelete(message._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="text-sm mt-2">{message.email}</p>
                <p className="mt-2">{message.message}</p>
              </div>
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
