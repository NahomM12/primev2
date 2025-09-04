import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsersbyRegion,
  deleteUser,
  editUser,
} from "../../store/user/userSlice";
import EditUser from "./EditUser";
import ViewUser from "./ViewUser";
import DeleteUser from "./DeleteUser";
import Modal from "react-modal";
import { FiTrendingUp, FiBarChart2, FiHome } from "react-icons/fi";

Modal.setAppElement("#root");

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

// const users = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "7oI6l@example.com",
//     phone: "1234567890",
//     blocked: true,
//     created_at: "2022-01-01T00:00:00.000Z",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "jane@example.com",
//     phone: "0987654321",
//     blocked: false,
//     created_at: "2022-02-01T00:00:00.000Z",
//   },
//   // Add more users as needed
// ];

const UserManagement = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsersbyRegion());
  }, []);
  const { users, totalUsers, activeUsers, blockedUsers } = useSelector(
    (state) => state.user
  );

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'blocked'

  // Filtered users based on search and status
  // const filteredUsers = users.filter((user) => {
  //   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesStatus = statusFilter === "all" ||
  //                         (statusFilter === "active" && !user.status) ||
  //                         (statusFilter === "blocked" && user.status);
  //   return matchesSearch && matchesStatus;
  // });

  const handleView = (user) => {
    setSelectedUser(user);
    setIsView(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDelete(true);
  };

  const mockData = {
    totalUsers: {
      count: 4562,
      message: "431 more to break last month's record",
    },
    activeUsers: {
      count: 2356,
      today: "3k",
      week: "3k",
      month: "3k",
      target: "3k/month",
    },
    blockedUsers: {
      count: 2206,
      today: "3k",
      target: "3k/month",
    },
  };

  return (
    <div className="p-10">
      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 font-bold">Total Users</h2>
          <div className="flex items-center mt-2">
            <FiHome className="text-blue-500 text-4xl" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">
                {/* {mockData.totalUsers.count.toLocaleString()} */}
                {totalUsers}
              </p>
              <p className="text-sm text-gray-500">
                {/* {mockData.totalUsers.message} */}
              </p>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 font-bold">Active Users</h2>
          <div className="mt-2">
            <p className="text-2xl font-bold text-gray-800">
              {/* {mockData.activeUsers.count.toLocaleString()} */}
              {activeUsers}
            </p>
            <p className="text-sm text-gray-500">
              {/* Target: {mockData.activeUsers.target} */}
            </p>
          </div>
        </div>

        {/* Blocked Users Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 font-bold">Blocked Users</h2>
          <div className="mt-2">
            <p className="text-2xl font-bold text-gray-800">
              {blockedUsers}
              {/* {mockData.blockedUsers.count.toLocaleString()} */}
            </p>
            <p className="text-sm text-gray-500">
              {/* Target: {mockData.blockedUsers.target} */}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="blocked">Blocked Users</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="mt-8 overflow-x-auto shadow-lg border border-gray-200 rounded-lg">
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-6 py-4 text-sm font-medium text-gray-600">
                ID
              </th>
              <th className="border px-6 py-4 text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="border px-6 py-4 text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="border px-6 py-4 text-sm font-medium text-gray-600">
                Phone
              </th>
              <th className="border px-6 py-4 text-sm font-medium text-gray-600">
                Blocked
              </th>
              <th className="border px-6 py-4 text-sm font-medium text-gray-600">
                Created
              </th>
              <th className="border px-6 py-4 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="border px-6 py-4 text-sm text-gray-700">
                  {user.id}
                </td>
                <td className="border px-6 py-4 text-sm text-gray-700">
                  {user.name}
                </td>
                <td className="border px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="border px-6 py-4 text-sm text-gray-700">
                  {user.phone}
                </td>
                <td
                  className={`border px-6 py-4 text-sm ${
                    user.status ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {user.status ? "Active" : "Blocked"}
                </td>
                <td className="border px-6 py-4 text-sm text-gray-700">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="border px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => handleView(user)}
                    className="text-gray-500 hover:text-blue-600 mr-3"
                  >
                    <FiEye size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View User"
      >
        <ViewUser setIsView={setIsView} selectedUser={selectedUser} />
      </Modal>

      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit User"
      >
        <EditUser setIsEdit={setIsEdit} selectedUser={selectedUser} />
      </Modal>

      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete User"
      >
        <DeleteUser setIsDelete={setIsDelete} selectedUser={selectedUser} />
      </Modal>
    </div>
  );
};

export default UserManagement;
