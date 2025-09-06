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
    width: "50%",
    maxHeight: "90vh",
    overflow: "auto",
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

  // ✅ Active search + filter logic
  const filteredProperties = properties?.filter((property) => {
    const nameMatch = property?.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const locationMatch =
      property?.address?.subregion?.subregion_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      property?.address?.location?.location
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "available" && property.status) ||
      (filterStatus === "unavailable" && !property.status);

    return (nameMatch || locationMatch) && statusMatch;
  });

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Property Management</h1>

      <div className="flex mb-4 space-x-4">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="px-4 py-2">Id</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Price ($)</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties?.length > 0 ? (
            filteredProperties.map((property, index) => (
              <tr key={property._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{property.title}</td>
                <td className="px-4 py-2">
                  {property?.address?.subregion?.subregion_name}{" "}
                  {property?.address?.location?.location}
                </td>
                <td className="px-4 py-2">${property.price}</td>
                <td className="px-4 py-2">
                  {property.status ? (
                    <span className="text-green-500">Available</span>
                  ) : (
                    <span className="text-red-500">Unavailable</span>
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleView(property)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(property)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(property)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center text-gray-500 py-4"
              >
                No properties found
              </td>
            </tr>
          )}
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
