import {
    SquareTerminal,
    Bot,
    Settings2,
    Users,
    LayoutDashboard,
    Store,
    Scissors,
    CalendarDays,
    Star,
    ChartPie
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
            title: "Overview",
            url: "/dashboard",
            icon: LayoutDashboard,
            moduleId: "dashboard",
        },
        {
            title: "Saloon Management",
            url: "/dashboard/salons",
            icon: Store,
            moduleId: "salons",
        },
        {
            title: "Service Management",
            url: "/dashboard/settings",
            icon: Scissors,
            moduleId: "settings",
        },
        {
            title: "Stylist Management",
            url: "/dashboard/settings",
            icon: Users,
            moduleId: "settings",
        },
        {
            title: "Booking Management",
            url: "/dashboard/settings",
            icon: CalendarDays,
            moduleId: "settings",
        },
        {
            title: "Ratings & Reviews",
            url: "/dashboard/settings",
            icon: Star,
            moduleId: "settings",
        },
        {
            title: "Reports",
            url: "/dashboard/settings",
            icon: ChartPie,
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
                },
                {
                    title: "State",
                    url: "/dashboard/utility/state",
                },
                {
                    title: "City",
                    url: "/dashboard/utility/city",
                },
                {
                    title: "Service Category",
                    url: "/dashboard/utility/service-category",
                },
                {
                    title: "Salon Category",
                    url: "/dashboard/utility/salon-category",
                }
            ]
        },
    ],
};
