import { z } from "zod";

export const countrySchema = z.object({
    country_name: z
        .string()
        .min(1, "Country name is required")
        .min(2, "Country name must be at least 2 characters")
        .max(100, "Country name must not exceed 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Country name must contain only letters and spaces"),

    phone_code: z
        .string()
        .min(1, "Phone code is required")
        .regex(/^\+\d{1,4}$/, "Phone code must start with + followed by 1-4 digits (e.g., +1, +91)"),

    currency_name: z
        .string()
        .min(1, "Currency name is required")
        .min(2, "Currency name must be at least 2 characters")
        .max(50, "Currency name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Currency name must contain only letters and spaces"),

    currency_code: z
        .string()
        .min(1, "Currency code is required")
        .length(3, "Currency code must be exactly 3 characters (e.g., USD, INR)")
        .regex(/^[A-Z]{3}$/, "Currency code must be 3 uppercase letters (e.g., USD, INR)"),

    status: z.enum(["active", "inactive"]),
});

export type CountryFormData = z.infer<typeof countrySchema>;

export interface CountryData {
    _id: string;
    id?: string;
    country_name: string;
    phone_code: string;
    currency_code: string;
    currency_name: string;
    status: "active" | "inactive";
    softDelete: boolean;
    createdBy?: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
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

export interface CountriesListResponse {
    success: boolean;
    message: string;
    data: CountryData[];
    pagination: PaginationInfo;
    timestamp: string;
}

export interface CountryResponse {
    success: boolean;
    message: string;
    data: CountryData;
    timestamp: string;
}

export interface DeleteCountryResponse {
    success: boolean;
    message: string;
    timestamp: string;
}
