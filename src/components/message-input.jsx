"use client"

import { useState, useRef,useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

import ReplyPreview from "./ReplyPreview.jsx";

export default function MessageInput({ onSendMessage, onSetNickname,replyingTo,
  onCancelReply }) {
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


      <div className="flex items-center gap-2 mt-4">
        <div className="flex justify-center items-center">
          <button className="text-xs cursor-default px-4 h-9 rounded-sm text-muted-foreground mb-1 block">

            Nickname :
          </button>
          <div className="">
            <Input
              onChange={(e) => onSetNickname(e.target.value)}
              placeholder="Anonymous"
              className=" border-zinc-400 w-1/2 md:w-full dark:border-zinc-700"
            />

          </div>
        </div>
      </div>

    </div>
  )
}

