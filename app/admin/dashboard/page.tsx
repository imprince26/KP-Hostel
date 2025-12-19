"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FaBell, 
  FaUsers, 
  FaFileAlt, 
  FaBed, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSignOutAlt,
  FaChartBar,
  FaCog,
  FaHome
} from "react-icons/fa";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user.role !== "admin") {
      router.push("/student/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="KP Vidhyarthi Bhavan"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">KP Vidhyarthi Bhavan</h1>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <FaBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/auth/signout")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                <FaSignOutAlt size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Welcome, {session.user.name}. Here's an overview of the hostel management system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-2">Registered students</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-2">Awaiting review</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaFileAlt className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-2">This month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-2">This month</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaTimesCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                <button className="text-sm font-medium text-orange-600 hover:text-orange-700">
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                <FaFileAlt className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-lg font-medium">No applications yet</p>
                <p className="text-sm mt-1">New applications will appear here</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <p className="font-medium text-orange-900">Manage Students</p>
                <p className="text-sm text-orange-700 mt-1">View and manage student accounts</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <p className="font-medium text-blue-900">Review Applications</p>
                <p className="text-sm text-blue-700 mt-1">Process pending applications</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <p className="font-medium text-green-900">Room Management</p>
                <p className="text-sm text-green-700 mt-1">Manage room allocations</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <p className="font-medium text-purple-900">Send Announcement</p>
                <p className="text-sm text-purple-700 mt-1">Broadcast to all students</p>
              </button>
            </div>
          </div>
        </div>

        {/* System Info & Links */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaChartBar className="text-orange-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">System Statistics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Total Rooms</span>
                <span className="font-semibold text-gray-900">500</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Occupied Rooms</span>
                <span className="font-semibold text-gray-900">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Available Rooms</span>
                <span className="font-semibold text-green-600">500</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Occupancy Rate</span>
                <span className="font-semibold text-gray-900">0%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaCog className="text-orange-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Management Links</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/en"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <FaHome className="text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Home</span>
              </Link>
              <Link
                href="/en/facilities"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <FaBed className="text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Facilities</span>
              </Link>
              <Link
                href="/en/admission"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <FaFileAlt className="text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Admission</span>
              </Link>
              <Link
                href="/en/announcements"
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <FaBell className="text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Announcements</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
