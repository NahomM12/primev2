import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { getAllProperties } from "../../../store/property/propertySlice";
import ViewProperty from "./ViewProperty";
import EditProperty from "./EditProperty";
import DeleteProperty from "./DeleteProperty";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflow: "auto",
    borderRadius: "12px",
    padding: "2rem",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
};

const PropertyManagement = () => {
  const dispatch = useDispatch();
  const { properties } = useSelector((state) => state.property);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

  const handleView = (property) => {
    setSelectedProperty(property);
    setIsView(true);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsEdit(true);
  };

  const handleDelete = (property) => {
    setSelectedProperty(property);
    setIsDelete(true);
  };

  const filteredProperties = properties?.filter((property) => {
    return (
      (property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.subregion.subregion_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        property.address.location.location
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" ||
        (filterStatus === "available" && property.status) ||
        (filterStatus === "unavailable" && !property.status))
    );
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Property Management</h1>
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Price ($)</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties?.map((property) => (
            <tr
              key={property._id}
              className="border-b hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              <td className="px-4 py-3">{property.id}</td>
              <td className="px-4 py-3">{property.title}</td>
              <td className="px-4 py-3">
                {property?.address?.subregion?.subregion_name}{" "}
                {property?.address?.location?.location}
              </td>
              <td className="px-4 py-3">${property.price}</td>
              <td className="px-4 py-3">
                {property.status ? (
                  <span className="text-green-500 font-medium">Available</span>
                ) : (
                  <span className="text-red-500 font-medium">Unavailable</span>
                )}
              </td>
              <td className="px-4 py-3 flex items-center space-x-2">
                <button
                  onClick={() => handleView(property)}
                  className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
                >
                  <FiEye size={18} />
                </button>
                <button
                  onClick={() => handleEdit(property)}
                  className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(property)}
                  className="text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                >
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* View Property Modal */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View Property"
      >
        <ViewProperty
          setIsView={setIsView}
          selectedProperty={selectedProperty}
        />
      </Modal>
      {/* Edit Property Modal */}
      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Property"
      >
        <EditProperty
          setIsEdit={setIsEdit}
          selectedProperty={selectedProperty}
        />
      </Modal>
      {/* Delete Property Modal */}
      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Property"
      >
        <DeleteProperty
          setIsDelete={setIsDelete}
          selectedProperty={selectedProperty}
        />
      </Modal>
    </div>
  );
};

export default PropertyManagement;