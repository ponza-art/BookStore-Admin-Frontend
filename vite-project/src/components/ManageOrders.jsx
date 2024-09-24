import React, { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import toast, { Toaster } from 'react-hot-toast';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            toast.error("Failed to fetch orders");
        }
    };

    return (
        <div className="container mx-auto my-8 p-4">
            <Toaster />
            <h2 className="text-3xl font-bold mb-4">Manage Orders</h2>
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Book</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>{order.user}</td>
                            <td>{order.book}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOrders;
