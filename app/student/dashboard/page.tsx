"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBell, FaUser, FaFileAlt, FaBed, FaCreditCard, FaCog, FaSignOutAlt, FaHome } from "react-icons/fa";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.needsProfileCompletion) {
      router.push("/auth/complete-profile");
    } else if (session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "student") {
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
                  <p className="text-xs text-gray-500">Student Dashboard</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <FaBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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
            Welcome back, {session.user.name}! 👋
          </h2>
          <p className="text-gray-600 mt-1">Here's what's happening with your hostel account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Application Status</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">Pending</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaFileAlt className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Room Number</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">Not Assigned</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBed className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Status</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">Up to Date</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCreditCard className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Announcements</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2 New</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaBell className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaUser className="text-orange-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                <p className="font-medium text-gray-900 mt-1">{session.user.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                <p className="font-medium text-gray-900 mt-1">{session.user.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Role</p>
                <p className="font-medium text-gray-900 mt-1 capitalize">{session.user.role}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Member Since</p>
                <p className="font-medium text-gray-900 mt-1">
                  {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group">
                <p className="font-medium text-orange-900">Apply for Admission</p>
                <p className="text-sm text-orange-700 mt-1">Submit your hostel application</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                <p className="font-medium text-blue-900">Application Status</p>
                <p className="text-sm text-blue-700 mt-1">Track your application progress</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                <p className="font-medium text-green-900">Payment History</p>
                <p className="text-sm text-green-700 mt-1">View your payment records</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                <p className="font-medium text-purple-900">Room Details</p>
                <p className="text-sm text-purple-700 mt-1">Check your room information</p>
              </button>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Announcements</h3>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Welcome to KP Vidhyarthi Bhavan</p>
                    <p className="text-xs text-gray-600 mt-1">Complete your profile and apply for admission today!</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Today</p>
              </div>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">New Facilities Added</p>
                    <p className="text-xs text-gray-600 mt-1">Check out our updated facilities page</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">2 days ago</p>
              </div>
            </div>
            <Link
              href="/announcements"
              className="block mt-4 text-center text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              View All Announcements →
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/en"
              className="flex items-center gap-3 px-4 py-3 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <FaHome className="text-orange-500" size={20} />
              <span className="font-medium text-gray-700">Home</span>
            </Link>
            <Link
              href="/en/facilities"
              className="flex items-center gap-3 px-4 py-3 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <FaBed className="text-orange-500" size={20} />
              <span className="font-medium text-gray-700">Facilities</span>
            </Link>
            <Link
              href="/en/admission"
              className="flex items-center gap-3 px-4 py-3 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <FaFileAlt className="text-orange-500" size={20} />
              <span className="font-medium text-gray-700">Admission</span>
            </Link>
            <Link
              href="/en/contact"
              className="flex items-center gap-3 px-4 py-3 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <FaCog className="text-orange-500" size={20} />
              <span className="font-medium text-gray-700">Contact</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
