"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Play,
  Pause,
  RefreshCw,
  Maximize,
  Minimize,
  ChevronLeft,
  Palette,
  Clock,
  Calendar,
  Sun,
  Moon,
} from "lucide-react"
import { DigitalTimer } from "./timer-styles/digital-timer"
import { FlipTimer } from "./timer-styles/flip-timer"
import { AnalogTimer } from "./timer-styles/analog-timer"
import { ProgressCircleTimer } from "./timer-styles/progress-circle-timer"
import { TimePickerWheel } from "./time-picker-wheel"
import { cn } from "@/lib/utils"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

interface HackathonTimerProps {
  timerMode: "duration" | "endTime"
  isRunning: boolean
  setIsRunning: (value: boolean) => void
  isPaused: boolean
  setIsPaused: (value: boolean) => void
  isCompleted: boolean
  setIsCompleted: (value: boolean) => void
  hours: number
  setHours: (value: number) => void
  minutes: number
  setMinutes: (value: number) => void
  seconds: number
  setSeconds: (value: number) => void
  endTime: Date | null
  setEndTime: (value: Date | null) => void
  timerStyle: string
  layoutStyle: string
  logoUrl: string | null
  backgroundUrl: string | null
  textColor: string
  resetTimer: () => void
  toggleFullscreen: () => void
  isFullscreen: boolean
  setLeftSidebarOpen: (value: boolean) => void
  setRightSidebarOpen: (value: boolean) => void
  isDarkTheme: boolean
  setIsDarkTheme: (value: boolean) => void
}

