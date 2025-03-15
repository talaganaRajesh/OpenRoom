import { formatTimestamp, getInitials } from "../lib/utils"
import { useState, useEffect, useRef } from "react"

export default function MessageItem({ message, isCurrentUser, onReply }) {
  const [showActions, setShowActions] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [swiped, setSwiped] = useState(false);
  const messageRef = useRef(null);

  // Handle swipe gesture
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const currentX = e.touches[0].clientX;
    const diff = touchStart - currentX;

    // Detect right-to-left swipe (for left-aligned messages)
    // or left-to-right swipe (for right-aligned messages)
    if ((isCurrentUser && diff >50) || (!isCurrentUser && diff < -50)) {
      setSwiped(true);
    }
  };

  const handleTouchEnd = () => {
    if (swiped) {
      onReply(message);
      setSwiped(false);
    }
    setTouchStart(null);
  };

  // Reset swipe state when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const hexToHSL = (hex) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
  
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
  
    return `hsl(${h.toFixed(0)}, ${s * 100}%, ${Math.min(l * 100 + 30, 90)}%)`; // Increase lightness
  };
  
  const colorCode = message.color.match(/#([0-9a-fA-F]{3,6})/)?.[0] || "#000000"; 
  const lightColor = hexToHSL(colorCode);

  return (
    <div

    onClick={(e) => {
      e.stopPropagation();
      onReply(message);
      setShowActions(!showActions)
    }}


      id={`message-${message.id}`}
      ref={messageRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      // onClick={() => setShowActions(!showActions)}
      className={`flex items-start gap-2 mb-4 ${isCurrentUser ? "justify-end" : "justify-start"} group`}>

      {!isCurrentUser && (
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full ${message.color} flex items-center justify-center text-white font-medium`}
        >
          {getInitials(message.nickname)}
        </div>
      )}

      <div className="flex flex-col relative">
        <span className="font-medium pb-1 text-sm" style={{ color: lightColor }}>{isCurrentUser ? "" : message.nickname}</span>

        {message.replyTo && message.replyTo.id ? (
          <div
            className="bg-gray-200  dark:bg-zinc-600 p-2 rounded text-xs border-l-2 border-blue-500 mb-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-700 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              const replyElement = document.getElementById(`message-${message.replyTo.id}`);
              if (replyElement) {
                replyElement.scrollIntoView({ behavior: 'smooth' });
                replyElement.classList.add('bg-zinc-400');
                setTimeout(() => replyElement.classList.remove('bg-zinc-400'), 500);
              }
            }}
          >
            <span className="font-semibold">{message.replyTo.nickname}:</span>
            <p className="truncate">{message.replyTo.text || "Message deleted"}</p>
          </div>
        ) : null}

        <div
          className={`${isCurrentUser ? "bg-zinc-800 dark:bg-zinc-200 text-primary-foreground" : "bg-zinc-300 dark:bg-zinc-800"} rounded-lg pl-4 py-2 pr-20 relative`}
        >
          <p className="break-words">{message.text}</p>
          <span className="text-xs bottom-1 absolute right-2 opacity-70">{formatTimestamp(message.timestamp)}</span>
        </div>
        

        <button
          onClick={(e) => {
            e.stopPropagation();
            onReply(message);
          }}
          className="absolute -right-10 top-1/2 -translate-y-1/2 text-xs p-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity group/tooltip"
          aria-label="Reply"
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Reply
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${isCurrentUser ? "rotate-180" : ""}`}
          >
            <polyline points="9 17 4 12 9 7"></polyline>
            <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
          </svg>
        </button>

      </div>

      {isCurrentUser && (
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full ${message.color} flex items-center justify-center text-white font-medium`}
        >
          {getInitials(message.nickname)}
        </div>
      )}
    </div>
  )
}