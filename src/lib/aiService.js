// src/lib/aiService.js
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// AI Bot user details
export const AI_BOT = {
  id: 'ai-assistant-bot',
  nickname: 'ChatBot',
  color: 'bg-amber-500', // Distinct color for the AI
};



// Function to generate AI response
export async function generateAIResponse(question) {
  try {
    const response = await fetch('https://still-lake-1a8f.talaganarajesh25.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `You are an AI with humor and sarcasm with correct facts. Follow these rules:\n
                1. Keep responses short and helpful.\n
                2. Maintain context from previous messages.\n
                3. Always respond in English text, but adapt the language:\n
                   - If the user types in Hindi, reply in Hindi but using English script.\n
                User's message: "${question}"` }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 150
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate response from AI.');
    }

    
    return data.candidates?.[0]?.content?.parts?.[0]?.text;

  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'I apologize, but I encountered an error processing your question. Please try again later.';
  }
}


// Function to post AI response to the chat
export async function postAIResponse(question, replyToMessage = null,roomId) {
  try {
    const aiResponse = await generateAIResponse(question);
    
    const messageData = {
      text: aiResponse,
      nickname: AI_BOT.nickname,
      userId: AI_BOT.id,
      timestamp: serverTimestamp(),
      color: AI_BOT.color,
      isAI: true // Flag to identify AI messages
    };
    
    // If this is a reply to a specific message
    if (replyToMessage) {
      messageData.replyTo = {
        id: replyToMessage.id,
        text: replyToMessage.text,
        nickname: replyToMessage.nickname,
        userId: replyToMessage.userId
      };
    }
    
    // Add to Firestore
    await addDoc(collection(db, roomId), messageData);
    return true;
  } catch (error) {
    console.error('Error posting AI response:', error);
    return false;
  }
}