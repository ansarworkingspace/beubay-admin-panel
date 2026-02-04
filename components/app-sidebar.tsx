"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { hasPermission, loading } = usePermissions()
    const pathname = usePathname()

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
                            {navItems.map((item) => {
                                // Check if main item is active (only if it has no sub-items)
                                const isMainActive = item.items?.length === 0 && (item.url === "/" ? pathname === "/" : pathname?.startsWith(item.url));

                                return (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={item.isActive || pathname?.startsWith(item.url)}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    tooltip={item.title}
                                                    isActive={Boolean(isMainActive)}
                                                    className="data-[active=true]:bg-black data-[active=true]:text-white dark:data-[active=true]:bg-[#7C3AED] dark:data-[active=true]:text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                >
                                                    {item.icon && <item.icon />}
                                                    {item.items && item.items.length > 0 ? (
                                                        <>
                                                            <span>{item.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </>
                                                    ) : (
                                                        <Link href={item.url} className="flex-1 flex items-center gap-2">
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            {item.items && item.items.length > 0 && (
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items.map((subItem) => {
                                                            const isSubActive = pathname === subItem.url;
                                                            return (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isSubActive}
                                                                        className="data-[active=true]:bg-black data-[active=true]:text-white dark:data-[active=true]:bg-[#7C3AED] dark:data-[active=true]:text-white"
                                                                    >
                                                                        <Link href={subItem.url}>
                                                                            <span>{subItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            )
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            )}
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            })}
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
