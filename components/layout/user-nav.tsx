"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAuthTokens, getUserFromToken } from "@/lib/token_utils";
import api from "@/lib/api_client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, LogOut, Settings } from "lucide-react";

export function UserNav() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; initials: string } | null>(null);

    useEffect(() => {
        // Determine user details from token
        const userData = getUserFromToken();
        if (userData) {
            // Assuming the token payload has 'name' and 'email'. If not, fallback or adjust.
            // Based on typical JWT payloads, these might be 'name' or 'email'. 
            // Adjusting to what we likely have or standard defaults for now.
            // The CustomJwtPayload interface in token_utils might need updates if these fields aren't there.
            // For now, I'll cast or safely access.
            const name = (userData as any).name || "Admin User";
            const email = (userData as any).email || "admin@example.com";
            const initials = name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2);

            setUser({ name, email, initials });
        }
    }, []);

    const handleLogout = async () => {
        try {
            // Attempt API logout (fire and forget mostly, but good to try)
            // We use a try-catch to ensure we clear local state even if API fails
            await api.post("/admin/auth/logout").catch(() => {
                console.warn("Logout API call failed, but clearing local session anyway.");
            });

            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            // ALWAYS clear tokens and redirect
            clearAuthTokens();
            router.refresh(); // Clear Next.js cache
            router.push("/login"); // Redirect to login
        }
    };

    if (!user) {
        return (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>...</AvatarFallback>
                </Avatar>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt={user.name} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
