import React from "react";
import ap from '../assets/homepic.png'
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="flex-1 dark:bg-black flex items-center justify-center p-8 lg:p-16 bg-gray-100">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold mb-4">Find Your MLA</h1>
          <p className="text-lg mb-6">
            Discover and connect with your local Member of the Legislative
            Assembly. Use our search tool to find detailed information about
            your MLA, including their contact details, services, and more.
          </p>
          <a
            href="/locator"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Find Your MLA
          </a>
        </div>
      </div>

      {/* Center - Image Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <img
        src={ap}
          alt="Base64 Image"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
