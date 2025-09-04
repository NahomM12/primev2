import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/user/userSlice";
import EditUser from "./EditUser";
import ViewUser from "./ViewUser";
import DeleteUser from "./DeleteUser";
import Modal from "react-modal";

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

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

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

  const filteredUsers = users?.filter((user) => {
    return (
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)) &&
      (filterDate
        ? new Date(user.created_at).toISOString().split("T")[0] === filterDate
        : true)
    );
  });

  return (
    <div className="p-20">
      <h1>User Management</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Created</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user?.id}</td>
              <td className="border px-4 py-2">{user?.name}</td>
              <td className="border px-4 py-2">{user?.email}</td>
              <td className="border px-4 py-2">{user?.phone}</td>
              <td className="border px-4 py-2">
                {new Date(user.createdAt).toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleView(user)}
                  className="text-gray-500 hover:underline mr-2"
                >
                  <FiEye size={16} />
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="text-red-500 hover:underline"
                >
                  <FiTrash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View User Modal */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View User"
      >
        <ViewUser setIsView={setIsView} selectedUser={selectedUser} />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit User"
      >
        <EditUser setIsEdit={setIsEdit} selectedUser={selectedUser} />
      </Modal>

      {/* Delete User Modal */}
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
