"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface FlipTimerProps {
  hours: number
  minutes: number
  seconds: number
  textColor: string
  isCompleted?: boolean
}

export function FlipTimer({ hours, minutes, seconds, textColor, isCompleted = false }: FlipTimerProps) {
  const [prevHours, setPrevHours] = useState(hours)
  const [prevMinutes, setPrevMinutes] = useState(minutes)
  const [prevSeconds, setPrevSeconds] = useState(seconds)
  const [flipHours, setFlipHours] = useState(false)
  const [flipMinutes, setFlipMinutes] = useState(false)
  const [flipSeconds, setFlipSeconds] = useState(false)

  useEffect(() => {
    // Check if seconds changed
    if (prevSeconds !== seconds) {
      setFlipSeconds(true)
      setTimeout(() => {
        setPrevSeconds(seconds)
        setFlipSeconds(false)
      }, 500)
    }

    // Check if minutes changed
    if (prevMinutes !== minutes) {
      setFlipMinutes(true)
      setTimeout(() => {
        setPrevMinutes(minutes)
        setFlipMinutes(false)
      }, 500)
    }

    // Check if hours changed
    if (prevHours !== hours) {
      setFlipHours(true)
      setTimeout(() => {
        setPrevHours(hours)
        setFlipHours(false)
      }, 500)
    }
  }, [hours, minutes, seconds, prevHours, prevMinutes, prevSeconds])

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
    <div className={cn("flex items-center justify-center gap-2", isCompleted ? "animate-pulse" : "")}>
      <FlipUnit
        current={formatNumber(hours)}
        previous={formatNumber(prevHours)}
        flip={flipHours}
        textColor={getTextColorClass()}
      />

      <div className={cn("text-4xl font-bold", getTextColorClass())}>:</div>

      <FlipUnit
        current={formatNumber(minutes)}
        previous={formatNumber(prevMinutes)}
        flip={flipMinutes}
        textColor={getTextColorClass()}
      />

      <div className={cn("text-4xl font-bold opacity-70", getTextColorClass())}>:</div>

      <FlipUnit
        current={formatNumber(seconds)}
        previous={formatNumber(prevSeconds)}
        flip={flipSeconds}
        textColor={getTextColorClass()}
        isSeconds
      />
    </div>
  )
}

interface FlipUnitProps {
  current: string
  previous: string
  flip: boolean
  textColor: string
  isSeconds?: boolean
}

function FlipUnit({ current, previous, flip, textColor, isSeconds = false }: FlipUnitProps) {
  return (
    <div className={cn("relative w-24 h-32 flex flex-col", isSeconds ? "opacity-70" : "")}>
      <div className="relative h-full w-full overflow-hidden rounded-lg shadow-md">
        {/* Top half - static part */}
        <div className="absolute top-0 w-full h-1/2 overflow-hidden bg-black/20 backdrop-blur-sm border-b border-black/10 rounded-t-lg z-10">
          <div className="absolute inset-0 flex items-end justify-center pb-0.5">
            <span className={cn("text-5xl font-bold font-mono", textColor)}>{current}</span>
          </div>
        </div>

        {/* Bottom half - static part */}
        <div className="absolute bottom-0 w-full h-1/2 overflow-hidden bg-black/20 backdrop-blur-sm rounded-b-lg z-10">
          <div className="absolute inset-0 flex items-start justify-center pt-0.5">
            <span className={cn("text-5xl font-bold font-mono", textColor)}>{current}</span>
          </div>
        </div>

        {/* Flip card - top half (flips down) */}
        {flip && (
          <div className="absolute top-0 w-full h-1/2 overflow-hidden bg-black/20 backdrop-blur-sm border-b border-black/10 rounded-t-lg z-20 animate-flip-down origin-bottom">
            <div className="absolute inset-0 flex items-end justify-center pb-0.5">
              <span className={cn("text-5xl font-bold font-mono", textColor)}>{previous}</span>
            </div>
          </div>
        )}

        {/* Flip card - bottom half (flips up) */}
        {flip && (
          <div className="absolute bottom-0 w-full h-1/2 overflow-hidden bg-black/20 backdrop-blur-sm rounded-b-lg z-20 animate-flip-up origin-top">
            <div className="absolute inset-0 flex items-start justify-center pt-0.5">
              <span className={cn("text-5xl font-bold font-mono", textColor)}>{current}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
