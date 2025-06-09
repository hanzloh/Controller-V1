"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bluetooth, BluetoothConnected } from "lucide-react"

interface BluetoothManagerProps {
  isConnected: boolean
  onConnectionChange: (connected: boolean) => void
}

export function BluetoothManager({ isConnected, onConnectionChange }: BluetoothManagerProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Fungsi untuk memperbarui data perangkat saat terhubung
  const updateDeviceData = (connected: boolean) => {
    onConnectionChange(connected)

    // Di sini Anda bisa menambahkan kode untuk memperbarui data perangkat
    // dari ESP32 ketika terhubung
  }

  const connectBluetooth = async () => {
    if (!navigator.bluetooth) {
      toast({
        title: "Bluetooth not supported",
        description: "Your browser doesn't support Web Bluetooth API",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "ESP32" }],
        optionalServices: ["12345678-1234-1234-1234-123456789abc"],
      })

      const server = await device.gatt?.connect()

      if (server) {
        updateDeviceData(true)
        toast({
          title: "Connected",
          description: `Connected to ${device.name}`,
        })
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to ESP32 device",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    onConnectionChange(false)
    toast({
      title: "Disconnected",
      description: "Disconnected from ESP32 device",
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "default" : "secondary"}>
        {isConnected ? <BluetoothConnected className="w-3 h-3 mr-1" /> : <Bluetooth className="w-3 h-3 mr-1" />}
        {isConnected ? "Connected" : "Disconnected"}
      </Badge>

      {isConnected ? (
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={connectBluetooth} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect"}
        </Button>
      )}
    </div>
  )
}
