
export interface Customer {
    _id: string;
    name: string;
    phone: string;
    email: string;
    profile_image: string;
    gender?: 'male' | 'female' | 'other';
    date_of_birth?: string; // or Date, but API usually returns string
    is_phone_verified: boolean;
    is_email_verified: boolean;
    preferred_language?: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface CustomerFormData {
    name?: string;
    phone: string;
    email?: string;
    gender?: 'male' | 'female' | 'other';
    date_of_birth?: string; // YYYY-MM-DD for form input
    preferred_language?: string;
    password?: string; // Optional for creation/update
    profile_image?: FileList | string;
    is_active?: boolean;
}

export interface CustomerListResponse {
    data: Customer[];
    pagination: {
        current: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
