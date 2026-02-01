"use client"

import * as React from "react"
import { Moon, Sun, Check, Monitor, Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useColorTheme, ThemeColor } from "@/components/providers/color-theme-provider"

export function ThemeSwitcher() {
    const { setTheme: setMode, theme: mode } = useTheme()
    const { setTheme: setColor, theme: color } = useColorTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Palette className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setMode("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {mode === "light" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {mode === "dark" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                    {mode === "system" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
                {(["default", "blue", "green", "purple", "orange"] as ThemeColor[]).map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setColor(c)}>
                        <div className={`mr-2 h-4 w-4 rounded-full border border-border ${c === 'default' ? 'bg-zinc-950 dark:bg-zinc-50' : `theme-${c} bg-primary`}`} />
                        <span className="capitalize">{c}</span>
                        {color === c && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
