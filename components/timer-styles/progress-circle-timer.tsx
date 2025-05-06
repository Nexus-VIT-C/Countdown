"use client"

import { cn } from "@/lib/utils"

interface ProgressCircleTimerProps {
  hours: number
  minutes: number
  seconds: number
  textColor: string
  totalSeconds: number
  initialTotalSeconds: number
  isCompleted?: boolean
}

export function ProgressCircleTimer({
  hours,
  minutes,
  seconds,
  textColor,
  totalSeconds,
  initialTotalSeconds,
  isCompleted = false,
}: ProgressCircleTimerProps) {
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

  const getStrokeColor = () => {
    switch (textColor) {
      case "white":
        return "#FFFFFF"
      case "black":
        return "#000000"
      case "red":
        return "#EF4444"
      case "blue":
        return "#3B82F6"
      default:
        return "#FFFFFF"
    }
  }

  // Calculate progress percentage
  const progress = initialTotalSeconds > 0 ? (totalSeconds / initialTotalSeconds) * 100 : 0

  // Calculate circle properties
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("flex items-center justify-center", isCompleted ? "animate-pulse" : "")}>
      <div className="relative">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Background circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-700/20"
          />

          {/* Progress circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="transparent"
            stroke={getStrokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 150 150)"
            className="transition-all duration-500"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn("text-6xl font-bold font-mono tabular-nums", getTextColorClass())}>
            {formatNumber(hours)}:{formatNumber(minutes)}
          </div>
          <div className={cn("text-3xl font-mono tabular-nums mt-2 opacity-70", getTextColorClass())}>
            {formatNumber(seconds)}
          </div>
        </div>
      </div>
    </div>
  )
}