export function HackathonTimer({
  timerMode,
  isRunning,
  setIsRunning,
  isPaused,
  setIsPaused,
  isCompleted,
  setIsCompleted,
  hours,
  setHours,
  minutes,
  setMinutes,
  seconds,
  setSeconds,
  endTime,
  setEndTime,
  timerStyle,
  layoutStyle,
  logoUrl,
  backgroundUrl,
  textColor,
  resetTimer,
  toggleFullscreen,
  isFullscreen,
  setLeftSidebarOpen,
  setRightSidebarOpen,
  isDarkTheme,
  setIsDarkTheme,
}: HackathonTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedHours, setSelectedHours] = useState(0)
  const [selectedMinutes, setSelectedMinutes] = useState(0)
  const [selectedSeconds, setSelectedSeconds] = useState(0)
  const [selectedEndHour, setSelectedEndHour] = useState(new Date().getHours())
  const [selectedEndMinute, setSelectedEndMinute] = useState(new Date().getMinutes())
  const [selectedEndSecond, setSelectedEndSecond] = useState(new Date().getSeconds())
  const [selectedAmPm, setSelectedAmPm] = useState<"AM" | "PM">(new Date().getHours() >= 12 ? "PM" : "AM")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { width, height } = useWindowSize()
  const [pipPosition, setPipPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const pipRef = useRef<HTMLDivElement>(null)

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format current time
  const formattedCurrentTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && !isCompleted) {
      timerRef.current = setInterval(() => {
        if (timerMode === "duration") {
          if (totalSeconds <= 0) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            setIsCompleted(true)
            setIsRunning(false)
            return
          }

          setTotalSeconds((prev) => prev - 1)

          const h = Math.floor(totalSeconds / 3600)
          const m = Math.floor((totalSeconds % 3600) / 60)
          const s = totalSeconds % 60

          setHours(h)
          setMinutes(m)
          setSeconds(s)
        } else if (timerMode === "endTime" && endTime) {
          const now = new Date()
          const diff = endTime.getTime() - now.getTime()

          if (diff <= 0) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            setIsCompleted(true)
            setIsRunning(false)
            setHours(0)
            setMinutes(0)
            setSeconds(0)
            return
          }

          const h = Math.floor(diff / (1000 * 60 * 60))
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const s = Math.floor((diff % (1000 * 60)) / 1000)

          setHours(h)
          setMinutes(m)
          setSeconds(s)
        }
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [
    isRunning,
    isPaused,
    isCompleted,
    timerMode,
    totalSeconds,
    endTime,
    setHours,
    setMinutes,
    setSeconds,
    setIsCompleted,
    setIsRunning,
  ])

  // Start timer
  const startTimer = () => {
    if (timerMode === "duration") {
      const total = selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds
      if (total <= 0) return

      setTotalSeconds(total)
      setInitialTotalSeconds(total)
      setHours(selectedHours)
      setMinutes(selectedMinutes)
      setSeconds(selectedSeconds)
    } else {
      let hour = selectedEndHour
      if (selectedAmPm === "PM" && hour < 12) {
        hour += 12
      } else if (selectedAmPm === "AM" && hour === 12) {
        hour = 0
      }

      const end = new Date()
      end.setHours(hour)
      end.setMinutes(selectedEndMinute)
      end.setSeconds(selectedEndSecond)

      // If end time is in the past, add a day
      if (end.getTime() <= new Date().getTime()) {
        end.setDate(end.getDate() + 1)
      }

      setEndTime(end)

      const diff = end.getTime() - new Date().getTime()
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)

      setHours(h)
      setMinutes(m)
      setSeconds(s)
    }

    setIsRunning(true)
    setIsPaused(false)
    setIsCompleted(false)
  }

  // Toggle pause/resume
  const togglePause = () => {
    setIsPaused(!isPaused)
    setIsRunning(!isPaused)
  }

  // Render timer component based on style
  const renderTimer = () => {
    const props = {
      hours,
      minutes,
      seconds,
      textColor,
      totalSeconds,
      initialTotalSeconds,
      isCompleted,
    }

    switch (timerStyle) {
      case "flip":
        return <FlipTimer {...props} />
      case "analog":
        return <AnalogTimer {...props} />
      case "progress":
        return <ProgressCircleTimer {...props} />
      default:
        return <DigitalTimer {...props} />
    }
  }

  // PiP mode drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (layoutStyle === "pip" && pipRef.current) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - pipPosition.x,
        y: e.clientY - pipPosition.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && layoutStyle === "pip" && pipRef.current) {
      const newX = Math.max(
        0,
        Math.min(window.innerWidth - (pipRef.current.offsetWidth || 200), e.clientX - dragStart.x),
      )
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - (pipRef.current.offsetHeight || 150), e.clientY - dragStart.y),
      )

      setPipPosition({
        x: newX,
        y: newY,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Format 12-hour time
  const format12Hour = (hour: number) => {
    if (hour === 0 || hour === 12) return 12
    return hour % 12
  }

  // Convert 24-hour to 12-hour format with AM/PM
  const get12HourFormat = (hour: number) => {
    return {
      hour: format12Hour(hour),
      ampm: hour >= 12 ? "PM" : "AM",
    }
  }

  // Initialize end time pickers with current time
  useEffect(() => {
    if (timerMode === "endTime" && !isRunning) {
      const now = new Date()
      const { hour, ampm } = get12HourFormat(now.getHours())

      setSelectedEndHour(hour)
      setSelectedEndMinute(now.getMinutes())
      setSelectedEndSecond(now.getSeconds())
      setSelectedAmPm(ampm as "AM" | "PM")
    }
  }, [timerMode, isRunning])

  return (
    <main
      className={cn(
        "flex-1 flex flex-col items-center justify-center relative transition-all duration-500",
        backgroundUrl ? "bg-cover bg-center" : "bg-background",
      )}
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : {}}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {isCompleted && <Confetti width={width} height={height} recycle={false} />}

      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsDarkTheme(!isDarkTheme)} 
          className="rounded-full transition-all duration-300 hover:shadow-md"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isDarkTheme ? 180 : 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Sun className={cn("h-4 w-4 absolute transition-opacity duration-300", 
              isDarkTheme ? "opacity-100" : "opacity-0")} />
            <Moon className={cn("h-4 w-4 absolute transition-opacity duration-300", 
              isDarkTheme ? "opacity-0" : "opacity-100")} />
          </motion.div>
        </Button>
      </div>

      <div className={cn("absolute bottom-4 left-4 z-10")}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLeftSidebarOpen(true)}
          className="rounded-full"
          aria-label="Choose Mode"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Choose Mode</span>
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="icon" onClick={toggleFullscreen} className="rounded-full">
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={() => setRightSidebarOpen(true)} className="rounded-full">
          <Palette className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={pipRef}
        className={cn(
          "w-full max-w-4xl p-6 flex flex-col items-center justify-center gap-8",
          layoutStyle === "floating" && "bg-black/30 backdrop-blur-sm rounded-xl",
          layoutStyle === "pip" && "max-w-xs bg-black/50 backdrop-blur-sm rounded-xl p-4 cursor-move",
        )}
        style={
          layoutStyle === "pip"
            ? {
                position: "absolute",
                left: `${pipPosition.x}px`,
                top: `${pipPosition.y}px`,
                zIndex: 50,
              }
            : {}
        }
        onMouseDown={handleMouseDown}
      >
        {/* Logo if selected */}
        {layoutStyle === "logo" && logoUrl && (
          <div className="mb-8">
            <img src={logoUrl || "/placeholder.svg"} alt="Logo" className="max-h-24 max-w-full" />
          </div>
        )}

        {/* Timer Display */}
        {!isRunning && !isCompleted ? (
          <Card className="w-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {timerMode === "duration" ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" /> Set Duration
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Set End Time
                  </div>
                )}
              </h2>

              {timerMode === "duration" ? (
                <div className="space-y-6">
                  <div className="flex justify-center gap-4 py-4">
                    <TimePickerWheel value={selectedHours} onChange={setSelectedHours} min={0} max={99} label="Hours" />
                    <TimePickerWheel
                      value={selectedMinutes}
                      onChange={setSelectedMinutes}
                      min={0}
                      max={59}
                      label="Minutes"
                    />
                    <TimePickerWheel
                      value={selectedSeconds}
                      onChange={setSelectedSeconds}
                      min={0}
                      max={59}
                      label="Seconds"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm">Current time: {formattedCurrentTime}</p>

                  <div className="flex justify-center gap-4 py-4">
                    <TimePickerWheel
                      value={selectedEndHour}
                      onChange={setSelectedEndHour}
                      min={1}
                      max={12}
                      label="Hour"
                      padZero={false}
                    />
                    <TimePickerWheel
                      value={selectedEndMinute}
                      onChange={setSelectedEndMinute}
                      min={0}
                      max={59}
                      label="Minute"
                    />
                    <TimePickerWheel
                      value={selectedEndSecond}
                      onChange={setSelectedEndSecond}
                      min={0}
                      max={59}
                      label="Second"
                    />
                    <TimePickerWheel
                      value={selectedAmPm === "AM" ? 0 : 1}
                      onChange={(val) => setSelectedAmPm(val === 0 ? "AM" : "PM")}
                      min={0}
                      max={1}
                      label="AM/PM"
                      padZero={false}
                    />
                  </div>
                </div>
              )}

              <Button
                className="w-full mt-6"
                onClick={startTimer}
                disabled={
                  timerMode === "duration" && selectedHours === 0 && selectedMinutes === 0 && selectedSeconds === 0
                }
              >
                Start Timer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full flex flex-col items-center">
            {renderTimer()}

            <div className="flex gap-4 mt-8">
              <Button variant={isPaused ? "default" : "outline"} size="lg" onClick={togglePause} disabled={isCompleted}>
                {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>

              <Button variant="outline" size="lg" onClick={resetTimer}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
