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
            url: "/dashboard/overview",
            icon: LayoutDashboard,
            moduleId: "overview",
        },
        {
            title: "Saloon Management",
            url: "/dashboard/salons",
            icon: Store,
            moduleId: "salons",
        },
        {
            title: "Service Management",
            url: "/dashboard/services",
            icon: Scissors,
            moduleId: "services",
        },
        {
            title: "Stylist Management",
            url: "/dashboard/stylist",
            icon: Users,
            moduleId: "settings",
        },
        {
            title: "User Management",
            url: "/dashboard/users",
            icon: Users,
            moduleId: "users",
        },
        {
            title: "Booking Management",
            url: "/dashboard/booking",
            icon: CalendarDays,
            moduleId: "bookings",
        },
        {
            title: "Ratings & Reviews",
            url: "/dashboard/review",
            icon: Star,
            moduleId: "reviews",
        },
        {
            title: "Reports",
            url: "/dashboard/reports",
            icon: ChartPie,
            moduleId: "reports",
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
