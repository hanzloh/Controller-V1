"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function Settings() {
  const [settings, setSettings] = useState({
    deviceName: "ESP32-Controller",
    autoConnect: true,
    sensitivity: [75],
    deadzone: [5],
    servoSpeed: [50],
    pumpDuration: [1000],
    batteryAlert: [20],
    connectionTimeout: [30],
    debugMode: false,
    vibration: true,
  })

  const { toast } = useToast()

  const handleSave = () => {
    // Save settings to localStorage or send to ESP32
    localStorage.setItem("esp32-settings", JSON.stringify(settings))
    toast({
      title: "Settings saved",
      description: "Your configuration has been saved successfully.",
    })
  }

  const handleReset = () => {
    setSettings({
      deviceName: "ESP32-Controller",
      autoConnect: true,
      sensitivity: [75],
      deadzone: [5],
      servoSpeed: [50],
      pumpDuration: [1000],
      batteryAlert: [20],
      connectionTimeout: [30],
      debugMode: false,
      vibration: true,
    })
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Configuration</CardTitle>
          <CardDescription>Configure your ESP32 device settings and connection parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                value={settings.deviceName}
                onChange={(e) => setSettings((prev) => ({ ...prev, deviceName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectionTimeout">Connection Timeout (seconds)</Label>
              <Input
                id="connectionTimeout"
                type="number"
                value={settings.connectionTimeout[0]}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    connectionTimeout: [Number.parseInt(e.target.value) || 30],
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Connect</Label>
              <p className="text-sm text-muted-foreground">Automatically connect to the last known device</p>
            </div>
            <Switch
              checked={settings.autoConnect}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoConnect: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Control Settings</CardTitle>
          <CardDescription>Adjust joystick sensitivity and control parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Joystick Sensitivity</Label>
              <span className="text-sm text-muted-foreground">{settings.sensitivity[0]}%</span>
            </div>
            <Slider
              value={settings.sensitivity}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, sensitivity: value }))}
              max={100}
              min={1}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Deadzone</Label>
              <span className="text-sm text-muted-foreground">{settings.deadzone[0]}%</span>
            </div>
            <Slider
              value={settings.deadzone}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, deadzone: value }))}
              max={20}
              min={0}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Servo Speed</Label>
              <span className="text-sm text-muted-foreground">{settings.servoSpeed[0]}%</span>
            </div>
            <Slider
              value={settings.servoSpeed}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, servoSpeed: value }))}
              max={100}
              min={1}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Pump Duration (ms)</Label>
              <span className="text-sm text-muted-foreground">{settings.pumpDuration[0]}ms</span>
            </div>
            <Slider
              value={settings.pumpDuration}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, pumpDuration: value }))}
              max={5000}
              min={100}
              step={100}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alerts & Notifications</CardTitle>
          <CardDescription>Configure battery alerts and notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Battery Alert Level</Label>
              <span className="text-sm text-muted-foreground">{settings.batteryAlert[0]}%</span>
            </div>
            <Slider
              value={settings.batteryAlert}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, batteryAlert: value }))}
              max={50}
              min={5}
              step={5}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vibration Feedback</Label>
              <p className="text-sm text-muted-foreground">Enable haptic feedback for mobile devices</p>
            </div>
            <Switch
              checked={settings.vibration}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, vibration: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Debug Mode</Label>
              <p className="text-sm text-muted-foreground">Show detailed connection and command logs</p>
            </div>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, debugMode: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Advanced configuration options for power users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Bluetooth Service UUID</Label>
              <Input value="12345678-1234-1234-1234-123456789abc" readOnly className="font-mono text-sm" />
            </div>

            <div className="space-y-2">
              <Label>Command Protocol</Label>
              <Select defaultValue="json">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="binary">Binary</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">
          Save Settings
        </Button>
        <Button variant="outline" onClick={handleReset} className="flex-1">
          Reset to Default
        </Button>
      </div>
    </div>
  )
}
