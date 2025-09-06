import React, { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  Mail, 
  Users, 
  Megaphone,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock
} from "lucide-react";

const Communications = () => {
  const [selectedRecipient, setSelectedRecipient] = useState("all");
  const [messageContent, setMessageContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("messages");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      tenant: "Sarah Johnson",
      property: "Sunset Apartments #205",
      lastMessage: "Thank you for the quick response about the heating issue.",
      timestamp: "2 hours ago",
      unread: false,
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      tenant: "Mike Chen",
      property: "Downtown Lofts #1A", 
      lastMessage: "When can maintenance come to fix the leaky faucet?",
      timestamp: "5 hours ago",
      unread: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      tenant: "Emily Davis",
      property: "Garden View #12",
      lastMessage: "I'll be out of town next week for the inspection.",
      timestamp: "1 day ago",
      unread: false,
      avatar: "/placeholder.svg"
    }
  ];

  // Mock data for announcements
  const announcements = [
    {
      id: 1,
      title: "Pool Maintenance Schedule",
      content: "The pool will be closed for maintenance from March 15-17.",
      recipients: "All Tenants",
      sent: "2024-03-10",
      status: "Sent"
    },
    {
      id: 2,
      title: "Rent Portal Update",
      content: "New online rent payment features now available.",
      recipients: "Sunset Apartments",
      sent: "2024-03-08",
      status: "Sent"
    }
  ];

  // Templates data
  const templates = [
    { title: "Rent Reminder", category: "Payment", usage: "45 times" },
    { title: "Maintenance Schedule", category: "Maintenance", usage: "32 times" },
    { title: "Lease Renewal", category: "Legal", usage: "28 times" },
    { title: "Move-in Welcome", category: "Welcome", usage: "67 times" },
    { title: "Property Inspection", category: "Inspection", usage: "23 times" },
    { title: "Emergency Contact", category: "Emergency", usage: "12 times" }
  ];

  const Avatar = ({ src, fallback }) => {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {src ? (
          <img src={src} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{fallback}</span>
        )}
      </div>
    );
  };

  const Badge = ({ variant = "default", children, className = "" }) => {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    
    const variantClasses = {
      default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
    };
    
    return (
      <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage tenant communications and announcements</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </button>
          <button className="flex items-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Megaphone className="h-4 w-4 mr-2" />
            Announcement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "messages" 
                ? "border-blue-500 text-blue-600 dark:text-blue-400" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "announcements" 
                ? "border-blue-500 text-blue-600 dark:text-blue-400" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Megaphone className="h-4 w-4" />
            Announcements
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "templates" 
                ? "border-blue-500 text-blue-600 dark:text-blue-400" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Mail className="h-4 w-4" />
            Templates
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Conversations</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage tenant communications and support requests</p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    placeholder="Search conversations..." 
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>

              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <Avatar 
                      src={conversation.avatar} 
                      fallback={conversation.tenant.split(' ').map(n => n[0]).join('')} 
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{conversation.tenant}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{conversation.timestamp}</span>
                          {conversation.unread && (
                            <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">New</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{conversation.property}</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{conversation.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Property Announcements</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Broadcast important information to tenants</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{announcement.content}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="h-4 w-4" />
                            {announcement.recipients}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            {announcement.sent}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{announcement.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Message Templates</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Pre-written templates for common communications</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Used {template.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Message Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Send New Message</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Send a message to tenants or create an announcement</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient</label>
                <select 
                  value={selectedRecipient} 
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tenants</option>
                  <option value="property">Specific Property</option>
                  <option value="individual">Individual Tenant</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input 
                  placeholder="Enter message subject" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea 
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communications;