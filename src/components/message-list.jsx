import MessageItem from "./message-item.jsx";

export default function MessageList({ messages, currentUserId, messagesEndRef, loading, onReplyMessage }) {
  
  
  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-muted-foreground">No messages yet. Be the first to send one!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          isCurrentUser={message.userId === currentUserId}
          onReply={onReplyMessage}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}