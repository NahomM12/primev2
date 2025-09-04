import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTransactionsbyregion, deleteTransaction } from "../../store/transaction/transactionSlice";

const ViewTransactions = ({ setIsView, selectedTransaction }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Transaction Details</h2>
      {selectedTransaction ? (
        <div>
          <p>
            <strong>Transaction ID:</strong> {selectedTransaction.id}
          </p>
          <p>
            <strong>Seller Name:</strong> {selectedTransaction.seller.name || "N/A"}
          </p>
          <p>
            <strong>Buyer Name:</strong> {selectedTransaction.buyer.name || "N/A"}
          </p>
          <p>
            <strong>Property Title:</strong> {selectedTransaction.property.title || "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {selectedTransaction.property.description || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {selectedTransaction.property.address || "N/A"}
          </p>
          <p>
            <strong>Price:</strong> ${selectedTransaction.property.price || "N/A"}
          </p>
        </div>
      ) : (
        <p>No transaction details available.</p>
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
export default ViewTransactions;