import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllTransactions } from "../../store/transaction/transactionSlice";

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

  useEffect(() => {
    dispatch(getAllTransactions());
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePriceFilter = (event) => {
    setPriceFilter(event.target.value);
  };

  // const filteredTransactions = transactions?.filter((transaction) => {
  //   return (
  //     transaction.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     transaction.renterName.toLowerCase().includes(searchQuery.toLowerCase())
  //   ) &&
  //   (priceFilter === "" ||
  //     (priceFilter === "low" && transaction.price < 500) ||
  //     (priceFilter === "medium" && transaction.price >= 500 && transaction.price <= 1500) ||
  //     (priceFilter === "high" && transaction.price > 1500));
  // });

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Rental Transactions</h1>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by Property or Renter"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border rounded w-1/3"
        />
        <select
          value={priceFilter}
          onChange={handlePriceFilter}
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
            {transactions?.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-4 py-2">{transaction?.property?.title}</td>
                <td className="px-4 py-2">{transaction?.buyer?.name}</td>
                <td className="px-4 py-2">${transaction.amount}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      console.log("View details for:", transaction.id)
                    }
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
    </div>
  );
};

export default RentalTransactions;
