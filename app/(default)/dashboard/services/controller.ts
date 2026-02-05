import api from "@/lib/api_client";
import { ServiceFormData, ServiceResponse, ServiceListResponse } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Helpers ---
const createFormData = (data: ServiceFormData) => {
    const formData = new FormData();

    formData.append("salon_id", data.salon_id);
    formData.append("service_category_id", data.service_category_id);
    formData.append("name", data.name);
    formData.append("original_price", data.original_price.toString());
    formData.append("discount_percentage", data.discount_percentage.toString());
    formData.append("duration_minutes", data.duration_minutes.toString());
    formData.append("gender", data.gender);
    formData.append("description", data.description);

    if (data.tax_details) {
        formData.append("tax_details", JSON.stringify(data.tax_details));
    }

    if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
    }

    return formData;
};

// --- Hooks ---

export const useCreateServiceMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ServiceFormData) => {
            const formData = createFormData(data);
            // The user said "cakk /salons/all api" for salon_id but the main create api is not specified.
            // Assuming it's typically POST /admin/services or similar given the get all is "create under the dash board".
            // Wait, the user said "salon_id:6981... -> cakk /salons/all api". This probably means call salons/all api to get salon IDs for the dropdown.
            // But where to POST to create? The user didn't specify the CREATE endpoint explicitly, just "create under the dash board".
            // Typically in this project it seems to be /admin/services (following salons pattern).
            const response = await api.post("/admin/services", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData = response.data;
            if (responseData.status !== "success")
                throw new Error(responseData.message || "Failed to create service");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Service created successfully");
            queryClient.invalidateQueries({ queryKey: ["services"] });
            router.push("/dashboard/services");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Creation failed";
            toast.error(errorMessage);
        },
    });
};

// --- Fetch Functions ---

export const useUpdateServiceMutation = (id: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ServiceFormData) => {
            const formData = createFormData(data);
            const response = await api.put(`/admin/services/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData = response.data;
            if (responseData.status !== "success")
                throw new Error(responseData.message || "Failed to update service");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Service updated successfully");
            queryClient.invalidateQueries({ queryKey: ["services"] });
            queryClient.invalidateQueries({ queryKey: ["service", id] });
            router.push("/dashboard/services");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Update failed";
            toast.error(errorMessage);
        },
    });
};

export function useToggleServiceStatus(options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; currentStatus: boolean }) => {
            await api.patch(`/admin/services/${data.id}/status`, {
                is_active: !data.currentStatus
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
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

export const getServiceDetails = async (id: string) => {
    try {
        const { data } = await api.get(`/admin/services/${id}`);
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

export const getServices = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<ServiceListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/services?${params.toString()}`);
    return response.data.data;
};

export const useServices = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['services', page, limit, searchParams],
        queryFn: () => getServices(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};

export const useServiceDetails = (id: string) => {
    return useQuery({
        queryKey: ['service', id],
        queryFn: () => getServiceDetails(id),
        enabled: !!id,
    });
};
