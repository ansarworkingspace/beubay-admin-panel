import {
    SquareTerminal,
    Bot,
    Settings2,
    Users,
    LayoutDashboard
} from "lucide-react";

export interface NavItem {
    title: string;
    url: string;
    icon?: any;
    items?: {
        title: string;
        url: string;
    }[];
    moduleId?: string; // For permission checking
    isActive?: boolean;
}

export interface SidebarData {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    teams: {
        name: string;
        logo: any;
        plan: string;
    }[];
    navMain: NavItem[]; // Grouped items
}

export const sidebarData: SidebarData = {
    user: {
        name: "Admin User",
        email: "admin@beubay.com",
        avatar: "/avatars/admin.jpg",
    },
    teams: [
        {
            name: "Beubay Inc",
            logo: SquareTerminal,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            moduleId: "dashboard",
        },
        {
            title: "Staff",
            url: "/dashboard/staff",
            icon: Users,
            moduleId: "staff", // Requires 'staff' permission
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings2,
            moduleId: "settings",
        },
        {
            title: "Utility",
            url: "#",
            icon: Bot, // Using Bot as placeholder, user didn't specify icon
            moduleId: "utility",
            items: [
                {
                    title: "Country",
                    url: "/dashboard/utility/country",
                }
            ]
        },
    ],
};
