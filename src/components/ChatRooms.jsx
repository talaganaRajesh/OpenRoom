import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing images
import funchat_image from "/public/funchat_image.webp";
import study_image from "/public/study_image.webp";
import development_image from "/public/development_image.webp";
import coding_image from "/public/coding_image.jpeg";
import gaming_image from "/public/gaming_image.webp";
import collegelife_image from "/public/collegelife_image.webp";

function ChatRooms() {
  const navigate = useNavigate();
  const [hoveredRoom, setHoveredRoom] = useState(null);
  
  const rooms = [
    { 
      name: "Fun Chat", 
      id: "messages", 
      image: funchat_image,
      description: "Connect and chat with others about anything fun and interesting"
    },
    { 
      name: "Study", 
      id: "study", 
      image: study_image,
      description: "Join study groups and get help with your assignments"
    },
    { 
      name: "Development", 
      id: "development", 
      image: development_image,
      description: "Discuss development projects and collaborate with other developers"
    },
    { 
      name: "Coding", 
      id: "coding", 
      image: coding_image,
      description: "Get help with code, share resources, and solve problems together"
    },
    { 
      name: "Gaming", 
      id: "gaming", 
      image: gaming_image,
      description: "Find gaming buddies and discuss your favorite games"
    },
    { 
      name: "College Life", 
      id: "collegelife", 
      image: collegelife_image,
      description: "Share campus experiences and connect with fellow students"
    },
  ];

  return (
    <div className="bg-gradient-to-br from-zinc-200 to-zinc-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with logo and tagline */}
        <div className="mb-12 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start mb-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Open Room</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0">
            Join topic-specific chat rooms and connect with people who share your interests
          </p>
        </div>
        
        {/* Featured Room Banner */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative p-8 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-3">Featured Room</h2>
              <p className="mb-4 text-gray-100">Explore our most popular chat room and join the conversation.</p>
              <button 
                onClick={() => navigate(`/${rooms[0].id}`)}
                className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-all">
                Explore Now
              </button>
            </div>
            <div className="md:w-1/3">
              <img 
                src={rooms[0].image} 
                alt="Featured Room" 
                className="rounded-lg shadow-lg w-full max-w-xs mx-auto object-cover h-48"
              />
            </div>
          </div>
        </div>

        {/* Room Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Discover Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => navigate(`/${room.id}`)}
                className="cursor-pointer bg-white  rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover"
                  />
                  {hoveredRoom === room.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300">
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Join Room
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{room.name}</h3>
                  <p className="text-gray-600 text-sm">{room.description}</p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <a href="https://talaganarajesh.vercel.app/" target="_blank" className="text-sm text-gray-500">© 2025 Open Room. Developed By Rajesh</a>
        </div>
      </div>
    </div>
  );
}

export default ChatRooms;