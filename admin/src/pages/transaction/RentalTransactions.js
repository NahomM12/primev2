import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllTransactions } from "../../store/transaction/transactionSlice";
import Modal from "react-modal";

Modal.setAppElement("#root");

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const RentalTransactions = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector(
    (state) => state.transaction
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [isView, setIsView] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    dispatch(getAllTransactions());
  }, [dispatch]);

  // Filter transactions by search and price
  const filteredTransactions = transactions?.filter((transaction) => {
    const propertyName = transaction?.property?.title?.toLowerCase() || "";
    const renterName = transaction?.buyer?.name?.toLowerCase() || "";
    const searchMatch =
      propertyName.includes(searchQuery.toLowerCase()) ||
      renterName.includes(searchQuery.toLowerCase());

    const price = transaction.amount;
    let priceMatch = true;
    if (priceFilter === "low") priceMatch = price < 500;
    if (priceFilter === "medium") priceMatch = price >= 500 && price <= 1500;
    if (priceFilter === "high") priceMatch = price > 1500;

    return searchMatch && priceMatch;
  });

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Rental Transactions</h1>

      {/* Search + Price Filter */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by Property or Renter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Prices</option>
          <option value="low">Low (&lt; $500)</option>
          <option value="medium">Medium ($500 - $1500)</option>
          <option value="high">High (&gt; $1500)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="px-4 py-2">Property Name</th>
              <th className="px-4 py-2">Renter Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions?.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-4 py-2">{transaction?.property?.title}</td>
                <td className="px-4 py-2">{transaction?.buyer?.name}</td>
                <td className="px-4 py-2">${transaction.amount}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsView(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* View Modal */}
      <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View Transaction"
      >
        {selectedTransaction && (
          <div>
            <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
            <p>
              <strong>Property:</strong> {selectedTransaction?.property?.title}
            </p>
            <p>
              <strong>Renter:</strong> {selectedTransaction?.buyer?.name}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedTransaction.amount}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(selectedTransaction.createdAt)}
            </p>

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setIsView(false)}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RentalTransactions;
