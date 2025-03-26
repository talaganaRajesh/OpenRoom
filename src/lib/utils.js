import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from "nanoid"

// Combine class names with Tailwind
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Generate a random user ID
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10)
export const generateUserId = () => nanoid()

// Generate a random color for user avatars
export const generateRandomColor = () => {
  const colors = [
   "bg-gradient-to-r from-[#8E44AD] to-[#C39BD3]",  // Royal Purple
    "bg-gradient-to-r from-[#2980B9] to-[#6DD5FA]",  // Oceanic Blue
    "bg-gradient-to-r from-[#27AE60] to-[#2ECC71]",  // Luxury Emerald Green
    "bg-gradient-to-r from-[#E67E22] to-[#F5B041]",  // Rich Amber Orange
    "bg-gradient-to-r from-[#C0392B] to-[#E74C3C]",  // Premium Crimson Red
    "bg-gradient-to-r from-[#34495E] to-[#5D6D7E]",  // Graphite Gray
    "bg-gradient-to-r from-[#F1C40F] to-[#FDEB71]",  // Royal Gold
    "bg-gradient-to-r from-[#1ABC9C] to-[#48C9B0]",  // Mint Aqua
    "bg-gradient-to-r from-[#2C3E50] to-[#4B6584]",  // Deep Steel
    "bg-gradient-to-r from-[#9B59B6] to-[#BE90D4]",  // Dark Amethyst
    "bg-gradient-to-r from-[#D35400] to-[#E59866]",  // Burnt Orange
    "bg-gradient-to-r from-[#7F8C8D] to-[#95A5A6]",  // Titanium Gray
    "bg-gradient-to-r from-[#5C2C6D] to-[#9D50BB]",  // Mystical Plum
    "bg-gradient-to-r from-[#283048] to-[#859398]",  // Cosmic Blue Gray
    "bg-gradient-to-r from-[#232526] to-[#414345]",  // Black Onyx
    "bg-gradient-to-r from-[#6A3093] to-[#A044FF]",  // Deep Violet Mist
    "bg-gradient-to-r from-[#1F4037] to-[#99F2C8]",  // Forest Emerald
    "bg-gradient-to-r from-[#FF512F] to-[#F09819]",  // Sunset Blaze
    "bg-gradient-to-r from-[#0F2027] to-[#203A43]",  // Midnight Blue
    "bg-gradient-to-r from-[#E43A15] to-[#E96D71]"   // Fiery Ruby Red
  ];
  
  
  return colors[Math.floor(Math.random() * colors.length)]
}

// Format timestamp
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Simple profanity filter
const badWords = [
  "bastard", "damn", "hell", "shit", "fuck", "asshole", "bitch", "dick", "piss", "prick", 
  "slut", "whore", "cock", "pussy", "motherfucker", "cunt", "faggot", "twat", "wanker", 
  "bollocks", "bugger", "arsehole", "dipshit", "dumbass", "jackass", "retard",
  "nude", "nudes", "boobs", "tits", "breasts", "vagina", "penis", "dildo", "sex", "porn", 
  "porno", "stripper", "nipple", "nipples", "butt", "buttplug", "blowjob", "handjob", 
  "masturbate", "orgasm", "deepthroat", "anal", "doggystyle", "cum", "semen", "ejaculate", 
  "hentai", "xxx", "erotic", "fetish", "bdsm", "bondage", "threesome", "gangbang", "bareback"
];

export const filterProfanity = (text) => {
  let filteredText = text;

  badWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi"); // Matches whole words only
    filteredText = filteredText.replace(regex, (match) => {
      if (match.length > 2) {
        return match[0] + "*".repeat(match.length - 2) + match[match.length - 1];
      } else {
        return match[0] + "*"; // Handles very short words like "ass"
      }
    });
  });

  return filteredText;
};



// Get initials from nickname
export const getInitials = (nickname) => {
  if (!nickname || nickname === "Anonymous") return "A"
  return nickname.charAt(0).toUpperCase()
}

