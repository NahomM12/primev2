import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Data for charts
const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 15000 },
  { month: "Feb", revenue: 52000, expenses: 18000 },
  { month: "Mar", revenue: 48000, expenses: 16000 },
  { month: "Apr", revenue: 61000, expenses: 20000 },
  { month: "May", revenue: 55000, expenses: 17000 },
  { month: "Jun", revenue: 67000, expenses: 22000 },
  { month: "Jul", revenue: 69000, expenses: 21000 },
  { month: "Aug", revenue: 62000, expenses: 19000 },
  { month: "Sep", revenue: 58000, expenses: 18000 },
  { month: "Oct", revenue: 64000, expenses: 20000 },
  { month: "Nov", revenue: 71000, expenses: 23000 },
  { month: "Dec", revenue: 75000, expenses: 24000 },
];

const propertyData = [
  { type: "Apartments", count: 124, fill: "#3b82f6" },
  { type: "Houses", count: 87, fill: "#f97316" },
  { type: "Commercial", count: 42, fill: "#10b981" },
  { type: "Land", count: 35, fill: "#8b5cf6" },
];

const occupancyData = [
  { month: "Jan", occupancy: 82 },
  { month: "Feb", occupancy: 85 },
  { month: "Mar", occupancy: 79 },
  { month: "Apr", occupancy: 88 },
  { month: "May", occupancy: 91 },
  { month: "Jun", occupancy: 94 },
  { month: "Jul", occupancy: 96 },
  { month: "Aug", occupancy: 92 },
  { month: "Sep", occupancy: 89 },
  { month: "Oct", occupancy: 87 },
  { month: "Nov", occupancy: 90 },
  { month: "Dec", occupancy: 93 },
];

// Stats Cards Component
export function StatsCards() {
  const stats = [
    { title: "Total Properties", value: "288", change: "+12%", icon: "🏠" },
    { title: "Occupancy Rate", value: "89%", change: "+3%", icon: "📊" },
    { title: "Monthly Revenue", value: "$64,500", change: "+8%", icon: "💰" },
    { title: "Maintenance Requests", value: "24", change: "-5%", icon: "🔧" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              <p className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Revenue Chart Component
export function RevenueChart() {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{`${label} 2024`}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Revenue: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-orange-600 dark:text-orange-400">
            Expenses: ${payload[1].value.toLocaleString()}
          </p>
          <p className="text-green-600 dark:text-green-400 font-medium">
            Net: ${(payload[0].value - payload[1].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue & Expenses</h3>
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-full border border-blue-500 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            Revenue
          </span>
          <span className="inline-flex items-center rounded-full border border-orange-500 px-2.5 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
            Expenses
          </span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Property Types Chart Component
export function PropertyTypesChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Property Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={propertyData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              label={({ type, count }) => `${type}: ${count}`}
            >
              {propertyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Occupancy Rate Chart Component
export function OccupancyRateChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Occupancy Rate</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip />
            <Bar dataKey="occupancy" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Recent Activity Component
export function RecentActivity() {
  const activities = [
    { id: 1, property: "Sunset Apartments #304", action: "New Lease", time: "2 hours ago", user: "John Doe" },
    { id: 2, property: "Ocean View Villa", action: "Maintenance Request", time: "5 hours ago", user: "Sarah Smith" },
    { id: 3, property: "Downtown Loft", action: "Payment Received", time: "1 day ago", user: "Mike Johnson" },
    { id: 4, property: "Garden Homes #12", action: "Inspection Scheduled", time: "2 days ago", user: "Emily Wilson" },
    { id: 5, property: "City Center Office", action: "Lease Renewal", time: "3 days ago", user: "David Brown" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400">🏠</span>
            </div>
            <div className="ml-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{activity.property}</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.action} by {activity.user}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Component
export function Dashboard() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your properties today.
        </p>
      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart />
        <OccupancyRateChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PropertyTypesChart />
        <RecentActivity />
      </div>
    </div>
  );
}