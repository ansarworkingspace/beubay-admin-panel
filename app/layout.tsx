import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ColorThemeProvider } from "@/components/providers/color-theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Towner Admin Panel",
  description: "Professional Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full min-h-screen bg-background text-foreground group-has-[[data-collapsible=icon]]/sidebar-wrapper:pl-0 transition-all duration-300 ease-in-out">
                {children}
              </main>
              <Toaster />
            </SidebarProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
