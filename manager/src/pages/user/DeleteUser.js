import React from "react";
import { useDispatch } from "react-redux";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import { deleteUser } from "../../store/user/userSlice";

const DeleteUser = ({ setIsDelete, selectedUser }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteUser(selectedUser._id));
    setIsDelete(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
           {" "}
      <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
               {" "}
        <h2 className="text-xl font-semibold dark:text-white">Delete User</h2>
               {" "}
        <button
          onClick={() => setIsDelete(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
                    <FiX className="text-gray-500 dark:text-gray-400" />
                 {" "}
        </button>
             {" "}
      </div>
           {" "}
      <div className="p-6">
               {" "}
        <div
          className="flex items-center justify-center w-16 h-16 mx-auto mb-4 
                    bg-red-100 dark:bg-red-900/30 rounded-full"
        >
                   {" "}
          <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
                 {" "}
        </div>
               {" "}
        <h3 className="mb-2 text-lg font-medium text-center dark:text-white">
                    Delete {selectedUser.name}
                 {" "}
        </h3>
               {" "}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete this user? This action
          cannot be           undone.        {" "}
        </p>
               {" "}
        <div className="flex justify-end space-x-3">
                   {" "}
          <button
            onClick={() => setIsDelete(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                   dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
                        Cancel          {" "}
          </button>
                   {" "}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                   focus:ring-4 focus:ring-red-500/50 transition-colors"
          >
                        Delete User          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default DeleteUser;
