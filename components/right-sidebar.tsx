"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Clock3, CircleDot, LayoutDashboard, Upload, ImageIcon, Layers, Palette, Sun, Moon } from "lucide-react"

interface RightSidebarProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  timerStyle: string
  setTimerStyle: (value: string) => void
  layoutStyle: string
  setLayoutStyle: (value: string) => void
  isDarkTheme: boolean
  setIsDarkTheme: (value: boolean) => void
  textColor: string
  setTextColor: (value: string) => void
  setLogoUrl: (value: string | null) => void
  setBackgroundUrl: (value: string | null) => void
}

export function RightSidebar({
  isOpen,
  setIsOpen,
  timerStyle,
  setTimerStyle,
  layoutStyle,
  setLayoutStyle,
  isDarkTheme,
  setIsDarkTheme,
  textColor,
  setTextColor,
  setLogoUrl,
  setBackgroundUrl,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState("style")

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Design Customization</SheetTitle>
          <SheetDescription>Customize the appearance of your timer</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="style" className="mt-6" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="style">Timer Style</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="space-y-6 pt-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Clock / Time Style</h3>
              <RadioGroup value={timerStyle} onValueChange={setTimerStyle} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital" className="flex items-center">
                    <Clock3 className="mr-2 h-4 w-4" />
                    Digital Timer
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flip" id="flip" />
                  <Label htmlFor="flip" className="flex items-center">
                    <Layers className="mr-2 h-4 w-4" />
                    Flip Timer
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="analog" id="analog" />
                  <Label htmlFor="analog" className="flex items-center">
                    <Clock3 className="mr-2 h-4 w-4" />
                    Analog Timer
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="progress" id="progress" />
                  <Label htmlFor="progress" className="flex items-center">
                    <CircleDot className="mr-2 h-4 w-4" />
                    Progress Circle
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-3">Theme</h3>
              <div className="flex items-center space-x-2">
                <Switch checked={isDarkTheme} onCheckedChange={setIsDarkTheme} id="theme-mode" />
                <Label htmlFor="theme-mode" className="flex items-center">
                  {isDarkTheme ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  )}
                </Label>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium mb-3">Text Color</h3>
              <RadioGroup value={textColor} onValueChange={setTextColor} className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="white" id="white" className="sr-only" />
                  <Label
                    htmlFor="white"
                    className="w-8 h-8 rounded-full bg-white border cursor-pointer ring-offset-2 ring-offset-background data-[state=checked]:ring-2 ring-black"
                    data-state={textColor === "white" ? "checked" : "unchecked"}
                  />
                  <span className="text-xs mt-1">White</span>
                </div>

                <div className="flex flex-col items-center">
                  <RadioGroupItem value="black" id="black" className="sr-only" />
                  <Label
                    htmlFor="black"
                    className="w-8 h-8 rounded-full bg-black border cursor-pointer ring-offset-2 ring-offset-background data-[state=checked]:ring-2 ring-white"
                    data-state={textColor === "black" ? "checked" : "unchecked"}
                  />
                  <span className="text-xs mt-1">Black</span>
                </div>

                <div className="flex flex-col items-center">
                  <RadioGroupItem value="red" id="red" className="sr-only" />
                  <Label
                    htmlFor="red"
                    className="w-8 h-8 rounded-full bg-red-500 border cursor-pointer ring-offset-2 ring-offset-background data-[state=checked]:ring-2 ring-black"
                    data-state={textColor === "red" ? "checked" : "unchecked"}
                  />
                  <span className="text-xs mt-1">Red</span>
                </div>

                <div className="flex flex-col items-center">
                  <RadioGroupItem value="blue" id="blue" className="sr-only" />
                  <Label
                    htmlFor="blue"
                    className="w-8 h-8 rounded-full bg-blue-500 border cursor-pointer ring-offset-2 ring-offset-background data-[state=checked]:ring-2 ring-black"
                    data-state={textColor === "blue" ? "checked" : "unchecked"}
                  />
                  <span className="text-xs mt-1">Blue</span>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6 pt-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Position & Layout Style</h3>
              <RadioGroup value={layoutStyle} onValueChange={setLayoutStyle} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="centered" id="centered" />
                  <Label htmlFor="centered" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Centered Timer Only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="logo" id="logo" />
                  <Label htmlFor="logo" className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Logo on Top, Timer Below
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="floating" id="floating" />
                  <Label htmlFor="floating" className="flex items-center">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Background Image with Floating Timer
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pip" id="pip" />
                  <Label htmlFor="pip" className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    Picture-in-Picture Mode
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {layoutStyle === "logo" && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Upload Logo</h3>
                <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                <p className="text-xs text-muted-foreground">Recommended size: 200x100px, PNG or JPG</p>
              </div>
            )}

            {layoutStyle === "floating" && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Upload Background</h3>
                <Input type="file" accept="image/*" onChange={handleBackgroundUpload} />
                <p className="text-xs text-muted-foreground">Recommended size: 1920x1080px, JPG or PNG</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
