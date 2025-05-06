"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnalogTimerProps {
  hours: number
  minutes: number
  seconds: number
  textColor: string
  isCompleted?: boolean
}

export function AnalogTimer({ hours, minutes, seconds, textColor, isCompleted = false }: AnalogTimerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getColor = () => {
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const color = getColor()

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Draw clock face
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6
      const x1 = centerX + (radius - 15) * Math.sin(angle)
      const y1 = centerY - (radius - 15) * Math.cos(angle)
      const x2 = centerX + radius * Math.sin(angle)
      const y2 = centerY - radius * Math.cos(angle)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Calculate total seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds

    // Calculate angles
    const hoursAngle = (totalSeconds / 43200) * 2 * Math.PI - Math.PI / 2
    const minutesAngle = ((minutes * 60 + seconds) / 3600) * 2 * Math.PI - Math.PI / 2
    const secondsAngle = (seconds / 60) * 2 * Math.PI - Math.PI / 2

    // Draw hour hand
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius * 0.5 * Math.cos(hoursAngle), centerY + radius * 0.5 * Math.sin(hoursAngle))
    ctx.strokeStyle = color
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw minute hand
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius * 0.7 * Math.cos(minutesAngle), centerY + radius * 0.7 * Math.sin(minutesAngle))
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw second hand
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius * 0.9 * Math.cos(secondsAngle), centerY + radius * 0.9 * Math.sin(secondsAngle))
    ctx.strokeStyle = color === "#FFFFFF" ? "#CCCCCC" : `${color}88`
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()

    // Draw digital time below
    ctx.font = "20px monospace"
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.fillText(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      centerX,
      centerY + radius + 30,
    )
  }, [hours, minutes, seconds, textColor])

  return (
    <div className={cn("flex flex-col items-center justify-center", isCompleted ? "animate-pulse" : "")}>
      <canvas ref={canvasRef} width={300} height={350} className="max-w-full" />
    </div>
  )
}
