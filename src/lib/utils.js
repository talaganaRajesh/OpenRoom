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
    "bg-gradient-to-r from-[#1E1E2E] to-[#3A3A52]",  // Dark Royal Blue
    "bg-gradient-to-r from-[#2C2C2C] to-[#595959]",  // Premium Charcoal Gray
    "bg-gradient-to-r from-[#0F172A] to-[#1E293B]",  // Deep Navy Blue
    "bg-gradient-to-r from-[#3B0764] to-[#6B21A8]",  // Dark Purple Velvet
    "bg-gradient-to-r from-[#312E81] to-[#4338CA]",  // Rich Indigo Depths
    "bg-gradient-to-r from-[#4A044E] to-[#7E22CE]",  // Dark Amethyst
    "bg-gradient-to-r from-[#373737] to-[#4B5563]",  // Carbon Steel
    "bg-gradient-to-r from-[#1B1B1B] to-[#333333]",  // Pure Matte Black
    "bg-gradient-to-r from-[#374151] to-[#1E293B]",  // Gunmetal Blue-Gray
    "bg-gradient-to-r from-[#172554] to-[#312E81]",  // Deep Blue Noir
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

