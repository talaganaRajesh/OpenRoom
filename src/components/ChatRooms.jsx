import React from "react";
import { useNavigate } from "react-router-dom";

import funchat_image from "/public/funchat_image.webp";
import study_image from "/public/study_image.webp";
import development_image from "/public/development_image.webp";
import coding_image from "/public/coding_image.jpeg";
import gaming_image from "/public/gaming_image.webp";
import collegelife_image from "/public/collegelife_image.webp";





function ChatRooms() {
  const navigate = useNavigate();
  const rooms = [
    { name: "fun-chat", id: "messages", image: funchat_image },
    { name: "study", id: "study", image: study_image },
    { name: "development", id: "development", image: development_image },
    { name: "coding", id: "coding", image:  coding_image },
    { name: "gaming", id: "gaming", image:  gaming_image },
    { name: "College Life", id: "collegelife", image: collegelife_image },
  ];

  return (
    <div className="w-4/5 items-start justify-start flex flex-col h-full p-6">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-gray-800 mb-14">Open Room</h1>
      
      {/* Chat Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => navigate(`/${room.id}`)}
            className="cursor-pointer hover:text-red relative flex justify-center items-end h-52 bg-white shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <img 
              src={room.image} 
              alt={room.name} 
              className="absolute inset-0 w-full h-full opacity-80 hover:opacity-100 transition-opacity"
            />
            <h2 className="absolute text-lg mb-2 font-semibold text-white bg-black bg-opacity-60 px-3 py-1 rounded-lg">
              {room.name.replace("-", " ").toUpperCase()}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatRooms;