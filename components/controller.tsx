"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Joystick } from "@/components/joystick"
import { Battery, Droplets } from "lucide-react"

interface ControllerProps {
  isConnected: boolean
}

export function Controller({ isConnected }: ControllerProps) {
  const [servoPosition, setServoPosition] = useState([90])
  const [pumpActive, setPumpActive] = useState(false)
  const [leftJoystick, setLeftJoystick] = useState({ x: 0, y: 0 })
  const [rightJoystick, setRightJoystick] = useState({ x: 0, y: 0 })

  // Nilai yang ditampilkan berdasarkan status koneksi
  const batteryLevel = isConnected ? 85 : 0
  const displayLeftJoystick = isConnected ? leftJoystick : { x: 0, y: 0 }
  const displayRightJoystick = isConnected ? rightJoystick : { x: 0, y: 0 }
  const displayServoPosition = isConnected ? servoPosition : [0]

  const sendCommand = (command: string, value?: any) => {
    if (!isConnected) return

    // Simulate sending command to ESP32
    console.log(`Sending command: ${command}`, value)

    // Here you would send the actual Bluetooth command
    // Example: bluetoothCharacteristic.writeValue(new TextEncoder().encode(command))
  }

  useEffect(() => {
    sendCommand("MOVE_LEFT", leftJoystick)
  }, [leftJoystick])

  useEffect(() => {
    sendCommand("MOVE_RIGHT", rightJoystick)
  }, [rightJoystick])

  useEffect(() => {
    sendCommand("SERVO", servoPosition[0])
  }, [servoPosition])

  useEffect(() => {
    sendCommand("PUMP", pumpActive)
  }, [pumpActive])

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Online" : "Offline"}</Badge>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                <span className="text-sm">{batteryLevel}%</span>
                <Progress value={batteryLevel} className="w-20" />
              </div>
            </div>

            <Button
              variant={pumpActive ? "default" : "outline"}
              size="sm"
              onClick={() => setPumpActive(!pumpActive)}
              disabled={!isConnected}
              className="min-w-[80px]"
            >
              <Droplets className="w-4 h-4 mr-2" />
              Pump
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Controller - Desktop */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-6 items-center">
          {/* Left Joystick */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Left Control</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Joystick size={200} onMove={setLeftJoystick} disabled={!isConnected} />
            </CardContent>
          </Card>

          {/* Center Servo Control */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Servo Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Position</label>
                  <span className="text-lg font-bold">{displayServoPosition[0]}°</span>
                </div>
                <Slider
                  value={displayServoPosition}
                  onValueChange={setServoPosition}
                  max={180}
                  min={0}
                  step={1}
                  disabled={!isConnected}
                  className="w-full"
                  orientation="vertical"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Joystick */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Right Control</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Joystick size={200} onMove={setRightJoystick} disabled={!isConnected} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Landscape Layout */}
      <div className="block md:hidden landscape:block portrait:hidden">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between h-48">
              {/* Left Joystick */}
              <div className="flex-shrink-0">
                <Joystick size={140} onMove={setLeftJoystick} disabled={!isConnected} />
              </div>

              {/* Center Servo Control */}
              <div className="flex-1 px-4 flex flex-col items-center justify-center space-y-4">
                <div className="text-center">
                  <label className="text-sm font-medium">Servo</label>
                  <div className="text-xl font-bold">{displayServoPosition[0]}°</div>
                </div>
                <div className="h-32 flex items-center">
                  <Slider
                    value={displayServoPosition}
                    onValueChange={setServoPosition}
                    max={180}
                    min={0}
                    step={1}
                    disabled={!isConnected}
                    orientation="vertical"
                    className="h-full"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Online" : "Offline"}</Badge>
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    <span className="text-sm">{batteryLevel}%</span>
                  </div>
                </div>
              </div>

              {/* Right Joystick */}
              <div className="flex-shrink-0">
                <Joystick size={140} onMove={setRightJoystick} disabled={!isConnected} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Display */}
      <Card>
        <CardHeader>
          <CardTitle>Control Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Left Stick</div>
              <div className="text-sm font-mono">
                X: {displayLeftJoystick.x.toFixed(2)}
                <br />
                Y: {displayLeftJoystick.y.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Right Stick</div>
              <div className="text-sm font-mono">
                X: {displayRightJoystick.x.toFixed(2)}
                <br />
                Y: {displayRightJoystick.y.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Servo</div>
              <div className="text-sm font-mono">{displayServoPosition[0]}°</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Pump</div>
              <div className="text-sm font-mono">{pumpActive && isConnected ? "Active" : "Inactive"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
