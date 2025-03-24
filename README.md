��#   O p e n R o o m 
 
 # Real-time Anonymous Chat Application

A real-time anonymous chat application built with React (Vite), Tailwind CSS, and Firebase Firestore.

## Features

- Live Chat: Users can send messages that appear instantly without refreshing
- Anonymous or Named Messaging: Users can send messages as "Anonymous" or set a temporary nickname
- Real-time Updates: Messages update in real-time using Firebase Firestore's onSnapshot()
- Message Styling: Each message displays a random color avatar and timestamp
- Spam Protection: Rate limiting (one message per 10 sec per user) to prevent spam
- Profanity Filter: Automatically remove/block bad words in messages
- Auto-Scroll: When new messages arrive, the chat auto-scrolls down
- Responsive Design: Mobile-friendly using Tailwind CSS
- Emoji Support: Allow users to add emojis using a simple emoji picker
- Dark Mode: Toggle between light and dark themes

## Setup

1. Clone this repository
2. Install dependencies:

