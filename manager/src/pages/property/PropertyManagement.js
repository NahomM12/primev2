import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { FiTrendingUp, FiBarChart2, FiHome } from "react-icons/fi";
import { getPropertiesbyRegion } from "../../store/property/propertySlice";
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
    width: "50%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

const PropertyManagement = () => {
  const dispatch = useDispatch();
  const { properties, totalProperties, totalSales, totalRents } = useSelector(
    (state) => state.property
  );

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(getPropertiesbyRegion());
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

  // **Filtering Logic**
  // const filteredProperties = getPropertiesreg? getPropertiesreg.filter((property) => {
  //       return (
  //         (property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           property.price?.toString().includes(searchTerm)) &&
  //         (statusFilter === "" || property.status === statusFilter)
  //       );
  //     }): [];

  return (
    <div className="pt-10">
      {/* Property Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 font-bold">Total Properties</h2>
          <div className="flex items-center mt-2">
            <FiHome className="text-blue-500 text-4xl" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">
                {totalProperties}
              </p>
              <p className="text-sm text-gray-500">
                431 more to break last month's record
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2
            className="text-gray-600 font-bold"
            onClick={() => console.log(properties)}
          >
            Properties for Sale
          </h2>
          <p className="text-2xl font-bold text-gray-800">{totalSales}</p>
          {/* <p className="text-sm text-gray-500">Target: 3k/month</p> */}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 font-bold">Properties for Rent</h2>
          <p className="text-2xl font-bold text-gray-800">{totalRents}</p>
          {/* <p className="text-sm text-gray-500">Target: 3k/month</p> */}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <input
          type="text"
          placeholder="Search by name, location, or price..."
          className="p-2 border border-gray-300 rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Properties Table */}
      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">property_use</th>
            <th className="border px-4 py-2">Price ($)</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties?.map((property) => (
            <tr key={property.id}>
              <td className="border px-4 py-2">{property.id}</td>
              <td className="border px-4 py-2">{property.title}</td>
              <td className="border px-4 py-2">{property.property_use}</td>
              <td className="border px-4 py-2">{property.price}</td>
              <td className="border px-4 py-2">
                {property.status === "available" ? (
                  <span className="text-green-500">Available</span>
                ) : property.status === "unavailable" ? (
                  <span className="text-blue-500">Unavailable</span>
                ) : property.status === "rejected" ? (
                  <span className="text-red-500">Rejected</span>
                ) : (
                  <span className="text-blue-500">pending</span>
                )}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleView(property)}
                  className="text-gray-500 hover:underline mr-2"
                >
                  <FiEye size={16} />
                </button>
                <button
                  onClick={() => handleEdit(property)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(property)}
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
      >
        <ViewProperty
          setIsView={setIsView}
          selectedProperty={selectedProperty}
        />
      </Modal>

      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
      >
        <EditProperty
          setIsEdit={setIsEdit}
          selectedProperty={selectedProperty}
        />
      </Modal>

      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
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
