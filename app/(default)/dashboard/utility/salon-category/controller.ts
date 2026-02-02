import api from "@/lib/api_client";
import { SalonCategoryFormData, SalonCategoryResponse, SalonCategoryListResponse, SalonCategoryData } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Helpers ---
const createFormData = (data: SalonCategoryFormData, isEdit: boolean = false) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("display_order", data.display_order.toString());
    formData.append("is_active", String(data.is_active));

    // Handle File Upload
    if (data.icon && data.icon.length > 0) {
        formData.append("icon", data.icon[0]);
    }

    return formData;
};

// --- Hooks ---

export const useCreateSalonCategoryMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SalonCategoryFormData) => {
            const formData = createFormData(data);
            const response = await api.post("/admin/salon-categories", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData: SalonCategoryResponse = response.data;
            if (responseData.status !== "success" && !(responseData as any).success)
                throw new Error(responseData.message || "Failed to create category");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Salon Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["salon-categories"] });
            router.push("/dashboard/utility/salon-category");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Creation failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateSalonCategoryMutation = (id: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SalonCategoryFormData) => {
            const formData = createFormData(data, true);
            const response = await api.put(`/admin/salon-categories/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData: SalonCategoryResponse = response.data;
            if (responseData.status !== "success" && !(responseData as any).success)
                throw new Error(responseData.message || "Failed to update category");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Salon Category updated successfully");
            queryClient.invalidateQueries({ queryKey: ["salon-categories"] });
            queryClient.invalidateQueries({ queryKey: ["salon-category", id] });
            router.push("/dashboard/utility/salon-category");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Update failed";
            toast.error(errorMessage);
        },
    });
};

export function useToggleSalonCategoryStatus(options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; currentStatus: boolean }) => {
            await api.patch(`/admin/salon-categories/${data.id}/status`, {
                is_active: !data.currentStatus
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salon-categories"] });
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

export const getSalonCategories = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<SalonCategoryListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/salon-categories?${params.toString()}`);
    return response.data.data;
};

export const getSalonCategoryDetails = async (id: string) => {
    try {
        const { data }: { data: SalonCategoryResponse } = await api.get(
            `/admin/salon-categories/${id}`
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

// --- React Query Hooks ---

export const useSalonCategories = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['salon-categories', page, limit, searchParams],
        queryFn: () => getSalonCategories(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};
