import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { FiPlus, FiEdit2, FiTrash2, FiTrash } from "react-icons/fi";
import AddRegion from "./AddRegion";
import EditRegion from "./EditRegion";
import DeleteRegion from "./DeleteRegion";
import { getAllRegions } from "../../../store/address/region/regionSlice";
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

const Region = () => {
  const dispatch = useDispatch();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [modifyRegion, setModifyRegion] = useState(null);

  useEffect(() => {
    dispatch(getAllRegions());
  }, [dispatch]);

  const { regions } = useSelector((state) => state.regions);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Region Management
        </h1>
        <div className="flex space-x-3">
          <button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
            onClick={() => setIsAdd(true)}
          >
            <FiPlus className="mr-2" />
            Add Region
          </button>
          {regions?.length > 0 && (
            <button
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
              onClick={() => setIsDeleteAll(true)}
            >
              <FiTrash className="mr-2" />
              Delete All
            </button>
          )}
        </div>
      </div>

      {regions?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {regions.map((region) => (
            <div
              key={region._id}
              className="relative bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {region.region_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created:{" "}
                    <span className="font-medium">
                      {new Date(region.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {/* Hover actions */}
                <div
                  className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 
                              transition-opacity duration-200"
                >
                  <button
                    onClick={() => {
                      setModifyRegion(region);
                      setIsEdit(true);
                    }}
                    className="p-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setModifyRegion(region);
                      setIsDelete(true);
                    }}
                    className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No regions found.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Click the "Add Region" button to create one.
          </p>
        </div>
      )}

      {/* Add Region Modal */}
      <Modal
        isOpen={isAdd}
        onRequestClose={() => setIsAdd(false)}
        style={customModalStyles}
        contentLabel="Add Region"
      >
        <AddRegion setIsAdd={setIsAdd} />
      </Modal>

      {/* Edit Region Modal */}
      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Region"
      >
        <EditRegion setIsEdit={setIsEdit} selectedRegion={modifyRegion} />
      </Modal>

      {/* Delete Region Modal */}
      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Region"
      >
        <DeleteRegion setIsDelete={setIsDelete} selectedRegion={modifyRegion} />
      </Modal>
    </div>
  );
};

export default Region;
