import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AddSubRegion from "./AddSubRegion";
import EditSubRegion from "./EditSubRegion";
import DeleteSubRegion from "./DeleteSubRegion";

import { getAllSubRegions } from "../../../store/address/subRegion/subRegionSlice";


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
const SubRegion = () => {
  const dispatch = useDispatch();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [modifySubRegion, setModifySubRegion] = useState(null);

  useEffect(() => {
    dispatch(getAllSubRegions());
  }, [dispatch]);

  const { subRegions } = useSelector((state) => state.subregions);

  // Remove grouping by country and region
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">SubRegions</h1>
        <div className="flex gap-3">
          <button
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setIsAdd(true)}
          >
            <FiPlus className="mr-1" />
            Add SubRegion
          </button>
          {subRegions?.length > 0 && (
            <button
              className="flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors duration-200"
              onClick={() => setIsDeleteAll(true)}
            >
              <FiTrash2 className="mr-1" />
              Delete All
            </button>
          )}
        </div>
      </div>

      {subRegions?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subRegions.map((subRegion) => (
            <div key={subRegion.id} className="bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-4 relative">
              <h3 className="text-md font-medium text-gray-800 dark:text-white truncate">{subRegion.subregion_name}</h3>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => {
                    setModifySubRegion(subRegion);
                    setIsEdit(true);
                  }}
                  className="p-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setModifySubRegion(subRegion);
                    setIsDelete(true);
                  }}
                  className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No subregions found.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Click the "Add SubRegion" button to create one.</p>
        </div>
      )}

      {/* Modals for adding/editing/deleting subregions */}
      <Modal isOpen={isAdd} onRequestClose={() => setIsAdd(false)} style={customModalStyles} contentLabel="Add SubRegion">
        <AddSubRegion setIsAdd={setIsAdd} />
      </Modal>

      <Modal isOpen={isEdit} onRequestClose={() => setIsEdit(false)} style={customModalStyles} contentLabel="Edit SubRegion">
        <EditSubRegion setIsEdit={setIsEdit} selectedSubRegion={modifySubRegion} />
      </Modal>

      <Modal isOpen={isDelete} onRequestClose={() => setIsDelete(false)} style={customModalStyles} contentLabel="Delete SubRegion">
        <DeleteSubRegion setIsDelete={setIsDelete} selectedSubRegion={modifySubRegion} />
      </Modal>

    
    </div>
  );
};

export default SubRegion;