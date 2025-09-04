import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { getAllSchedules } from "../../store/schedulings/schedulingSlice";

const Scheduling = () => {
  const [plannedMeetings, setPlannedMeetings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleConfirmMeeting = () => {
    if (ownerName && location && phone && date && time) {
      setPlannedMeetings((prev) => [
        ...prev,
        { category: selectedCategory, ownerName, location, phone, date, time },
      ]);
      setIsModalOpen(false);
      setOwnerName("");
      setLocation("");
      setPhone("");
      setDate("");
      setTime("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-200 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
        Schedule a Viewing
      </h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          { title: "House", color: "bg-green-500" },
          { title: "Car", color: "bg-blue-500" },
          { title: "Hall", color: "bg-orange-500" },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-6 text-white rounded-lg shadow-lg cursor-pointer ${item.color} hover:opacity-90 transition-all`}
            onClick={() => openModal(item.title)}
          >
            <h3 className="text-xl font-semibold text-center">{item.title}</h3>
            <p className="text-sm text-center mt-2">
              Click to arrange a meeting
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-600">
                Arrange Meeting for {selectedCategory}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={20} />
              </button>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Owner Name"
                className="w-full p-2 border rounded-lg mb-2"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 border rounded-lg mb-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 border rounded-lg mb-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="date"
                className="w-full p-2 border rounded-lg mb-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                type="time"
                className="w-full p-2 border rounded-lg"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleConfirmMeeting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Meetings Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Scheduled Meetings
        </h2>
        <div className="overflow-x-auto mt-4">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Owner Name</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {plannedMeetings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center px-4 py-2">
                    No meetings scheduled yet.
                  </td>
                </tr>
              ) : (
                plannedMeetings.map((meeting, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="px-4 py-2">{meeting.category}</td>
                    <td className="px-4 py-2">{meeting.ownerName}</td>
                    <td className="px-4 py-2">{meeting.location}</td>
                    <td className="px-4 py-2">{meeting.phone}</td>
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
