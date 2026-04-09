export interface BookingStats {
    total: number;
    initiated: number;
    confirmed: number;
}

export interface PlatformStats {
    total_salons: number;
    total_stylists: number;
    total_service_categories: number;
}

export interface TransactionStats {
    total_amount: number;
    completed_amount: number;
}

export interface ServiceCategoryStat {
    name: string;
    count: number;
}

export interface SalonBookingStat {
    salon_name: string;
    count: number;
}

export interface SalonRevenueStat {
    salon_name: string;
    total_revenue: number;
}

export interface UserStat {
    name: string;
    count: number;
    profile_image: string;
}

export interface AnalyticsSummary {
    period: string;
    date_range: {
        from: string;
        to: string;
    };
    bookings: BookingStats;
    platform: PlatformStats;
    most_used_service_categories: ServiceCategoryStat[];
    transactions: TransactionStats;
    most_booked_salons: SalonBookingStat[];
    most_revenued_salons: SalonRevenueStat[];
    most_booked_users: UserStat[];
}

export interface AnalyticsResponse {
    status: string;
    message: string;
    data: AnalyticsSummary;
}
