"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Clock, Timer } from "lucide-react"

interface LeftSidebarProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  timerMode: "duration" | "endTime"
  setTimerMode: (value: "duration" | "endTime") => void
  resetTimer: () => void
}

export function LeftSidebar({ isOpen, setIsOpen, timerMode, setTimerMode, resetTimer }: LeftSidebarProps) {
  const handleModeChange = (mode: "duration" | "endTime") => {
    setTimerMode(mode)
    resetTimer()
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Choose Countdown Mode</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          <Button
            variant={timerMode === "duration" ? "default" : "outline"}
            className="justify-start"
            onClick={() => handleModeChange("duration")}
          >
            <Timer className="mr-2 h-5 w-5" />
            Set by Duration
          </Button>
          <Button
            variant={timerMode === "endTime" ? "default" : "outline"}
            className="justify-start"
            onClick={() => handleModeChange("endTime")}
          >
            <Clock className="mr-2 h-5 w-5" />
            Set by End Time
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
