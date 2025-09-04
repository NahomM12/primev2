import React from "react";

const ViewManager = ({ setIsView, selectedUser }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manager Details</h2>
      <div className="mb-2">
        <strong className="text-sm font-medium">Name:</strong>
        <p className="ml-2">{selectedUser.name}</p>
      </div>
      <div className="mb-2">
        <strong className="text-sm font-medium">Email:</strong>
        <p className="ml-2">{selectedUser.email}</p>
      </div>
      <div className="mb-2">
        <strong className="text-sm font-medium">Phone:</strong>
        <p className="ml-2">{selectedUser.phone}</p>
      </div>
    
      <div className="mt-4">
        <button
          onClick={() => setIsView(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewManager;
