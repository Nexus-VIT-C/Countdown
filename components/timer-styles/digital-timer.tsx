"use client"

import { cn } from "@/lib/utils"

interface DigitalTimerProps {
  hours: number
  minutes: number
  seconds: number
  textColor: string
  isCompleted?: boolean
}

export function DigitalTimer({ hours, minutes, seconds, textColor, isCompleted = false }: DigitalTimerProps) {
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0")
  }

  const getTextColorClass = () => {
    switch (textColor) {
      case "white":
        return "text-white"
      case "black":
        return "text-black"
      case "red":
        return "text-red-500"
      case "blue":
        return "text-blue-500"
      default:
        return "text-white"
    }
  }

  return (
    <div className={cn("flex items-center justify-center", isCompleted ? "animate-pulse" : "")}>
      <div className={cn("text-8xl font-bold font-mono tabular-nums tracking-tight", getTextColorClass())}>
        <span>{formatNumber(hours)}</span>
        <span className="mx-2">:</span>
        <span>{formatNumber(minutes)}</span>
        <span className={cn("mx-2 text-opacity-70", getTextColorClass())}>:</span>
        <span className={cn("text-opacity-70", getTextColorClass())}>{formatNumber(seconds)}</span>
      </div>
    </div>
  )
}
