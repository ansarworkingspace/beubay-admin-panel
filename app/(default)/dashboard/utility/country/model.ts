import { z } from "zod";

export const countrySchema = z.object({
    name: z
        .string()
        .min(1, "Country name is required")
        .min(2, "Country name must be at least 2 characters")
        .max(100, "Country name must not exceed 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Country name must contain only letters and spaces"),

    phone_code: z
        .string()
        .min(1, "Phone code is required")
        .regex(/^\+\d{1,4}$/, "Phone code must start with + followed by 1-4 digits (e.g., +1, +91)"),

    currency: z
        .string()
        .min(1, "Currency name is required")
        .min(2, "Currency name must be at least 2 characters")
        .max(50, "Currency name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Currency name must contain only letters and spaces"),

    currency_symbol: z
        .string()
        .min(1, "Currency symbol is required"),

    country_code: z
        .string()
        .min(1, "Country code is required")
        .length(3, "Country code must be exactly 3 characters (e.g., IND, USA)")
        .regex(/^[A-Z]{3}$/, "Country code must be 3 uppercase letters"),

    is_active: z.boolean().default(true),
});

export type CountryFormData = z.infer<typeof countrySchema>;

export interface CountryData {
    _id: string;
    id?: string;
    name: string;
    phone_code: string;
    country_code: string;
    currency: string;
    currency_symbol: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface PaginationInfo {
    current: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

// Controller returns response.data.data which is { data: [], pagination: {} }
export interface CountriesListResponse {
    data: CountryData[];
    pagination: PaginationInfo;
}

// For single item responses if structure differs
export interface CountryResponse {
    success: boolean;
    message: string;
    data: CountryData;
    timestamp?: string;
}
