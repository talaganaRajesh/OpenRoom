"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { generateUserId, generateRandomColor, filterProfanity } from "@/lib/utils"
import { postAIResponse, AI_BOT } from '../lib/aiService.js';


export function useChat(roomId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [aiEnabled, setAiEnabled] = useState(false);

  const [userSession, setUserSession] = useState(() => {
    // Initialize user session with random ID and color
    return {
      id: generateUserId(),
      nickname: "Anonymous",
      color: generateRandomColor(),
      lastMessageTime: 0,
    }
  })

  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Set nickname
  const setNickname = useCallback((nickname) => {
    setUserSession((prev) => ({
      ...prev,
      nickname: nickname.trim() || "Anonymous",
    }))
  }, [])



  // Add this state to handle replying to messages

  const [replyingTo, setReplyingTo] = useState(null);

  // Add this function to handle setting a message to reply to
  const setReplyMessage = useCallback((message) => {
    setReplyingTo(message);
  }, []);

  // Add this function to cancel replying
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);




  // Inside the useChat function, modify the sendMessage function:

  // Send message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return { success: false, error: 'Message cannot be empty' };



    try {
      // Filter profanity
      const filteredText = filterProfanity(text);

      // Create message object with optional reply data
      const messageData = {
        text: filteredText,
        nickname: userSession.nickname,
        userId: userSession.id,
        timestamp: serverTimestamp(),
        color: userSession.color,
      };

      // Add reply data if replying to a message
      if (replyingTo) {
        messageData.replyTo = {
          id: replyingTo.id,
          text: replyingTo.text,
          nickname: replyingTo.nickname,
          userId: replyingTo.userId
        };
      }

      // Add message to Firestore
      const docRef = await addDoc(collection(db, roomId), messageData);

      // Update last message time
      setUserSession(prev => ({
        ...prev,
        lastMessageTime: Date.now(),
      }));

      // Clear reply state
      setReplyingTo(null);

      // Check if the message is a question and trigger AI response
      // We don't want the AI to respond to its own messages or replies to AI
      const isUserMessage = messageData.userId !== AI_BOT.id;
      // const isNotReplyToAI = !replyingTo || replyingTo.userId !== AI_BOT.id;


      if (isUserMessage && aiEnabled) {
        // Get the message we just sent to use as context for the AI
        const sentMessage = {
          id: docRef.id,
          ...messageData,
          timestamp: Date.now() // Use current time since serverTimestamp() doesn't return a value
        };
      
        // Build question prompt including the replied-to message if available
        const replyText = replyingTo ? `Replying to: ${replyingTo.nickname}: ${replyingTo.text}. ` : '';
        const questionPrompt = `${replyText}User: ${filteredText}`;
      
        // Post AI response (don't await to avoid blocking the UI)
        postAIResponse(questionPrompt, sentMessage,roomId);
      }
      
   

      return { success: true };
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.message && err.message.includes('permission')) {
        return { success: false, error: 'Permission denied. Please check Firestore security rules.' };
      }
      return { success: false, error: 'Failed to send message. Please try again.' };
    }
  }, [userSession, replyingTo]);


  useEffect(() => {
    setLoading(true);

    try {
      const q = query(collection(db, roomId), orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              text: data.text,
              nickname: data.nickname,
              userId: data.userId,
              timestamp: data.timestamp ? data.timestamp.toMillis() : Date.now(),
              color: data.color,
              replyTo: data.replyTo ? { ...data.replyTo } : null, // Ensure replyTo is included
            };
          }).sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp ascending

          setMessages(newMessages);
          setLoading(false);

          // Scroll to bottom when new messages arrive
          setTimeout(scrollToBottom, 100);
        },
        (err) => {
          console.error("Error fetching messages:", err);
          setError("Failed to load messages. Please check Firestore security rules.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up message listener:", err);
      setError("Failed to connect to chat. Please check Firebase configuration.");
      setLoading(false);
    }
  }, [scrollToBottom]);



  return {
    messages,
    loading,
    error,
    userSession,
    sendMessage,
    setNickname,
    messagesEndRef,
    replyingTo,
    setReplyMessage,
    cancelReply,
    aiEnabled,
    setAiEnabled,
  }
}

