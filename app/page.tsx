"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BluetoothManager } from "@/components/bluetooth-manager"
import { Controller } from "@/components/controller"
import { SwitchControl } from "@/components/switch-control"
import { Settings } from "@/components/settings"
import {
  Bluetooth,
  Wifi,
  Battery,
  Cpu,
  MemoryStick,
  Gamepad2,
  ToggleLeft,
  ArrowLeft,
  Github,
  Code2,
} from "lucide-react"

type AppMode = "menu" | "controller" | "switch"

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>("menu")
  const [isConnected, setIsConnected] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState({
    name: "Controller",
    battery: 85,
    signal: 92,
    uptime: "2h 34m",
    memory: 67,
    temperature: 42,
  })

  // Data yang ditampilkan berdasarkan status koneksi
  const displayData = isConnected
    ? deviceInfo
    : {
        name: "ESP32-Controller",
        battery: 0,
        signal: 0,
        uptime: "0h 0m",
        memory: 0,
        temperature: 0,
      }

  // Simulasi pembaruan data dari ESP32 setiap 5 detik ketika terhubung
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isConnected) {
      interval = setInterval(() => {
        // Simulasi data yang berubah
        setDeviceInfo((prev) => ({
          ...prev,
          battery: Math.max(1, Math.min(100, prev.battery + Math.floor(Math.random() * 3) - 1)),
          signal: Math.max(1, Math.min(100, prev.signal + Math.floor(Math.random() * 5) - 2)),
          memory: Math.max(1, Math.min(100, prev.memory + Math.floor(Math.random() * 5) - 2)),
          temperature: Math.max(20, Math.min(60, prev.temperature + Math.floor(Math.random() * 3) - 1)),
        }))
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected])

  // Menu Selection Screen
  if (appMode === "menu") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">ESP32 Controller</h1>
            <div className="flex items-center gap-4">
              <BluetoothManager isConnected={isConnected} onConnectionChange={setIsConnected} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 flex-grow">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Control Mode</h2>
            <p className="text-xl text-muted-foreground">Select how you want to control your project device</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Controller Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-6 bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center">
                  <Gamepad2 className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">Controller Mode</CardTitle>
                <CardDescription className="text-base">
                  Manual control with joysticks and servo controls
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                  <li>• Dual joystick control</li>
                  <li>• Servo position control</li>
                  <li>• Pump control</li>
                  <li>• Real-time movement</li>
                </ul>
                <Button onClick={() => setAppMode("controller")} className="w-full" size="lg">
                  Enter Controller Mode
                </Button>
              </CardContent>
            </Card>

            {/* Switch Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-6 bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center">
                  <ToggleLeft className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">Switch Mode</CardTitle>
                <CardDescription className="text-base">Control relays and switches for automation</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                  <li>• Relay controls</li>
                  <li>• LED and fan control</li>
                  <li>• Power management</li>
                  <li>• Batch operations</li>
                </ul>
                <Button onClick={() => setAppMode("switch")} className="w-full" size="lg">
                  Enter Switch Mode
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Connection Status */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Device Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <Badge variant={isConnected ? "default" : "secondary"} className="mb-2">
                      {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Connection</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{displayData.battery}%</div>
                    <p className="text-sm text-muted-foreground">Battery</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{displayData.signal}%</div>
                    <p className="text-sm text-muted-foreground">Signal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer with Credits */}
        <footer className="border-t mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium">ESP32 Bluetooth Controller</p>
                <Badge variant="outline" className="ml-2">
                  v1.0.0
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground text-center md:text-right">
                <p>Developed By Raihan</p>
                <p className="text-xs mt-1">© 2025 All Rights Reserved</p>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/hanzloh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span className="sr-only">GitHub Repository</span>
                </a>
                <Badge variant="secondary" className="text-xs">
                  Controller + Web Bluetooth
                </Badge>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Controller Mode
  if (appMode === "controller") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setAppMode("menu")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
              <h1 className="text-2xl font-bold">Controller Mode</h1>
            </div>
            <div className="flex items-center gap-4">
              <BluetoothManager isConnected={isConnected} onConnectionChange={setIsConnected} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="controller" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="controller">Controller</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="controller">
              <Controller isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                    <Bluetooth className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Badge variant={isConnected ? "default" : "secondary"}>
                        {isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                      {isConnected && <span className="text-sm text-muted-foreground">{displayData.name}</span>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Battery Level</CardTitle>
                    <Battery className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.battery}%</div>
                    <Progress value={displayData.battery} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Signal Strength</CardTitle>
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.signal}%</div>
                    <Progress value={displayData.signal} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.uptime}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.memory}%</div>
                    <Progress value={displayData.memory} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                    <div className="h-4 w-4 rounded-full bg-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.temperature}°C</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Settings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  }

  // Switch Mode
  if (appMode === "switch") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setAppMode("menu")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
              <h1 className="text-2xl font-bold">Switch Mode</h1>
            </div>
            <div className="flex items-center gap-4">
              <BluetoothManager isConnected={isConnected} onConnectionChange={setIsConnected} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="switch" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="switch">Switch Control</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="switch">
              <SwitchControl isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                    <Bluetooth className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Badge variant={isConnected ? "default" : "secondary"}>
                        {isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                      {isConnected && <span className="text-sm text-muted-foreground">{displayData.name}</span>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Battery Level</CardTitle>
                    <Battery className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.battery}%</div>
                    <Progress value={displayData.battery} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Signal Strength</CardTitle>
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.signal}%</div>
                    <Progress value={displayData.signal} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.uptime}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.memory}%</div>
                    <Progress value={displayData.memory} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                    <div className="h-4 w-4 rounded-full bg-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displayData.temperature}°C</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Settings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  }

  return null
}
