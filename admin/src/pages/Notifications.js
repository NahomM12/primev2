import React, { useState } from 'react';

const NotificationSystem = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [notificationType, setNotificationType] = useState('info');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', selected: false },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', selected: false },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', selected: false },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', selected: false },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', selected: false },
  ]);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [activeNotifications, setActiveNotifications] = useState([
    { id: 1, type: 'info', title: 'System Update', message: 'Scheduled maintenance tonight at 2 AM', time: '2 hours ago', active: true },
    { id: 2, type: 'success', title: 'New Feature', message: 'Check out our new dashboard features', time: '5 hours ago', active: true },
    { id: 3, type: 'warning', title: 'Action Required', message: 'Please update your profile information', time: '1 day ago', active: true },
  ]);

  const toggleUserSelection = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, selected: !user.selected } : user
    ));
  };

  const selectAllUsers = () => {
    setUsers(users.map(user => ({ ...user, selected: true })));
  };

  const deselectAllUsers = () => {
    setUsers(users.map(user => ({ ...user, selected: false })));
  };

  const sendNotification = () => {
    if (!notificationTitle || !notificationMessage) {
      alert('Please fill in title and message');
      return;
    }
    
    const selectedUsers = users.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }
    
    // In a real app, this would send the notification to the backend
    alert(`Notification sent to ${selectedUsers.length} users!`);
    
    // Reset form
    setNotificationTitle('');
    setNotificationMessage('');
    setScheduledTime('');
    deselectAllUsers();
  };

  const toggleNotificationActive = (id) => {
    setActiveNotifications(activeNotifications.map(notification => 
      notification.id === id ? { ...notification, active: !notification.active } : notification
    ));
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Notification System</h1>
          <p className="text-gray-600">Manage and send notifications to your users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Notification Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex border-b mb-6">
                <button
                  className={`py-2 px-4 font-medium ${activeTab === 'manual' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('manual')}
                >
                  Manual Notification
                </button>
                <button
                  className={`py-2 px-4 font-medium ${activeTab === 'active' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('active')}
                >
                  Active Notifications
                </button>
              </div>

              {activeTab === 'manual' ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Notification</h2>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Notification Type</label>
                      <div className="flex space-x-2">
                        {['info', 'success', 'warning', 'error'].map(type => (
                          <button
                            key={type}
                            className={`px-4 py-2 rounded-lg capitalize ${notificationType === type ? getTypeColor(type) : 'bg-gray-100 text-gray-700'}`}
                            onClick={() => setNotificationType(type)}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={notificationTitle}
                        onChange={(e) => setNotificationTitle(e.target.value)}
                        placeholder="Enter notification title"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Message</label>
                      <textarea
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        placeholder="Enter notification message"
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2">Schedule (optional)</label>
                      <input
                        type="datetime-local"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700">Select Users</label>
                        <div className="space-x-2">
                          <button 
                            className="text-sm text-blue-600 hover:underline"
                            onClick={selectAllUsers}
                          >
                            Select All
                          </button>
                          <button 
                            className="text-sm text-blue-600 hover:underline"
                            onClick={deselectAllUsers}
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                        {users.map(user => (
                          <div 
                            key={user.id} 
                            className={`p-3 flex items-center cursor-pointer hover:bg-gray-50 ${user.selected ? 'bg-blue-50' : ''}`}
                            onClick={() => toggleUserSelection(user.id)}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${user.selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                              {user.selected && <span className="text-white text-sm">✓</span>}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      onClick={sendNotification}
                    >
                      Send Notification
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Notifications</h2>
                  <div className="space-y-4">
                    {activeNotifications.map(notification => (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <span className="text-xl mr-3">{getTypeIcon(notification.type)}</span>
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-gray-600">{notification.message}</p>
                              <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${notification.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <button 
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => toggleNotificationActive(notification.id)}
                            >
                              {notification.active ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats and Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold">128</div>
                    <div className="text-gray-600">Sent Today</div>
                  </div>
                  <div className="text-3xl">📤</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold">94%</div>
                    <div className="text-gray-600">Read Rate</div>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-gray-600">Scheduled</div>
                  </div>
                  <div className="text-3xl">⏰</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <span>Send Welcome Message</span>
                  <span>👋</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <span>Notify Inactive Users</span>
                  <span>💤</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <span>Promotion Announcement</span>
                  <span>🎉</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">✅</div>
                  <div>
                    <p>Promotion sent to 256 users</p>
                    <p className="text-sm text-gray-500">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">ℹ️</div>
                  <div>
                    <p>System update notification</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">⚠️</div>
                  <div>
                    <p>Maintenance alert sent</p>
                    <p className="text-sm text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;