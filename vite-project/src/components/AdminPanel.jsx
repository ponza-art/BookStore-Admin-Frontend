import React, { useEffect, useState } from "react";
import { FaBook, FaUsers, FaChartLine, FaPencilAlt, FaDollarSign } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { FaMoneyBillWave } from "react-icons/fa";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getStats, getorders } from "../services/api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartError, setChartError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchOrdersData = async () => {
      try {
        const orders = await getorders();

        const groupedOrders = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += order.totalAmount;
          return acc;
        }, {});

        const labels = Object.keys(groupedOrders);
        const data = Object.values(groupedOrders);
        const total = data.reduce((sum, amount) => sum + amount, 0);

        setTotalRevenue(total);

        setChartData({
          labels,
          datasets: [
            {
              label: "Orders",
              data,
              backgroundColor: "rgba(0, 128, 255, 0.7)",
              borderColor: "rgba(0, 128, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error(err);
        setChartError("Failed to load order data.");
      }
    };

    fetchData();
    fetchOrdersData();
  }, []);

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A");

  if (loading) {
    return (
      <div className="flex justify-center items-center">
      <span
        className="loading loading-bars loading-lg text-blue-800"
        style={{ width: "20%", margin: "30vh 30vw" }}
      ></span>
    </div>
    )
    
  }

  if (error) {
    return <p>{error}</p>;
  }

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Order Totals",
        font: { size: 16, weight: "bold" },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Order Total: $${context.raw}`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true, max: Math.max(...(chartData?.datasets[0].data || [100])) + 10 },
    },
  };

  const statistics = [
    {
      icon: FaBook,
      label: "Total Books",
      value: stats.books.count,
    },
    {
      icon: FaPencilAlt,
      label: "Total Authors",
      value: stats.authors.count,
    },
    {
      icon: BiCategoryAlt,
      label: "Total Categories",
      value: stats.categories.count,
    },
    {
      icon: FaUsers,
      label: "Total Users",
      value: stats.users.count,
    },
    {
      icon: MdRateReview,
      label: "Total Reviews",
      value: stats.reviews.count,
    },
    {
      icon: FaChartLine,
      label: "Last Uploaded Book",
      value: stats.books.latest?.title,
      options: `Date: ${formatDate(stats.books.latest?.createdAt)}`,
    },
    {
      icon: FaChartLine,
      label: "Last Uploaded Category",
      value: stats.categories.latest?.title,
      options: `Date: ${formatDate(stats.categories.latest?.createdAt)}`,
    },
    {
      icon: FaChartLine,
      label: "Last Uploaded Author",
      value: stats.authors.latest?.name,
      options: `Date: ${formatDate(stats.authors.latest?.createdAt)}`,
    },
  ];

  return (
    <div className="p-4 my-5 text-center">
      <h1 className="text-3xl text-blue-950 font-bold mb-12">Admin Dashboard</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 w-full mx-auto gap-4">
        <div className="w-full md:w-2/3 h-[300px] md:h-[384.6px] p-4 bg-white rounded-lg shadow">
          {chartData ? <Bar data={chartData} options={options} /> : <p>{chartError || "Loading orders data..."}</p>}
        </div>
        <div className="w-full md:w-1/3 h-[150px] md:h-96 flex items-center justify-center p-4 bg-white rounded-lg shadow text-center">
          <div>
          <FaMoneyBillWave className="text-6xl text-blue-900 mb-2 mx-auto" />
            <h2 className="text-xl  font-semibold text-gray-500">Total Revenue</h2>
            <p className="text-3xl font-bold text-blue-950">EGP {totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statistics.map((stat, index) => (
          <div
            key={index}
            className="py-8 flex flex-col items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <stat.icon className="text-3xl text-blue-950 mb-2" />
            <h2 className="text-lg font-semibold text-gray-500">{stat.label}</h2>
            <p className="text-2xl font-bold text-blue-950">{stat.value}</p>
            {stat.options && <p className="text-xl font-semibold text-cyan-700">{stat.options}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
