"use client";
import { useGetProfile } from "@/lib/queries/profile";

const DashboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-black">Dashboard</h1>
      <p className="text-lg text-gray-700">Welcome to your dashboard!</p>
    </div>
  );
};

export default DashboardPage;
