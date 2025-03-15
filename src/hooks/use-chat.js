"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { generateUserId, generateRandomColor, filterProfanity } from "@/lib/utils"


export function useChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  // Modify your sendMessage function to include reply data
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
      await addDoc(collection(db, 'messages'), messageData);

      // Update last message time
      setUserSession(prev => ({
        ...prev,
        lastMessageTime: Date.now(),
      }));

      // Clear reply state
      setReplyingTo(null);

      return { success: true };
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.message && err.message.includes('permission')) {
        return { success: false, error: 'Permission denied. Please check Firestore security rules.' };
      }
      return { success: false, error: 'Failed to send message. Please try again.' };
    }
  }, [ userSession, replyingTo]);




  useEffect(() => {
    setLoading(true);
  
    try {
      const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
  
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
  }
}

