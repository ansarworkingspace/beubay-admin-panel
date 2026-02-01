"use client"

import * as React from "react"

export type ThemeColor = "default" | "blue" | "green" | "purple" | "orange"

type ColorThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: ThemeColor
}

type ColorThemeProviderState = {
    theme: ThemeColor
    setTheme: (theme: ThemeColor) => void
}

const initialState: ColorThemeProviderState = {
    theme: "default",
    setTheme: () => null,
}

const ColorThemeContext = React.createContext<ColorThemeProviderState>(initialState)

export function ColorThemeProvider({
    children,
    defaultTheme = "default",
    ...props
}: ColorThemeProviderProps) {
    const [theme, setTheme] = React.useState<ThemeColor>(defaultTheme)

    React.useEffect(() => {
        const root = window.document.body
        root.classList.remove("theme-blue", "theme-green", "theme-purple", "theme-orange")
        if (theme !== "default") {
            root.classList.add(`theme-${theme}`)
        }
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: ThemeColor) => {
            setTheme(theme)
        },
    }

    return (
        <ColorThemeContext.Provider {...props} value={value}>
            {children}
        </ColorThemeContext.Provider>
    )
}

export const useColorTheme = () => {
    const context = React.useContext(ColorThemeContext)

    if (context === undefined)
        throw new Error("useColorTheme must be used within a ColorThemeProvider")

    return context
}
