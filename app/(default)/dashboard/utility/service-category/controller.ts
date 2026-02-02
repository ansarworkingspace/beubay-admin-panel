import api from "@/lib/api_client";
import { ServiceCategoryFormData, ServiceCategoryResponse, ServiceCategoryListResponse, ServiceCategoryData } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Helpers ---
const createFormData = (data: ServiceCategoryFormData, isEdit: boolean = false) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("display_order", data.display_order.toString());
    formData.append("is_active", String(data.is_active));

    // Handle File Upload
    // If it's a FileList (from input type="file"), get the first file
    if (data.icon && data.icon.length > 0) {
        formData.append("icon", data.icon[0]);
    }

    return formData;
};

// --- Hooks ---

export const useCreateServiceCategoryMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ServiceCategoryFormData) => {
            const formData = createFormData(data);
            const response = await api.post("/admin/service-categories", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData: ServiceCategoryResponse = response.data;
            if (responseData.status !== "success" && !(responseData as any).success)
                throw new Error(responseData.message || "Failed to create category");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Service Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["service-categories"] });
            router.push("/dashboard/utility/service-category");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Creation failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateServiceCategoryMutation = (id: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ServiceCategoryFormData) => {
            const formData = createFormData(data, true);
            const response = await api.put(`/admin/service-categories/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData: ServiceCategoryResponse = response.data;
            if (responseData.status !== "success" && !(responseData as any).success)
                throw new Error(responseData.message || "Failed to update category");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Service Category updated successfully");
            queryClient.invalidateQueries({ queryKey: ["service-categories"] });
            queryClient.invalidateQueries({ queryKey: ["service-category", id] });
            router.push("/dashboard/utility/service-category");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Update failed";
            toast.error(errorMessage);
        },
    });
};

export function useToggleServiceCategoryStatus(options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; currentStatus: boolean }) => {
            await api.patch(`/admin/service-categories/${data.id}/status`, {
                is_active: !data.currentStatus
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-categories"] });
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

export const getServiceCategories = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<ServiceCategoryListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/service-categories?${params.toString()}`);
    return response.data.data;
};

export const getServiceCategoryDetails = async (id: string) => {
    try {
        const { data }: { data: ServiceCategoryResponse } = await api.get(
            `/admin/service-categories/${id}`
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

export const useServiceCategories = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['service-categories', page, limit, searchParams],
        queryFn: () => getServiceCategories(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};
