import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FiTrendingUp, FiBarChart2, FiHome } from "react-icons/fi";

const Dashboard = () => {
  const mockData = {
    totalProperties: {
      count: 4562,
      message: "431 more to break last month's record",
    },
    totalUsers: {
      count: 2356,
      target: "3k/month",
    },
    totalEarnings: {
      count: 2206,
      target: "3k/month",
    },
    propertyTypes: {
      total: 22870,
      villa: 1100,
      car: 2300,
      hall: 1500,
      apartment: 1200,
      land: 1300,
    },
    totalOverview: [
      { month: "Jan", value: 100 },
      { month: "Feb", value: 200 },
      { month: "Mar", value: 300 },
      { month: "Apr", value: 500 },
      { month: "May", value: 400 },
      { month: "Jun", value: 700 },
      { month: "Jul", value: 900 },
      { month: "Aug", value: 800 },
      { month: "Sep", value: 600 },
      { month: "Oct", value: 750 },
      { month: "Nov", value: 850 },
      { month: "Dec", value: 1000 },
    ],
    totalRevenue: {
      onlineSales: [100, 200, 300, 400, 500, 600],
      offlineSales: [50, 150, 250, 350, 450, 550],
    },
    newList: [
      {
        address: "19 Abernethy Street, Woetangera",
        price: "$2500.00",
        auctionDate: "Saturday 15 April",
        rooms: 5,
        image: "https://via.placeholder.com/150",
      },
    ],
  };

  const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28", "#A28CD4"];

  return (
    <div className="p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Properties */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-gray-600 dark:text-gray-200 font-bold">Total Properties</h2>
          <div className="flex items-center mt-2">
            <FiHome className="text-blue-500 dark:text-blue-300 text-4xl" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {mockData.totalProperties.count.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mockData.totalProperties.message}
              </p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-gray-600 dark:text-gray-200 font-bold">Total Users</h2>
          <div className="mt-2">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              ${mockData.totalUsers.count.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Target: {mockData.totalUsers.target}
            </p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-gray-600 dark:text-gray-200 font-bold">Total Earnings</h2>
          <div className="mt-2">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              ${mockData.totalEarnings.count.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Target: {mockData.totalEarnings.target}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Total Overview Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-gray-600 dark:text-gray-200 font-bold mb-4">Total Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockData.totalOverview}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-gray-600 dark:text-gray-200 font-bold mb-4">Property Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Villa", value: mockData.propertyTypes.villa },
                  { name: "Car", value: mockData.propertyTypes.car },
                  { name: "Apartment", value: mockData.propertyTypes.apartment },
                  { name: "Hall", value: mockData.propertyTypes.hall },
                  { name: "Land", value: mockData.propertyTypes.land },
                ]}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
        <h2 className="text-gray-600 dark:text-gray-200 font-bold mb-4">Total Revenue</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={mockData.totalRevenue.onlineSales.map((val, index) => ({
              name: `Month ${index + 1}`,
              online: val,
              offline: mockData.totalRevenue.offlineSales[index],
            }))}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="online" fill="#00C49F" />
            <Bar dataKey="offline" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
        <h2 className="text-gray-600 dark:text-gray-200 font-bold mb-4">New List</h2>
        <div className="flex">
          <img
            src={mockData.newList[0].image}
            alt="Property"
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="ml-4">
            <h3 className="text-gray-800 dark:text-gray-100 font-bold">
              {mockData.newList[0].address}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Auction: {mockData.newList[0].auctionDate}
            </p>
            <p className="text-gray-600 dark:text-gray-200 font-bold">
              {mockData.newList[0].price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
