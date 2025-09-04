import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdCheckCircle, MdError } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const Scheduling = () => {
  const [viewingSlots, setViewingSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plannedMeetings, setPlannedMeetings] = useState([]);
  const [buyerName, setBuyerName] = useState(""); // Pre-fill this field based on API or mock data

  // Mock data for slots and buyer details (In real case, this would come from your database or API)
  const mockSlots = [
    { id: 1, propertyName: "Villa Sunset", status: "available", buyerName: "John Doe" },
    { id: 2, propertyName: "Ocean View Apartment", status: "booked", buyerName: "Jane Smith" },
    { id: 3, propertyName: "Mountain Retreat", status: "available", buyerName: "Michael Johnson" },
    { id: 4, propertyName: "City Center Loft", status: "available", buyerName: "Sarah Lee" },
  ];

  // Simulate fetching data from API
  useEffect(() => {
    const fetchSlots = async () => {
      setViewingSlots(mockSlots);
    };
    fetchSlots();
  }, []);

  // Handle booking a slot
  const handleBooking = (slot) => {
    if (slot.status === "available") {
      setSelectedSlot(slot);
      setBuyerName(slot.buyerName); // Pre-fill the buyer's name
      setIsModalOpen(true);
    } else {
      alert("This slot is already booked.");
    }
  };

  // Handle confirming the meeting arrangement
  const handleConfirmMeeting = (date, time) => {
    if (selectedSlot) {
      setPlannedMeetings((prevMeetings) => [
        ...prevMeetings,
        { propertyName: selectedSlot.propertyName, date, time, buyerName },
      ]);
      setIsModalOpen(false);
    } else {
      alert("Please select a valid slot.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-200 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">Schedule a Property Viewing</h1>

      {/* Calendar and Slots Section */}
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Available Properties for Viewing</h2>
          <button className="text-blue-600 hover:text-blue-800 flex items-center">
            <FaCalendarAlt className="inline-block mr-2" />
            View Calendar
          </button>
        </div>

        {/* Available Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewingSlots.map((slot) => (
            <div
              key={slot.id}
              className={`p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
                slot.status === "available" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-800">{slot.propertyName}</h3>
              <p className={`text-sm mt-2 ${slot.status === "available" ? "text-green-500" : "text-red-500"}`}>
                {slot.status === "available" ? <MdCheckCircle className="inline-block mr-1" /> : <MdError className="inline-block mr-1" />}
                {slot.status}
              </p>

              <button
                onClick={() => handleBooking(slot)}
                className={`mt-4 px-4 py-2 rounded-lg text-white w-full ${
                  slot.status === "available" ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={slot.status !== "available"}
              >
                {slot.status === "available" ? "Arrange Meeting" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Booking Confirmation */}
      {isModalOpen && selectedSlot && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-80 sm:w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-green-600">Arrange a Meeting</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <IoMdClose size={20} />
              </button>
            </div>
            <div className="mt-4">
              <p><strong>Property:</strong> {selectedSlot.propertyName}</p>
              <p><strong>Buyer Name:</strong> {buyerName}</p> {/* Display pre-filled buyer name */}
              <p><strong>Select Date and Time:</strong></p>
              <input
                type="date"
                className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => handleConfirmMeeting("2024-12-18", "10:00 AM")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Planned Meetings Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Scheduled Meetings</h2>
        <div className="overflow-x-auto mt-4">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="px-4 py-2">Buyer Name</th>
                <th className="px-4 py-2">Property Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {plannedMeetings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-2">
                    No meetings scheduled yet.
                  </td>
                </tr>
              ) : (
                plannedMeetings.map((meeting, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-100" : ""}`}>
                    <td className="px-4 py-2">{meeting.buyerName}</td>
                    <td className="px-4 py-2">{meeting.propertyName}</td>
                    <td className="px-4 py-2">{meeting.date}</td>
                    <td className="px-4 py-2">{meeting.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
