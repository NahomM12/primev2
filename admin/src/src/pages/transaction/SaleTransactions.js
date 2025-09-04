import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllTransactions } from "../../store/sale/saleSlice";
import Modal from "react-modal";

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

const SaleTransactions = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((state) => state.sale);
  const [isView, setIsView] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPrice, setFilterPrice] = useState("all");

  useEffect(() => {
    dispatch(getAllTransactions());
  }, [dispatch]);

  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    setIsView(true);
  };

  // Filter transactions
  // const filteredtransactions = transactions?.filter((sale) => {
  //   const matchesSearch =
  //     sale.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     sale.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     sale.buyerName.toLowerCase().includes(searchQuery.toLowerCase());

  //   const matchesPrice =
  //     filterPrice === "all" ||
  //     (filterPrice === "low" && sale.price < 50000) ||
  //     (filterPrice === "medium" &&
  //       sale.price >= 50000 &&
  //       sale.price <= 100000) ||
  //     (filterPrice === "high" && sale.price > 100000);

  //   return matchesSearch && matchesPrice;
  // });

  return (
    <div className="p-30 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Sale Transactions</h1>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Prices</option>
          <option value="low">Below $50,000</option>
          <option value="medium">$50,000 - $100,000</option>
          <option value="high">Above $100,000</option>
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
              <th className="px-4 py-2">Seller Name</th>
              <th className="px-4 py-2">Buyer Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((sale) => (
              <tr key={sale._id}>
                <td className="px-4 py-2">{sale?.property}</td>
                <td className="px-4 py-2">{sale?.seller}</td>
                <td className="px-4 py-2">{sale?.buyer}</td>
                <td className="px-4 py-2">${sale?.amount}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleView(sale)}
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

      {/* <Modal
        isOpen={isView}
        onRequestClose={() => setIsView(false)}
        style={customModalStyles}
        contentLabel="View transaction details"
      >
        <Modal
          setIsView={setIsView}
          selectedTransaction={selectedTransaction}
        />
      </Modal> */}
    </div>
  );
};

export default SaleTransactions;
