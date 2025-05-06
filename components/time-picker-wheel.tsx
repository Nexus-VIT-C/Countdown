"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TimePickerWheelProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  label: string
  padZero?: boolean
}

export function TimePickerWheel({ value, onChange, min, max, label, padZero = true }: TimePickerWheelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)
  const itemHeight = 40 // Height of each time item in pixels
  const scrollTimestampRef = useRef<number>(0)
  const lastScrollPositionRef = useRef<number>(0)

  // Generate the array of options
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  // Format the display value
  const formatValue = (val: number) => {
    return padZero ? val.toString().padStart(2, "0") : val.toString()
  }

  // Scroll to the current value when component mounts or value changes
  useEffect(() => {
    if (scrollRef.current && !isDragging && !isScrolling) {
      const index = options.indexOf(value)
      if (index !== -1) {
        // Add a small delay to ensure the scroll area is fully rendered
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({
              top: index * itemHeight,
              behavior: "smooth",
            })
            // Store this position as our last known position
            lastScrollPositionRef.current = index * itemHeight
          }
        }, 50)
      }
    }
  }, [value, options, isDragging, isScrolling, itemHeight])

  // Calculate inertial scrolling
  const applyInertia = useCallback(() => {
    if (!scrollRef.current || Math.abs(scrollVelocity) < 0.5) {
      setIsScrolling(false)
      
      // Snap to the nearest value
      if (scrollRef.current) {
        const currentPos = scrollRef.current.scrollTop
        const targetIndex = Math.round(currentPos / itemHeight)
        const targetPos = targetIndex * itemHeight
        
        scrollRef.current.scrollTo({
          top: targetPos,
          behavior: "smooth"
        })
        
        // Update the value after snapping
        const newValue = options[Math.min(targetIndex, options.length - 1)]
        if (newValue !== undefined && newValue !== value) {
          onChange(newValue)
        }
      }
      return
    }
    
    if (scrollRef.current) {
      // Apply decreasing velocity with easing
      const newPosition = scrollRef.current.scrollTop + scrollVelocity
      scrollRef.current.scrollTop = newPosition
      
      // Apply friction to velocity (reduce by 5% each frame)
      setScrollVelocity(prev => prev * 0.95)
      
      // Request next animation frame for smooth momentum
      requestAnimationFrame(applyInertia)
    }
  }, [scrollVelocity, options, value, onChange, itemHeight])

  // Handle scroll event to update the value and calculate velocity
  const handleScroll = () => {
    if (!scrollRef.current) return
    
    const scrollTop = scrollRef.current.scrollTop
    const now = performance.now()
    
    // Calculate velocity based on time difference and scroll position change
    if (scrollTimestampRef.current) {
      const timeDelta = now - scrollTimestampRef.current
      if (timeDelta > 0) {
        const posDelta = scrollTop - lastScrollPositionRef.current
        const newVelocity = posDelta / (timeDelta / 16) // Normalize to roughly 60fps
        
        // Update velocity with some smoothing
        setScrollVelocity(prev => (prev * 0.7) + (newVelocity * 0.3))
      }
    }
    
    // Update refs for next calculation
    scrollTimestampRef.current = now
    lastScrollPositionRef.current = scrollTop
    
    // Only update value during active scrolling
    if (isDragging || isScrolling) {
      const index = Math.round(scrollTop / itemHeight)
      const newValue = options[Math.min(index, options.length - 1)]
      
      if (newValue !== undefined && newValue !== value) {
        onChange(newValue)
      }
    }
    
    // Reset the scroll timeout to detect when scrolling stops
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    
    const newTimeout = setTimeout(() => {
      if (!isDragging) {
        // Start inertial scrolling when user stops active scrolling
        setIsScrolling(true)
        requestAnimationFrame(applyInertia)
      }
    }, 100) // Short delay to detect if scrolling has stopped
    
    setScrollTimeout(newTimeout)
  }

  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-medium mb-2 text-muted-foreground">{label}</label>
      <div 
        className="relative w-24 h-[120px] flex flex-col items-center rounded-xl overflow-hidden bg-background/30 backdrop-blur-[2px]"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 -2px 0 rgba(255, 255, 255, 0.1), inset 0 2px 0 rgba(0, 0, 0, 0.05)"
        }}
      >
        {/* Highlight for the selected value - more polished design */}
        <div className="absolute pointer-events-none w-full h-[40px] top-[40px] bg-primary/5 backdrop-blur-sm z-10" />
        
        {/* Gradient overlays for fading effect at top and bottom */}
        <div className="absolute pointer-events-none w-full h-[30px] top-0 bg-gradient-to-b from-background to-transparent z-20 opacity-80" />
        <div className="absolute pointer-events-none w-full h-[30px] bottom-0 bg-gradient-to-t from-background to-transparent z-20 opacity-80" />
        
        {/* Active selection indicator with subtle animation */}
        <motion.div 
          className="absolute pointer-events-none w-[90%] h-[40px] top-[40px] border-y-2 border-primary/30 rounded-sm z-10 mx-auto left-0 right-0"
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            boxShadow: "0 0 12px rgba(0, 0, 0, 0.05)"
          }}
          transition={{ 
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <ScrollArea
          ref={scrollRef}
          className="h-[120px] w-full overflow-hidden"
          onWheel={(e) => {
            setIsDragging(true)
            // Reset velocity on new user interaction
            setScrollVelocity(e.deltaY / 5)
          }}
          onTouchStart={() => {
            setIsDragging(true)
            setIsScrolling(false)
            // Track position for velocity calculation
            if (scrollRef.current) {
              lastScrollPositionRef.current = scrollRef.current.scrollTop
              scrollTimestampRef.current = performance.now()
            }
          }}
          onTouchMove={() => {
            // Update timestamp on each move for proper velocity calculation
            scrollTimestampRef.current = performance.now()
          }}
          onTouchEnd={() => {
            handleScroll()
            setIsDragging(false)
          }}
          onMouseDown={() => {
            setIsDragging(true)
            setIsScrolling(false)
            // Track position for velocity calculation
            if (scrollRef.current) {
              lastScrollPositionRef.current = scrollRef.current.scrollTop
              scrollTimestampRef.current = performance.now()
            }
          }}
          onMouseUp={() => {
            handleScroll()
            setIsDragging(false)
          }}
          onScroll={handleScroll}
        >
          {/* Add empty spaces at the top and bottom to allow scrolling to first and last items */}
          <div className="h-[40px]" />
          {options.map((option) => (
            <motion.div
              key={option}
              className={cn(
                "h-[40px] flex items-center justify-center text-lg font-medium cursor-pointer transition-all duration-200",
                value === option ? "text-primary font-bold" : "text-muted-foreground"
              )}
              onClick={() => onChange(option)}
              whileHover={{ scale: value === option ? 1 : 1.05 }}
              whileTap={{ scale: 0.98 }}
              animate={value === option ? { 
                y: [0, -1, 1, 0],
                transition: { duration: 0.2 }
              } : {}}
            >
              {formatValue(option)}
            </motion.div>
          ))}
          <div className="h-[40px]" />
        </ScrollArea>
      </div>
    </div>
  )
}
