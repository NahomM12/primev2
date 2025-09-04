import React from "react";
import { useDispatch } from "react-redux";
import { deleteSubRegion } from "../../../store/address/subRegion/subRegionSlice";

const DeleteSubRegion = ({ setIsDelete, selectedSubRegion }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteSubRegion(selectedSubRegion._id))
      .then(() => {
        alert("SubRegion deleted successfully!");
        setIsDelete(false); // Close the modal
      })
      .catch((error) => {
        console.error("Error deleting SubRegion:", error);
        alert("Failed to delete SubRegion.");
      });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Delete SubRegion
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Are you sure you want to delete the SubRegion{" "}
        <span className="font-medium">{selectedSubRegion.name}</span>? This
        action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setIsDelete(false)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteSubRegion;
