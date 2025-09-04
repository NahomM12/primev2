import React from "react";

const ViewProperty = ({ setIsView, selectedProperty }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">View Property Details</h2>
      {selectedProperty ? (
        <div>
          <p>
            <strong>ID:</strong> {selectedProperty.id}
          </p>
          <p>
            <strong>Name:</strong> {selectedProperty.name}
          </p>
          <p>
            <strong>Location:</strong> {selectedProperty.location}
          </p>
          <p>
            <strong>Price:</strong> ${selectedProperty.price}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {selectedProperty.status ? (
              <span className="text-green-500">Available</span>
            ) : (
              <span className="text-red-500">Unavailable</span>
            )}
          </p>
          <p>
            <strong>Description:</strong> {selectedProperty.description || "N/A"}
          </p>
          <p>
            <strong>Added On:</strong>{" "}
            {new Date(selectedProperty.created_at).toLocaleString() || "N/A"}
          </p>
        </div>
      ) : (
        <p>No property details available.</p>
      )}

      <button
        onClick={() => setIsView(false)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  );
};

export default ViewProperty;
