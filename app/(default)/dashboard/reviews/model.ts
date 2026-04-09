export interface Pagination {
    current: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface Salon {
    _id: string;
    salon_name: string;
}

export interface Stylist {
    _id: string;
    name: string;
}

export interface User {
    _id: string;
    name: string;
    profile_image?: string;
}

export interface SalonRating {
    _id: string;
    rating: number;
    feedback: string;
    salon_id: Salon;
    user_id: User | null;
    booking_id: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface StylistRating {
    _id: string;
    rating: number;
    feedback: string;
    stylist_id: Stylist;
    salon_id: Salon;
    user_id: User | null;
    booking_id: string;
    created_at: string;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: {
        data: T[];
        pagination: Pagination;
    };
}
