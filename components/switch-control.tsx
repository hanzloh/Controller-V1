"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Lightbulb,
  Fan,
  Zap,
  Home,
  Car,
  Wifi,
  Battery,
  Power,
  RotateCcw,
  Settings,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Save,
  Tv,
  Speaker,
  Smartphone,
  Printer,
  Coffee,
  Lamp,
  Refrigerator,
  AirVent,
  Plug,
  Siren,
  Thermometer,
  Droplets,
  Gamepad,
  Camera,
  Radio,
  Projector,
  Microwave,
  Laptop,
} from "lucide-react"

interface SwitchControlProps {
  isConnected: boolean
}

interface RelayState {
  id: number
  name: string
  icon: string
  state: boolean
  description: string
  pin: number
}

// Available icons for selection
const availableIcons = [
  { name: "Lightbulb", component: <Lightbulb className="w-5 h-5" /> },
  { name: "Fan", component: <Fan className="w-5 h-5" /> },
  { name: "Zap", component: <Zap className="w-5 h-5" /> },
  { name: "Home", component: <Home className="w-5 h-5" /> },
  { name: "Car", component: <Car className="w-5 h-5" /> },
  { name: "Wifi", component: <Wifi className="w-5 h-5" /> },
  { name: "Tv", component: <Tv className="w-5 h-5" /> },
  { name: "Speaker", component: <Speaker className="w-5 h-5" /> },
  { name: "Smartphone", component: <Smartphone className="w-5 h-5" /> },
  { name: "Printer", component: <Printer className="w-5 h-5" /> },
  { name: "Coffee", component: <Coffee className="w-5 h-5" /> },
  { name: "Lamp", component: <Lamp className="w-5 h-5" /> },
  { name: "Refrigerator", component: <Refrigerator className="w-5 h-5" /> },
  { name: "AirVent", component: <AirVent className="w-5 h-5" /> },
  { name: "Plug", component: <Plug className="w-5 h-5" /> },
  { name: "Siren", component: <Siren className="w-5 h-5" /> },
  { name: "Thermometer", component: <Thermometer className="w-5 h-5" /> },
  { name: "Droplets", component: <Droplets className="w-5 h-5" /> },
  { name: "Gamepad", component: <Gamepad className="w-5 h-5" /> },
  { name: "Camera", component: <Camera className="w-5 h-5" /> },
  { name: "Radio", component: <Radio className="w-5 h-5" /> },
  { name: "Projector", component: <Projector className="w-5 h-5" /> },
  { name: "Microwave", component: <Microwave className="w-5 h-5" /> },
  { name: "Laptop", component: <Laptop className="w-5 h-5" /> },
]

// Function to get icon component by name
const getIconByName = (name: string) => {
  const icon = availableIcons.find((icon) => icon.name === name)
  return icon ? icon.component : <Lightbulb className="w-5 h-5" />
}

// Available ESP32 pins for selection
const availablePins = [2, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 39]

