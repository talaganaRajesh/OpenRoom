"use client"

import { createContext, forwardRef, useContext, useState } from "react"
import { cn } from ".../lib/utils"

const PopoverContext = createContext({})

function Popover({ children, ...props }) {
  const [open, setOpen] = useState(false)
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = forwardRef(({ children, asChild, ...props }, ref) => {
  const { setOpen } = useContext(PopoverContext)

  return (
    <div ref={ref} onClick={() => setOpen((prev) => !prev)} {...props}>
      {children}
    </div>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const { open } = useContext(PopoverContext)

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }

