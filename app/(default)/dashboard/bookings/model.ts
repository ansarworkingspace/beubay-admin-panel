export interface Service {
    service_id: {
        _id: string;
        name: string;
        image_url?: string;
    } | string;
    service_name: string;
    duration_minutes: number;
    price: number;
    discount: number;
    tax_amount: number;
    total_amount: number;
    _id: string;
}

export interface Salon {
    _id: string;
    salon_name: string;
    address?: string;
    phone?: string;
    image?: string;
}

export interface Stylist {
    _id: string;
    name: string;
    profile_image?: string;
}

export interface Booking {
    _id: string;
    booking_id: string;
    user_id: string;
    salon_id: Salon | string;
    stylist_id: Stylist | string;
    services: Service[];
    booking_date: string;
    booking_time: string;
    total_duration_minutes: number;
    subtotal: number;
    total_discount: number;
    total_tax: number;
    total_amount: number;
    payment_status: "paid" | "failed" | "pending";
    payment_method: string;
    booking_status: "confirmed" | "cancelled" | "completed" | "pending";
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    pg_transaction_id: string;
}

export interface BookingListResponse {
    data: Booking[];
    pagination: {
        current: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
