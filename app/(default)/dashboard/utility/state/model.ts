import { z } from "zod";

export const stateSchema = z.object({
    name: z
        .string()
        .min(1, "State name is required")
        .max(100, "State name must not exceed 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "State name must contain only letters and spaces"),

    state_code: z
        .string()
        .min(1, "State code is required")
        // .length(3, "State code must be exactly 3 characters (e.g., KRL)")
        .regex(/^[A-Z]{2,5}$/, "State code must be 2-5 uppercase letters"),

    country_id: z
        .string()
        .min(1, "Country is required"),

    is_active: z.boolean().default(true),
});

export type StateFormData = z.infer<typeof stateSchema>;

export interface StateData {
    _id: string;
    id?: string;
    name: string;
    state_code: string;
    country_id: string;
    country_name?: string; // for list view
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

export interface StatesListResponse {
    data: StateData[];
    pagination: PaginationInfo;
}

export interface StateResponse {
    status: string;
    success?: boolean;
    message: string;
    data: StateData;
    timestamp?: string;
}

// For Country Dropdown
export interface CountryDropdownItem {
    _id: string;
    name: string;
    [key: string]: any;
}
