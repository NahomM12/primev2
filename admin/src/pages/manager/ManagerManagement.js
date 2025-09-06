import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getAllManagers } from "../../store/manager/managerSlice";
import EditManager from "./EditManager";
import ViewManager from "./ViewManager";
import DeleteManager from "./DeleteManager";
import AddManager from "./AddManager";
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

const ManagerManagement = () => {
  const dispatch = useDispatch();
  const { managers } = useSelector((state) => state.manager);

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Search + Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    dispatch(getAllManagers());
  }, [dispatch]);

  // ✅ Integrated filtering (works same as dummy data test)
  const filteredManagers = managers?.filter((user) => {
    const createdDate = new Date(user.createdAt || user.created_at)
      .toISOString()
      .split("T")[0];

    return (
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)) &&
      (filterDate ? createdDate === filterDate : true)
    );
  });

  return (
    <div className="p-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Managers Management</h1>
        <button
          className="border p-2 rounded bg-blue-500 text-white"
          onClick={() => setIsAdd(true)}
        >
          Add Manager
        </button>
      </div>

      {/* ✅ Search + Date filter */}
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

      <table className="table-auto w-full border-collapse border border-gray-300">
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
          {filteredManagers?.map((user, index) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user?.name}</td>
              <td className="border px-4 py-2">{user?.email}</td>
              <td className="border px-4 py-2">{user?.phone}</td>
              <td className="border px-4 py-2">
                {new Date(user.createdAt || user.created_at).toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsView(true);
                  }}
                  className="text-gray-500 hover:underline mr-2"
                >
                  <FiEye size={16} />
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEdit(true);
                  }}
                  className="text-blue-500 hover:underline mr-2"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDelete(true);
                  }}
                  className="text-red-500 hover:underline"
                >
                  <FiTrash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View Manager"
      >
        <ViewManager setIsView={setIsView} selectedUser={selectedUser} />
      </Modal>

      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Manager"
      >
        <EditManager setIsEdit={setIsEdit} selectedUser={selectedUser} />
      </Modal>

      <Modal
        isOpen={isAdd}
        onRequestClose={() => setIsAdd(false)}
        style={customModalStyles}
        contentLabel="Add Manager"
      >
        <AddManager setIsAdd={setIsAdd} />
      </Modal>

      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Manager"
      >
        <DeleteManager setIsDelete={setIsDelete} selectedUser={selectedUser} />
      </Modal>
    </div>
  );
};

export default ManagerManagement;
