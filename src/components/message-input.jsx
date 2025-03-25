"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

import ReplyPreview from "./ReplyPreview.jsx";

export default function MessageInput({ onSendMessage, onSetNickname, replyingTo,
  onCancelReply,aiEnabled,setAiEnabled }) {
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const inputRef = useRef(null)


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) return

    const result = await onSendMessage(message)

    setMessage("")

    if (result.success) {
      setError(null)
    } else if (result.error) {
      setError(result.error)
    }

    // Ensure input remains focused after message is sent
    if (inputRef.current) {
      inputRef.current.focus();
    }

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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="pr-10"
          />

        </div>
        <Button type="submit" disabled={!message.trim()}>
          Send
        </Button>
      </form>


      <div className="flex flex-row items-center gap-2 mt-2 w-full">
        {/* Nickname Input Section */}
        <div className="flex gap-2 flex-col md:flex-row items-center w-full md:w-auto">
          <button className="text-xs w-full md:w-auto hidden md:block cursor-default h-9 rounded-sm text-muted-foreground mb-1 md:mb-0">
            Nickname:
          </button>
          <div className="w-full md:w-auto">
            <Input
              onChange={(e) => onSetNickname(e.target.value)}
              placeholder="Anonymous"
              className="border-zinc-400 w-full md:w-48 h-8 md:h-full dark:border-zinc-700"
            />
          </div>
        </div>

        <button
          onClick={() => setAiEnabled(prev => !prev)}
          className={`w-24 px-2 h-9 flex items-center justify-between rounded-full transition-all duration-300 overflow-hidden
          ${aiEnabled ? "bg-amber-500 text-black" : "bg-gray-300 text-gray-600"}`}
        >
          {aiEnabled&& (
            <span className="text-sm font-bold transition-all duration-300 text-yellow-800 ml-1">
              AI
            </span>
          ) }
          <span
            className={`w-6 h-6 bg-zinc-600 rounded-full shadow-md transition-all duration-300 transform
            ${aiEnabled ? "translate-x-1" : "translate-x-0"}`}
          ></span>

          {!aiEnabled && (
            <span
            className="text-sm font-bold transition-all duration-300"
          >
            AI
          </span>
          )
            
          }

        </button>





        {/* Disclaimer Section */}
        <div className="flex w-full md:ml-10 justify-center md:justify-start text-xs text-muted-foreground">
          <strong className="hidden md:block mr-1">Disclaimer:</strong> Don't take things seriously
        </div>
      </div>


    </div>
  )
}

