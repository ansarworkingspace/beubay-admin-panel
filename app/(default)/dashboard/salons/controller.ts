import api from "@/lib/api_client";
import { SalonFormData, SalonResponse, SalonListResponse } from "./model";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ServiceListResponse } from "../services/model";
import { StylistListResponse } from "../stylist/model";

// --- Helpers ---
const createFormData = (data: SalonFormData, isEdit: boolean = false) => {
    const formData = new FormData();

    // Text fields
    formData.append("salon_name", data.salon_name);
    formData.append("owner_name", data.owner_name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);

    if (data.salon_category_id) formData.append("salon_category_id", data.salon_category_id);
    if (data.country_id) formData.append("country_id", data.country_id);
    if (data.state_id) formData.append("state_id", data.state_id);
    if (data.city_id) formData.append("city_id", data.city_id);

    // JSON Stringified fields
    if (data.service_category_ids) {
        // Ensure it's passed as a JSON string of array of IDs
        formData.append("service_category_ids", JSON.stringify(data.service_category_ids));
    }

    if (data.location) {
        const lat = Number(data.location.lat) || 0;
        const lng = Number(data.location.lng) || 0;
        const loc = {
            type: "Point",
            coordinates: [lng, lat] // [longitude, latitude]
        };
        formData.append("location", JSON.stringify(loc));
    }

    if (data.business_hours) {
        formData.append("business_hours", JSON.stringify(data.business_hours));
    }

    // File Uploads
    if (data.logo && data.logo.length > 0) {
        formData.append("logo", data.logo[0]);
    }

    if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
            formData.append("images", data.images[i]);
        }
    }

    if ((data as any).deleted_images && (data as any).deleted_images.length > 0) {
        formData.append("deleted_images", JSON.stringify((data as any).deleted_images));
    }

    return formData;
};

// --- Hooks ---

export const useCreateSalonMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SalonFormData) => {
            const formData = createFormData(data);
            const response = await api.post("/admin/salons", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData: SalonResponse = response.data;
            // Check for success status or flag
            if (responseData.status !== "success" && !(responseData as any).success)
                throw new Error(responseData.message || "Failed to create salon");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Salon created successfully");
            queryClient.invalidateQueries({ queryKey: ["salons"] });
            router.push("/dashboard/salons");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Creation failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateSalonMutation = (id: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SalonFormData) => {
            const formData = createFormData(data, true);
            const response = await api.put(`/admin/salons/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData: SalonResponse = response.data;
            if (responseData.status !== "success" && !(responseData as any).success)
                throw new Error(responseData.message || "Failed to update salon");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Salon updated successfully");
            queryClient.invalidateQueries({ queryKey: ["salons"] });
            queryClient.invalidateQueries({ queryKey: ["salon", id] });
            router.push("/dashboard/salons");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Update failed";
            toast.error(errorMessage);
        },
    });
};

export function useToggleSalonStatus(options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; currentStatus: boolean }) => {
            // Check if endpoint is patch or put for status
            await api.patch(`/admin/salons/${data.id}/status`, {
                is_active: !data.currentStatus
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salons"] });
            toast.success("Status updated successfully!");
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            console.error("Toggle status error:", error);
            const errorMessage = error?.response?.data?.message || "Failed to update status";
            options?.onError?.(error);
        },
    });
}

// --- Fetch Functions ---

export const getSalons = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<SalonListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/salons?${params.toString()}`);
    // Check structure
    return response.data.data; // Assuming response.data contains { data: [], pagination: {} } 
    // If it follows the service-category pattern, it might be response.data.data
};

export const getSalonDetails = async (id: string) => {
    try {
        const { data }: { data: SalonResponse } = await api.get(
            `/admin/salons/${id}`
        );
        if (!data?.data) {
            toast.error("Failed to fetch details");
            return null;
        }
        return data.data;
    } catch (error: any) {
        toast.error(
            error?.response?.data?.message ||
            "Failed to fetch details"
        );
        return null;
    }
};

export const getSalonServices = async (
    salonId: string,
    page: number = 1,
    limit: number = 10
): Promise<ServiceListResponse> => {
    const response = await api.get(`/admin/services`, {
        params: { salon_id: salonId, page, limit }
    });
    return response.data.data;
};

export const getSalonStylists = async (
    salonId: string,
    page: number = 1,
    limit: number = 10
): Promise<StylistListResponse> => {
    const response = await api.get(`/admin/stylists`, {
        params: { salon_id: salonId, page, limit }
    });
    return response.data.data;
};



// --- React Query Hooks ---

export const useSalons = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['salons', page, limit, searchParams],
        queryFn: () => getSalons(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};

export const useSalonDetails = (id: string) => {
    return useQuery({
        queryKey: ['salon', id],
        queryFn: () => getSalonDetails(id),
        enabled: !!id,
    });
};

export const useSalonServices = (salonId: string, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['salon-services', salonId, page, limit],
        queryFn: () => getSalonServices(salonId, page, limit),
        enabled: !!salonId,
    });
};

export const useSalonStylists = (salonId: string, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['salon-stylists', salonId, page, limit],
        queryFn: () => getSalonStylists(salonId, page, limit),
        enabled: !!salonId,
    });
};



