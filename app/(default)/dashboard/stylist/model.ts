
export interface Stylist {
    _id: string;
    salon_id: {
        _id: string;
        salon_name: string;
    } | string; // It might be populated or an ID string
    name: string;
    email: string;
    phone: string;
    experience_years: number;
    bio: string;
    service_category_ids: {
        _id: string;
        name: string;
    }[] | string[]; // Populated or ID strings
    profile_image: string;
    average_rating: number;
    total_ratings: number;
    is_available: boolean;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface StylistFormData {
    salon_id: string;
    name: string;
    email: string;
    phone: string;
    experience_years: number;
    bio: string;
    service_category_ids: string[]; // Form uses array of IDs
    profile_image?: FileList | string; // For file upload
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
