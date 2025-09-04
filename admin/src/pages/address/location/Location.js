import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AddLocation from "./AddLocation";
import EditLocation from "./EditLocation";
import DeleteLocation from "./DeleteLocation";
import { getAllLocations } from "../../../store/address/location/locationSlice";

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
const Location = () => {
  const dispatch = useDispatch();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [modifyLocation, setModifyLocation] = useState(null);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  const handleDeleteAll = () => {
    setIsDeleteAll(true);
  };

  const { locations } = useSelector((state) => state.locations);

  // Group locations by region and country
  const groupedLocations = locations?.reduce((acc, location) => {
    const countryId = location.country?._id || "uncategorized";
    const regionId = location.region?._id || "uncategorized";
    const subregionId = location.subregion?._id || "uncategorized";
    const groupKey = `${countryId}-${regionId}-${subregionId}`;

    if (!acc[groupKey]) {
      acc[groupKey] = {
        country: location.country || { country_name: "Uncategorized" },
        region: location.region || { region_name: "Uncategorized" },
        subregion: location.subregion || { subregion_name: "Uncategorized" },
        locations: [],
      };
    }
    acc[groupKey].locations.push(location);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Locations
        </h1>
        <div className="flex gap-3">
          <button
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setIsAdd(true)}
          >
            <FiPlus className="mr-1" />
            Add Location
          </button>
          {locations?.length > 0 && (
            <button
              className="flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors duration-200"
              onClick={handleDeleteAll}
            >
              <FiTrash2 className="mr-1" />
              Delete All
            </button>
          )}
        </div>
      </div>

      {locations?.length > 0 ? (
        <div className="space-y-6">
          {Object.values(groupedLocations).map((group) => (
            <div
              key={`${group.country._id}-${group.region._id}-${group.subregion._id}`}
              className="border-b pb-4"
            >
              {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {group.country.country_name} - {group.region.region_name} -{" "}
                {group.subregion.subregion_name}
              </h2> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.locations.map((location) => (
                  <div
                    key={location._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-4 relative"
                  >
                    <h3
                      className="text-md font-medium text-gray-800 dark:text-white truncate"
                      onClick={() => console.log(groupedLocations)}
                    >
                      {location.location}
                    </h3>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => {
                          setModifyLocation(location);
                          setIsEdit(true);
                        }}
                        className="p-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setModifyLocation(location);
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No locations found.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Click the "Add Location" button to create one.
          </p>
        </div>
      )}

      {/* Modals for adding/editing/deleting locations */}
      <Modal
        isOpen={isAdd}
        onRequestClose={() => setIsAdd(false)}
        style={customModalStyles}
        contentLabel="Add Location"
      >
        <AddLocation setIsAdd={setIsAdd} />
      </Modal>

      <Modal
        isOpen={isEdit}
        onRequestClose={() => setIsEdit(false)}
        style={customModalStyles}
        contentLabel="Edit Location"
      >
        <EditLocation setIsEdit={setIsEdit} selectedLocation={modifyLocation} />
      </Modal>

      <Modal
        isOpen={isDelete}
        onRequestClose={() => setIsDelete(false)}
        style={customModalStyles}
        contentLabel="Delete Location"
      >
        <DeleteLocation
          setIsDelete={setIsDelete}
          selectedLocation={modifyLocation}
        />
      </Modal>
    </div>
  );
};

export default Location;
