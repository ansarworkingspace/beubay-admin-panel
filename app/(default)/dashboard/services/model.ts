
export interface TaxDetails {
    cgst_percentage: number;
    sgst_percentage: number;
    igst_percentage?: number;
    total_tax_percentage?: number;
}

export interface Service {
    _id: string;
    salon_id: {
        _id: string;
        salon_name: string;
    };
    name: string;
    service_category_id: string | null;
    description: string;
    image_url: string;
    original_price: number;
    discount_percentage: number;
    discount_amount: number;
    final_price: number;
    total_amount: number;
    duration_minutes: number;
    gender: string;
    is_active: boolean;
    is_deleted: boolean;
    tax_details: TaxDetails;
    created_at: string;
    updated_at: string;
}

export interface ServiceFormData {
    salon_id: string;
    service_category_id: string;
    name: string;
    original_price: number;
    discount_percentage: number;
    duration_minutes: number;
    gender: "male" | "female" | "unisex";
    description: string;
    tax_details: TaxDetails; // Will be JSON stringified in controller
    image?: any;
}

export interface ServiceListResponse {
    data: Service[];
    pagination: {
        current: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ServiceResponse {
    status: string;
    message: string;
    data: Service;
}
