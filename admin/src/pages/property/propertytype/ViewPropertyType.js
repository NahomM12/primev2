import React from "react";

const ViewPropertyType = ({ setIsView, selectedProperty }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Property Details</h2>
      <div className="mb-4">
        <strong>ID:</strong> {selectedProperty?.id}
      </div>
      <div className="mb-4">
        <strong>Name:</strong> {selectedProperty?.name}
      </div>
      <h3 className="text-md font-semibold mt-4 mb-2">Fields</h3>
      {selectedProperty?.fields?.length > 0 ? (
        <ul className="list-disc pl-5">
          {selectedProperty.fields.map((field) => (
            <li key={field.id} className="mb-2">
              <div>
                <strong>Field Name:</strong> {field.name}
              </div>
              <div>
                <strong>Field Type:</strong> {field.type}
              </div>
              {/* <div>
                <strong>Created At:</strong>{" "}
                {new Date(field.created_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {new Date(field.updated_at).toLocaleDateString()}
              </div> */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No fields available for this property type.</p>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsView(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewPropertyType;
