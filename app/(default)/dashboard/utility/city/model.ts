import { z } from "zod";

export const citySchema = z.object({
    name: z
        .string()
        .min(1, "City name is required")
    // .regex(/^[a-zA-Z\s]+$/, "City name must contain only letters and spaces") // strict regex if needed
    ,
    country_id: z.string().min(1, "Country is required"),
    state_id: z.string().min(1, "State is required"),
    is_active: z.boolean().default(true),
});

export type CityFormData = z.infer<typeof citySchema>;

export interface CityData {
    _id: string;
    id?: string;
    name: string;
    country_id: string;
    country_name?: string;
    state_id: string;
    state_name?: string;
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

export interface CitiesListResponse {
    data: CityData[];
    pagination: PaginationInfo;
}

export interface CityResponse {
    status: string;
    success?: boolean;
    message: string;
    data: CityData;
    timestamp?: string;
}
