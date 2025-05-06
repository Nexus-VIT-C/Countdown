"use client"

import { useState, useEffect } from "react"
import { HackathonTimer } from "@/components/hackathon-timer"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function Home() {
  const { toast } = useToast()

  // Timer mode state
  const [timerMode, setTimerMode] = useState<"duration" | "endTime">("duration")

  // Timer state
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Timer values
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [endTime, setEndTime] = useState<Date | null>(null)

  // Sidebar states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

  // Design customization
  const [timerStyle, setTimerStyle] = useLocalStorage("timerStyle", "digital")
  const [layoutStyle, setLayoutStyle] = useLocalStorage("layoutStyle", "centered")
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage("isDarkTheme", false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null)
  const [textColor, setTextColor] = useLocalStorage("textColor", "white")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Handle timer completion
  useEffect(() => {
    if (isCompleted) {
      toast({
        title: "Time's up!",
        description: "Your hackathon countdown has completed!",
      })
    }
  }, [isCompleted, toast])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        })
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setIsCompleted(false)
    setHours(0)
    setMinutes(0)
    setSeconds(0)
    setEndTime(null)
  }

  return (
    <ThemeProvider enableSystem attribute="class" defaultTheme={isDarkTheme ? "dark" : "light"}>
      <div className="min-h-screen flex flex-col">
        <LeftSidebar
          isOpen={leftSidebarOpen}
          setIsOpen={setLeftSidebarOpen}
          timerMode={timerMode}
          setTimerMode={setTimerMode}
          resetTimer={resetTimer}
        />

        <RightSidebar
          isOpen={rightSidebarOpen}
          setIsOpen={setRightSidebarOpen}
          timerStyle={timerStyle}
          setTimerStyle={setTimerStyle}
          layoutStyle={layoutStyle}
          setLayoutStyle={setLayoutStyle}
          isDarkTheme={isDarkTheme}
          setIsDarkTheme={setIsDarkTheme}
          textColor={textColor}
          setTextColor={setTextColor}
          setLogoUrl={setLogoUrl}
          setBackgroundUrl={setBackgroundUrl}
        />

        <HackathonTimer
          timerMode={timerMode}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          hours={hours}
          setHours={setHours}
          minutes={minutes}
          setMinutes={setMinutes}
          seconds={seconds}
          setSeconds={setSeconds}
          endTime={endTime}
          setEndTime={setEndTime}
          timerStyle={timerStyle}
          layoutStyle={layoutStyle}
          logoUrl={logoUrl}
          backgroundUrl={backgroundUrl}
          textColor={textColor}
          resetTimer={resetTimer}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          setLeftSidebarOpen={setLeftSidebarOpen}
          setRightSidebarOpen={setRightSidebarOpen}
          isDarkTheme={isDarkTheme}
          setIsDarkTheme={setIsDarkTheme}
        />

        <Toaster />
      </div>
    </ThemeProvider>
  )
}