export function SwitchControl({ isConnected }: SwitchControlProps) {
  const { toast } = useToast()
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [editingRelay, setEditingRelay] = useState<RelayState | null>(null)
  const [isAddingRelay, setIsAddingRelay] = useState(false)
  const [newRelay, setNewRelay] = useState<Omit<RelayState, "id" | "state">>({
    name: "",
    icon: "Lightbulb",
    description: "",
    pin: 2,
  })

  const [relays, setRelays] = useState<RelayState[]>([
    {
      id: 1,
      name: "LED Strip",
      icon: "Lightbulb",
      state: false,
      description: "RGB LED Strip Lighting",
      pin: 2,
    },
    {
      id: 2,
      name: "Cooling Fan",
      icon: "Fan",
      state: false,
      description: "12V Cooling Fan",
      pin: 4,
    },
    {
      id: 3,
      name: "Main Power",
      icon: "Zap",
      state: false,
      description: "Main Power Supply",
      pin: 5,
    },
    {
      id: 4,
      name: "Room Light",
      icon: "Home",
      state: false,
      description: "Room Lighting Control",
      pin: 18,
    },
    {
      id: 5,
      name: "Motor Driver",
      icon: "Car",
      state: false,
      description: "DC Motor Driver",
      pin: 19,
    },
    {
      id: 6,
      name: "WiFi Module",
      icon: "Wifi",
      state: false,
      description: "External WiFi Module",
      pin: 21,
    },
  ])

  // Reset semua relay ketika tidak terhubung
  useEffect(() => {
    if (!isConnected) {
      setRelays((prev) => prev.map((relay) => ({ ...relay, state: false })))
      setBatteryLevel(0)
    } else {
      setBatteryLevel(85)
    }
  }, [isConnected])

  const sendRelayCommand = (relayId: number, state: boolean, pin: number) => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to ESP32 first",
        variant: "destructive",
      })
      return
    }

    // Simulate sending command to ESP32
    const command = `RELAY_${pin}_${state ? "ON" : "OFF"}`
    console.log(`Sending command: ${command}`)

    // Here you would send the actual Bluetooth command
    // Example: bluetoothCharacteristic.writeValue(new TextEncoder().encode(command))

    toast({
      title: `Relay ${relayId} ${state ? "ON" : "OFF"}`,
      description: `Pin ${pin} has been turned ${state ? "on" : "off"}`,
    })
  }

  const toggleRelay = (relayId: number) => {
    setRelays((prev) =>
      prev.map((relay) => {
        if (relay.id === relayId) {
          const newState = !relay.state
          sendRelayCommand(relayId, newState, relay.pin)
          return { ...relay, state: newState }
        }
        return relay
      }),
    )
  }

  const toggleAllRelays = (state: boolean) => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to ESP32 first",
        variant: "destructive",
      })
      return
    }

    setRelays((prev) =>
      prev.map((relay) => {
        sendRelayCommand(relay.id, state, relay.pin)
        return { ...relay, state }
      }),
    )

    toast({
      title: `All Relays ${state ? "ON" : "OFF"}`,
      description: `All relays have been turned ${state ? "on" : "off"}`,
    })
  }

  const handleEditRelay = () => {
    if (!editingRelay) return

    // Check if pin is already used by another relay
    const pinUsed = relays.some((relay) => relay.id !== editingRelay.id && relay.pin === editingRelay.pin)
    if (pinUsed) {
      toast({
        title: "Pin already in use",
        description: `Pin ${editingRelay.pin} is already assigned to another relay`,
        variant: "destructive",
      })
      return
    }

    setRelays((prev) =>
      prev.map((relay) => {
        if (relay.id === editingRelay.id) {
          return editingRelay
        }
        return relay
      }),
    )

    toast({
      title: "Relay Updated",
      description: `Relay ${editingRelay.name} has been updated`,
    })

    setEditingRelay(null)
  }

  const handleAddRelay = () => {
    // Validate form
    if (!newRelay.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the relay",
        variant: "destructive",
      })
      return
    }

    // Check if pin is already used
    const pinUsed = relays.some((relay) => relay.pin === newRelay.pin)
    if (pinUsed) {
      toast({
        title: "Pin already in use",
        description: `Pin ${newRelay.pin} is already assigned to another relay`,
        variant: "destructive",
      })
      return
    }

    // Generate new ID (max + 1)
    const newId = relays.length > 0 ? Math.max(...relays.map((r) => r.id)) + 1 : 1

    // Add new relay
    const relay: RelayState = {
      id: newId,
      name: newRelay.name,
      icon: newRelay.icon,
      description: newRelay.description,
      pin: newRelay.pin,
      state: false,
    }

    setRelays((prev) => [...prev, relay])

    // Reset form
    setNewRelay({
      name: "",
      icon: "Lightbulb",
      description: "",
      pin: 2,
    })

    setIsAddingRelay(false)

    toast({
      title: "Relay Added",
      description: `New relay "${relay.name}" has been added`,
    })
  }

  const handleDeleteRelay = (id: number) => {
    const relay = relays.find((r) => r.id === id)
    if (!relay) return

    setRelays((prev) => prev.filter((r) => r.id !== id))

    toast({
      title: "Relay Deleted",
      description: `Relay "${relay.name}" has been deleted`,
    })
  }

  const activeRelays = relays.filter((relay) => relay.state).length
  const totalRelays = relays.length

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
                <span className="text-sm">{isConnected ? batteryLevel : 0}%</span>
                <Progress value={isConnected ? batteryLevel : 0} className="w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4" />
                <span className="text-sm">
                  {activeRelays}/{totalRelays} Active
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleAllRelays(true)} disabled={!isConnected}>
                <Power className="w-4 h-4 mr-2" />
                All ON
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleAllRelays(false)} disabled={!isConnected}>
                <RotateCcw className="w-4 h-4 mr-2" />
                All OFF
              </Button>
              <Dialog open={isAddingRelay} onOpenChange={setIsAddingRelay}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Relay
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Relay</DialogTitle>
                    <DialogDescription>Create a new relay to control with your ESP32</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="relay-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="relay-name"
                        value={newRelay.name}
                        onChange={(e) => setNewRelay({ ...newRelay, name: e.target.value })}
                        className="col-span-3"
                        placeholder="e.g. Kitchen Light"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="relay-description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="relay-description"
                        value={newRelay.description}
                        onChange={(e) => setNewRelay({ ...newRelay, description: e.target.value })}
                        className="col-span-3"
                        placeholder="e.g. Controls kitchen ceiling light"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="relay-pin" className="text-right">
                        ESP32 Pin
                      </Label>
                      <Select
                        value={newRelay.pin.toString()}
                        onValueChange={(value) => setNewRelay({ ...newRelay, pin: Number.parseInt(value) })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a pin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Available Pins</SelectLabel>
                            {availablePins.map((pin) => (
                              <SelectItem key={pin} value={pin.toString()}>
                                GPIO {pin}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="relay-icon" className="text-right">
                        Icon
                      </Label>
                      <Select
                        value={newRelay.icon}
                        onValueChange={(value) => setNewRelay({ ...newRelay, icon: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Available Icons</SelectLabel>
                            {availableIcons.map((icon) => (
                              <SelectItem key={icon.name} value={icon.name}>
                                <div className="flex items-center gap-2">
                                  {icon.component}
                                  <span>{icon.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingRelay(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddRelay}>Add Relay</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relay Controls */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relays.map((relay) => (
          <Card key={relay.id} className={`transition-all ${relay.state && isConnected ? "ring-2 ring-primary" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${relay.state && isConnected ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {getIconByName(relay.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{relay.name}</CardTitle>
                    <CardDescription className="text-xs">Pin {relay.pin}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <Dialog
                      open={editingRelay?.id === relay.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setEditingRelay(relay)
                        } else {
                          setEditingRelay(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Relay</DialogTitle>
                          <DialogDescription>Make changes to your relay configuration</DialogDescription>
                        </DialogHeader>

                        {editingRelay && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="edit-name"
                                value={editingRelay.name}
                                onChange={(e) => setEditingRelay({ ...editingRelay, name: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-description" className="text-right">
                                Description
                              </Label>
                              <Input
                                id="edit-description"
                                value={editingRelay.description}
                                onChange={(e) => setEditingRelay({ ...editingRelay, description: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-pin" className="text-right">
                                ESP32 Pin
                              </Label>
                              <Select
                                value={editingRelay.pin.toString()}
                                onValueChange={(value) =>
                                  setEditingRelay({ ...editingRelay, pin: Number.parseInt(value) })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select a pin" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Available Pins</SelectLabel>
                                    {availablePins.map((pin) => (
                                      <SelectItem key={pin} value={pin.toString()}>
                                        GPIO {pin}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-icon" className="text-right">
                                Icon
                              </Label>
                              <Select
                                value={editingRelay.icon}
                                onValueChange={(value) => setEditingRelay({ ...editingRelay, icon: value })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Available Icons</SelectLabel>
                                    {availableIcons.map((icon) => (
                                      <SelectItem key={icon.name} value={icon.name}>
                                        <div className="flex items-center gap-2">
                                          {icon.component}
                                          <span>{icon.name}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingRelay(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditRelay}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => handleDeleteRelay(relay.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{relay.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: {relay.state && isConnected ? "Active" : "Inactive"}
                  </p>
                </div>
                <Switch
                  checked={relay.state && isConnected}
                  onCheckedChange={() => toggleRelay(relay.id)}
                  disabled={!isConnected}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {relays.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Relays Added</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
              You haven't added any relays yet. Click the "Add Relay" button to create your first relay control.
            </p>
            <Button onClick={() => setIsAddingRelay(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Relay
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Relay Status Summary */}
      {relays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Relay Status Summary
            </CardTitle>
            <CardDescription>Overview of all relay states and pin assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3">Active Relays</h4>
                <div className="space-y-2">
                  {relays.filter((relay) => relay.state && isConnected).length > 0 ? (
                    relays
                      .filter((relay) => relay.state && isConnected)
                      .map((relay) => (
                        <div key={relay.id} className="flex items-center gap-2 text-sm">
                          {getIconByName(relay.icon)}
                          <span>{relay.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            Pin {relay.pin}
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No active relays</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Pin Mapping</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {relays.map((relay) => (
                    <div key={relay.id} className="flex justify-between">
                      <span>Pin {relay.pin}:</span>
                      <span
                        className={relay.state && isConnected ? "text-primary font-medium" : "text-muted-foreground"}
                      >
                        {relay.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Total Relays: <span className="font-medium">{relays.length}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Active: </span>
              <span className="font-medium">{activeRelays}</span>
              <span className="text-muted-foreground"> / Inactive: </span>
              <span className="font-medium">{totalRelays - activeRelays}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
