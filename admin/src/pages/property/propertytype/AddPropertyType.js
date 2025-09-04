import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPropertytype } from "../../../store/PropertyType/propertytypeSlice";
import toast from "react-hot-toast";

const AddPropertyType = ({ setIsAdd }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  // Dynamic array of fields
  const [fields, setFields] = useState([
    { name: "", type: "", required: false },
  ]);

  const handleFieldChange = (e, index) => {
    const newFields = [...fields];
    newFields[index][e.target.name] = e.target.value;
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, { name: "", type: "", required: false }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure all fields are filled before submitting
    if (
      fields.some(
        (field) => !field.name || !field.type || field.required === ""
      )
    ) {
      toast.error("All fields are required!");
      return;
    }
    const data = { name, fields };
    console.log(data);
    dispatch(addPropertytype(data));
    //   .unwrap()
    //   .then(() => {
    //     toast.success("Property added successfully!");
    //     setIsAdd(false);
    //   })
    //   .catch((err) => {
    //     toast.error(err);
    //   });
  };

  return (
    <div className="pt-100">
      <h2 className="text-xl font-bold mb-4">Add New Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Property Type Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        {fields.map((field, index) => (
          <div key={index}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Field Name
              </label>
              <input
                type="text"
                name="name"
                value={field.name}
                onChange={(e) => handleFieldChange(e, index)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Field Type
              </label>
              <select
                name="type"
                value={field.type}
                onChange={(e) => handleFieldChange(e, index)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              >
                <option value="">Select Type</option>
                <option value="String">String</option>
                <option value="Number">Number</option>
                <option value="Boolean">Boolean</option>
                <option value="Date">Date</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Field Required
              </label>
              <select
                name="required"
                value={field.required}
                onChange={(e) => handleFieldChange(e, index)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              >
                <option value="">Select</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddField}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        >
          Add Another Field
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Property
        </button>
        <button
          type="button"
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => setIsAdd(false)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddPropertyType;
