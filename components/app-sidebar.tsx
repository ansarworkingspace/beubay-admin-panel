"use client"

import * as React from "react"
import Link from "next/link"
import { sidebarData } from "@/data/sidebar-data"
import { usePermissions } from "@/hooks/use-permissions"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarRail,
    SidebarFooter,
    SidebarMenuSkeleton
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { hasPermission, loading } = usePermissions()

    const navItems = React.useMemo(() => {
        if (loading) return [];
        return sidebarData.navMain.filter(item => hasPermission(item.moduleId));
    }, [loading, hasPermission]);

    if (loading) {
        return (
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    {/* Skeleton Header */}
                    <div className="flex items-center gap-2 px-2 py-2">
                        <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
                        <div className="h-4 w-20 bg-muted animate-pulse rounded group-data-[collapsible=icon]:hidden" />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {[1, 2, 3, 4].map((i) => (
                                    <SidebarMenuItem key={i}>
                                        <SidebarMenuSkeleton showIcon />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
        );
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                        B
                    </div>
                    <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Beubay</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {/* Footer content if needed */}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
