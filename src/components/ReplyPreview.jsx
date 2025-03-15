export default function ReplyPreview({ message, onCancel }) {
    if (!message) return null;
    
    return (
      <div className="bg-muted/50 p-2 rounded-md mb-2 border-l-4 border-primary flex justify-between items-start">
        <div className="overflow-hidden">
          <div className="text-xs font-medium text-primary">
            Replying to {message.nickname}
          </div>
          <div className="text-sm truncate max-w-[90%]">
            {message.text}
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="text-muted-foreground hover:text-foreground"
          aria-label="Cancel reply"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    );
  }