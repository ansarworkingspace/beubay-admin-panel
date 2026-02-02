import { z } from "zod";

export const salonCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    display_order: z.coerce.number().min(1, "Display order must be at least 1"),
    // Icon is handled separately
    is_active: z.boolean().default(true),
    icon: z.any().optional(),
});

export type SalonCategoryFormData = z.infer<typeof salonCategorySchema> & {
    icon?: FileList | null;
};

export interface SalonCategoryData {
    _id: string;
    id?: string;
    name: string;
    description: string;
    icon_url: string;
    display_order: number;
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

export interface SalonCategoryListResponse {
    data: SalonCategoryData[];
    pagination: PaginationInfo;
}

export interface SalonCategoryResponse {
    status: string;
    success?: boolean;
    message: string;
    data: SalonCategoryData;
}
