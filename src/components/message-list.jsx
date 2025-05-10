import MessageItem from "./message-item.jsx";

// Helper function to format date to DD/MM/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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

  let lastDisplayedDate = null;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => {
        const messageDate = formatDate(message.timestamp);
        const shouldShowDate = messageDate !== lastDisplayedDate;
        lastDisplayedDate = messageDate;

        return (
          <div key={message.id}>
            {shouldShowDate && (
              <p className="text-center my-4">
                <span className="inline-block bg-zinc-500 text-white text-sm px-4 py-1 rounded-full shadow">
                  {messageDate}
                </span>
              </p>
            )}
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.userId === currentUserId}
              onReply={onReplyMessage}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
