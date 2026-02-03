export interface BusinessHour {
    is_open: boolean;
    opening_time: string;
    closing_time: string;
}

export interface BusinessHours {
    monday: BusinessHour;
    tuesday: BusinessHour;
    wednesday: BusinessHour;
    thursday: BusinessHour;
    friday: BusinessHour;
    saturday: BusinessHour;
    sunday: BusinessHour;
}

export interface SalonLocation {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
}

export interface Salon {
    _id: string;
    id?: string;
    salon_name: string;
    owner_name: string;
    email: string;
    phone: string;
    alternate_phone?: string;
    description?: string;
    logo_url?: string;
    images: string[];

    salon_category_id: string; // or Populated object
    service_category_ids: string[]; // or Populated objects

    country_id: string;
    state_id: string;
    city_id: string;
    address: string;
    location: SalonLocation;

    website_url?: string;
    business_hours: BusinessHours;

    average_rating: number;
    total_ratings: number;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SalonFormData {
    logo?: FileList;
    images?: FileList;
    salon_name: string;
    owner_name: string;
    email: string;
    phone: string;
    salon_category_id: string;
    country_id: string;
    state_id: string;
    city_id: string;
    address: string;
    service_category_ids: string[]; // These will be JSON stringified
    location: {
        lat: number;
        lng: number;
    }; // Will be JSON stringified to {type: 'Point', ...}
    business_hours: BusinessHours; // Will be JSON stringified
}

export interface SalonListResponse {
    data: Salon[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface SalonResponse {
    status: string;
    data: Salon;
    message?: string;
}
