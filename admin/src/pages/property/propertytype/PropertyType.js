import React, { useState, useEffect } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { getAllPropertytypes } from "../../../store/PropertyType/propertytypeSlice";
import ViewPropertyType from "./ViewPropertyType";
import EditPropertyType from "./EditPropertyType";
import DeletePropertyType from "./DeletePropertyType";
import AddPropertyType from "./AddPropertyType";

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

const PropertyType = () => {
  const dispatch = useDispatch();
  const { propertyTypes } = useSelector((state) => state.propertyType);

  const [localPropertyTypes, setLocalPropertyTypes] = useState([]);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Load property types into local state for editing
  useEffect(() => {
    dispatch(getAllPropertytypes());
    if (propertyTypes) setLocalPropertyTypes(propertyTypes);
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

  const handleAdd = () => {
    setIsAdd(true);
  };

  // Function to update a property type in local state
  const updateProperty = (id, updatedData) => {
    const updatedArray = localPropertyTypes.map((property) =>
      property._id === id ? { ...property, ...updatedData } : property
    );
    setLocalPropertyTypes(updatedArray);
  };

  return (
    <div>
      <h1>Property Type</h1>
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Add New Property
      </button>

      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Id</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Created</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localPropertyTypes?.map((property) => (
            <tr key={property._id}>
              <td className="border px-4 py-2">{property.id}</td>
              <td className="border px-4 py-2">{property.name}</td>
              <td className="border px-4 py-2">
                {new Date(property.createdAt).toLocaleString()}
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

      {/* View Property Modal */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View Type"
      >
        <ViewPropertyType
          setIsView={setIsView}
          selectedProperty={selectedProperty}
        />
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Type"
      >
        {selectedProperty && (
          <EditPropertyType
            setIsEdit={setIsEdit}
            selectedPropertyType={selectedProperty}
            updateProperty={updateProperty} // Pass the update function
          />
        )}
      </Modal>

      {/* Delete Property Modal */}
      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Type"
      >
        <DeletePropertyType
          setIsDelete={setIsDelete}
          selectedProperty={selectedProperty}
        />
      </Modal>

      {/* Add Property Modal */}
      <Modal
        isOpen={isAdd}
        onRequestClose={() => setIsAdd(false)}
        style={customModalStyles}
        contentLabel="Add Property"
      >
        <AddPropertyType setIsAdd={setIsAdd} />
      </Modal>
    </div>
  );
};

export default PropertyType;
