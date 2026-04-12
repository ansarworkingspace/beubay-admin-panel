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
    ChartPie,
    CreditCard,
    FileText,
    LifeBuoy
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
            url: "#",
            icon: CalendarDays,
            moduleId: "bookings",
            items: [
                {
                    title: "All Booking",
                    url: "/dashboard/bookings",
                },
                {
                    title: "Past",
                    url: "/dashboard/bookings?type=past",
                },
                {
                    title: "Upcoming",
                    url: "/dashboard/bookings?type=upcoming",
                }
            ]
        },
        {
            title: "Transaction Management",
            url: "#",
            icon: CreditCard,
            moduleId: "transactions",
            items: [
                {
                    title: "Initiated",
                    url: "/dashboard/transactions?status=initiated",
                },
                {
                    title: "Success",
                    url: "/dashboard/transactions?status=success",
                },
                {
                    title: "Failed",
                    url: "/dashboard/transactions?status=failed",
                },
                {
                    title: "Pending",
                    url: "/dashboard/transactions?status=pending",
                },
                {
                    title: "Refunded",
                    url: "/dashboard/transactions?status=refunded",
                }
            ]
        },
        {
            title: "Ratings & Reviews",
            url: "/dashboard/reviews",
            icon: Star,
            moduleId: "reviews",
        },
        {
            title: "Tickets",
            url: "#",
            icon: LifeBuoy,
            moduleId: "tickets",
            items: [
                {
                    title: "All Tickets",
                    url: "/dashboard/tickets",
                },
                {
                    title: "Open Tickets",
                    url: "/dashboard/tickets?status=open",
                },
                {
                    title: "Closed Tickets",
                    url: "/dashboard/tickets?status=closed",
                },
            ]
        },
        {
            title: "Legal Admin",
            url: "/dashboard/legal",
            icon: FileText,
            moduleId: "legal",
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
