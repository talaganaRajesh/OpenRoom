"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

import ReplyPreview from "./ReplyPreview.jsx";

export default function MessageInput({ onSendMessage, onSetNickname, replyingTo,
  onCancelReply, aiEnabled, setAiEnabled }) {
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const inputRef = useRef(null)


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const textToSend = message
    const replyTarget = replyingTo

    // Optimistic clear for instant feel
    setMessage("")
    if (replyTarget) onCancelReply()

    const result = await onSendMessage(textToSend, replyTarget)

    if (result.success) {
      setError(null)
    } else if (result.error) {
      setError(result.error)
      // restore message on failure
      setMessage(textToSend)
    }
    if (inputRef.current) inputRef.current.focus()
  }

  // Focus input on initial mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])



  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus()
    }
  }, [replyingTo])


  return (
    <div className="border-t p-4">
      {error && <div className="mb-2 p-2 bg-destructive/10 text-destructive text-sm rounded">{error}</div>}




      {/* Reply context if this message is a reply */}

      <ReplyPreview message={replyingTo} onCancel={onCancelReply} />

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => setAiEnabled(prev => !prev)}
          className={`relative w-16 px-1 h-8 flex items-center justify-between rounded-full transition-all duration-300 overflow-hidden text-xs font-semibold ${aiEnabled ? 'bg-amber-500 text-black' : 'bg-gray-300 text-gray-600'}`}
          aria-pressed={aiEnabled}
        >
          <span className={`absolute left-3 transition-opacity ${aiEnabled ? 'opacity-100' : 'opacity-0'}`}>AI</span>
          <span className={`w-5 h-5 bg-zinc-600 rounded-full shadow-md transition-all duration-300 transform ${aiEnabled ? 'translate-x-9' : 'translate-x-0'}`}></span>
          <span className={`absolute right-3 transition-opacity ${!aiEnabled ? 'opacity-100' : 'opacity-0'}`}>AI</span>
        </button>
        <Input
          onChange={(e) => onSetNickname(e.target.value)}
          placeholder="Anonymous"
          className="border-zinc-400 w-40 h-8 dark:border-zinc-700 text-sm"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
              className="pr-10 w-full pl-2 pt-1 h-fit text-black dark:text-white dark:bg-zinc-800 rounded-md resize-none min-h-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
          />

        </div>
        <Button type="submit" className="h-12" disabled={!message.trim()}>
          Send
        </Button>
      </form>


      
    </div>
  )
}

