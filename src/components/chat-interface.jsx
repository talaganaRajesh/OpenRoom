import { useChat } from "../hooks/use-chat.js";
import MessageList from "./message-List.jsx";
import MessageInput from "./message-input.jsx";
import ThemeToggle from "./theme-toggle.jsx";

export  function ChatInterface() {
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
    cancelReply
  } = useChat();

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
                  <li>Go to the Firebase Console</li>
                  <li>Select your project</li>
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
    <div className="w-full max-w-4xl mx-auto h-screen md:h-[calc(100vh-2rem)] flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="px-6 py-4 border-b flex flex-row items-center justify-between">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Anonymous Chat Room</h3>
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
        />
      </div>
    </div>
  );
}