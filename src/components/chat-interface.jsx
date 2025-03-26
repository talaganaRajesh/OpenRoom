import { useChat } from "../hooks/use-chat.js";
import MessageList from "./message-list.jsx";
import MessageInput from "./message-input.jsx";
import ThemeToggle from "./theme-toggle.jsx";

import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

export  function ChatInterface() {

  const { roomId } = useParams(); // Get the roomId from the URL params

  const {
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
    setAiEnabled
  } = useChat(roomId);

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error}</p>
            {error.includes('security rules') && (
              <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-2">Firebase Security Rules Setup:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Go to the Firebase Console </li>
                  <li>Select your project bro</li>
                  <li>Navigate to Firestore Database</li>
                  <li>Click on the "Rules" tab</li>
                  <li>Update the rules to allow read/write access to the messages collection</li>
                </ol>
              </div>
            )}
            <button 
              className="mt-4 px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto md:h-screen h-svh flex flex-col rounded-lg border dark:bg-zinc-900 bg-zinc-100 text-card-foreground shadow-sm">
      <div className="px-6 md:py-4 py-2 border-b flex flex-row items-center justify-between">
        <Link to="/">
        <h3 className="md:text-2xl font-semibold leading-none tracking-tight">Open Room - {roomId}</h3>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList
          messages={messages}
          currentUserId={userSession.id}
          messagesEndRef={messagesEndRef}
          loading={loading}
          onReplyMessage={setReplyMessage}
        />

        <MessageInput
          onSendMessage={sendMessage}
          nickname={userSession.nickname}
          onSetNickname={setNickname}
          replyingTo={replyingTo}
          onCancelReply={cancelReply}
          aiEnabled={aiEnabled}
          setAiEnabled={setAiEnabled}
        />
      </div>
    </div>
  );
}