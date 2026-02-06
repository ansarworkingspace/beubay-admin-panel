
export interface ITimeRange {
    start_time: string; // Format: "HH:mm"
    end_time: string;   // Format: "HH:mm"
}

export interface IDailyAvailability {
    is_working: boolean;
    working_hours?: ITimeRange;
    breaks?: ITimeRange[];
}

export interface IStylistAvailability {
    monday?: IDailyAvailability;
    tuesday?: IDailyAvailability;
    wednesday?: IDailyAvailability;
    thursday?: IDailyAvailability;
    friday?: IDailyAvailability;
    saturday?: IDailyAvailability;
    sunday?: IDailyAvailability;
}

export interface Stylist {
    _id: string;
    salon_id: {
        _id: string;
        salon_name: string;
    } | string;
    name: string;
    email: string;
    phone: string;
    experience_years: number;
    bio: string;
    service_category_ids: {
        _id: string;
        name: string;
    }[] | string[];
    profile_image: string;
    average_rating: number;
    total_ratings: number;
    is_available: boolean;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    availability?: IStylistAvailability;
}

export interface StylistFormData {
    salon_id: string;
    name: string;
    email: string;
    phone: string;
    experience_years: number;
    bio: string;
    service_category_ids: string[];
    profile_image?: FileList | string;
    availability?: IStylistAvailability;
}

export interface StylistListResponse {
    data: Stylist[];
    pagination: {
        current: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
