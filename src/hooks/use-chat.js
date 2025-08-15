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
  // Ref to always have latest aiEnabled value in sendMessage
  const aiEnabledRef = useRef(aiEnabled);
  useEffect(() => {
    aiEnabledRef.current = aiEnabled;
  }, [aiEnabled]);

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

  // Send message (accepts optional replyTarget for optimistic clearing)
  const sendMessage = useCallback(async (text, replyTarget = null) => {
    if (!text.trim()) return { success: false, error: 'Message cannot be empty' };

    try {
      const filteredText = filterProfanity(text);

      const messageData = {
        text: filteredText,
        nickname: userSession.nickname,
        userId: userSession.id,
        timestamp: serverTimestamp(),
        color: userSession.color,
      };

      if (replyTarget) {
        messageData.replyTo = {
          id: replyTarget.id,
          text: replyTarget.text,
          nickname: replyTarget.nickname,
          userId: replyTarget.userId,
        };
      }

      const docRef = await addDoc(collection(db, roomId), messageData);

      setUserSession(prev => ({
        ...prev,
        lastMessageTime: Date.now(),
      }));

      // Safety clear
      setReplyingTo(null);

      const isUserMessage = messageData.userId !== AI_BOT.id;
      if (isUserMessage && aiEnabledRef.current) {
        const sentMessage = {
          id: docRef.id,
          ...messageData,
          timestamp: Date.now(),
        };
        const replyText = replyTarget ? `Replying to: ${replyTarget.nickname}: ${replyTarget.text}. ` : '';
        const questionPrompt = `${replyText}User: ${filteredText}`;
        postAIResponse(questionPrompt, sentMessage, roomId);
      }
      return { success: true };
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.message && err.message.includes('permission')) {
        return { success: false, error: 'Permission denied. Please check Firestore security rules.' };
      }
      return { success: false, error: 'Failed to send message. Please try again.' };
    }
  }, [userSession]);


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

