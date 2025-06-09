"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

interface JoystickProps {
  size?: number
  onMove?: (position: { x: number; y: number }) => void
  disabled?: boolean
  className?: string
}

export function Joystick({ size = 200, onMove, disabled = false, className }: JoystickProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)

  const handleSize = size * 0.3
  const maxDistance = (size - handleSize) / 2

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current || disabled) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      let deltaX = clientX - centerX
      let deltaY = clientY - centerY

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX)
        deltaX = Math.cos(angle) * maxDistance
        deltaY = Math.sin(angle) * maxDistance
      }

      const normalizedX = deltaX / maxDistance
      const normalizedY = -deltaY / maxDistance // Invert Y axis

      setPosition({ x: deltaX, y: deltaY })
      onMove?.({ x: normalizedX, y: normalizedY })
    },
    [maxDistance, onMove, disabled],
  )

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled) return
      setIsDragging(true)
      updatePosition(clientX, clientY)
    },
    [updatePosition, disabled],
  )

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || disabled) return
      updatePosition(clientX, clientY)
    },
    [isDragging, updatePosition, disabled],
  )

  const handleEnd = useCallback(() => {
    if (disabled) return
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
    onMove?.({ x: 0, y: 0 })
  }, [onMove, disabled])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    },
    [handleMove],
  )

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    },
    [handleMove],
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      handleEnd()
    },
    [handleEnd],
  )

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd, { passive: false })
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-full border-4 border-muted-foreground/20 bg-muted/50 select-none touch-none",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-grab active:cursor-grabbing",
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Crosshair guides */}
      <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-muted-foreground/10 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 h-full w-0.5 bg-muted-foreground/10 -translate-x-1/2 -translate-y-1/2" />

      {/* Joystick knob */}
      <div
        ref={knobRef}
        className={cn(
          "absolute top-1/2 left-1/2 rounded-full bg-primary shadow-lg transition-colors",
          isDragging && "bg-primary/80",
          disabled && "bg-muted-foreground",
        )}
        style={{
          width: handleSize,
          height: handleSize,
          transform: `translate(${position.x - handleSize / 2}px, ${position.y - handleSize / 2}px)`,
        }}
      >
        {/* Inner circle for better visual feedback */}
        <div className="absolute inset-2 rounded-full bg-primary-foreground/20" />
      </div>

      {/* Direction indicators */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono">↑</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono">↓</div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">←</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">→</div>
    </div>
  )
}
