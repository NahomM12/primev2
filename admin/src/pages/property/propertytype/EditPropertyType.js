import React, { useState } from "react";
import { useDispatch } from "react-redux";

const EditPropertyType = ({
  setIsEdit,
  selectedPropertyType,
  updateProperty,
}) => {
  const dispatch = useDispatch();
  // Use selectedPropertyType to initialize state
  const [propertyTypeDetails, setPropertyTypeDetails] = useState({
    name: selectedPropertyType?.name || "",
    fields: selectedPropertyType?.fields || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyTypeDetails({ ...propertyTypeDetails, [name]: value });
  };

  const handleFieldChange = (index, fieldName, value) => {
    const updatedFields = propertyTypeDetails.fields.map((field, i) =>
      i === index ? { ...field, [fieldName]: value } : field
    );
    setPropertyTypeDetails({ ...propertyTypeDetails, fields: updatedFields });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call parent function to update the property type in mock state
    dispatch(updateProperty(selectedPropertyType._id, propertyTypeDetails))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    setIsEdit(false);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Property Type</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={propertyTypeDetails.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Fields:</h3>
          {propertyTypeDetails.fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <div>
                <label className="block text-sm font-medium">Field Name:</label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium"
                  onClick={() => console.log(field.type)}
                >
                  Field Type:
                </label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    handleFieldChange(index, "type", e.target.value)
                  }
                  className="border p-2 w-full rounded"
                  required
                >
                  <option value="Number">Number</option>
                  <option value="Boolean">Boolean</option>
                  <option value="String">String</option>
                  <option value="Date">Date</option>
                  <option value="">Select</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEdit(false)}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyType;
