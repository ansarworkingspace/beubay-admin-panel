import api from "@/lib/api_client";
import { StylistFormData, StylistListResponse, Stylist } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Helpers ---
const createFormData = (data: StylistFormData) => {
    const formData = new FormData();

    formData.append("salon_id", data.salon_id);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("experience_years", data.experience_years.toString());
    formData.append("bio", data.bio);

    // Handle array of service category IDs
    if (Array.isArray(data.service_category_ids)) {
        // Backend typically expects array fields to be appended multiple times or stringified
        // Based on user request: service_category_ids:["697f2a204f00805132c8c652"]
        // Let's assume standard FormData array handling
        data.service_category_ids.forEach((id) => {
            formData.append("service_category_ids", id);
        });
    }

    if (data.profile_image && data.profile_image instanceof FileList && data.profile_image.length > 0) {
        formData.append("profile_image", data.profile_image[0]);
    }

    return formData;
};

// --- Hooks ---

export const useCreateStylistMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: StylistFormData) => {
            const formData = createFormData(data);
            const response = await api.post("/admin/stylists", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData = response.data;
            if (responseData.status !== "success")
                throw new Error(responseData.message || "Failed to create stylist");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Stylist created successfully");
            queryClient.invalidateQueries({ queryKey: ["stylists"] });
            router.push("/dashboard/stylist");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Creation failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateStylistMutation = (id: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: StylistFormData) => {
            const formData = createFormData(data);
            const response = await api.put(`/admin/stylists/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData = response.data;
            if (responseData.status !== "success")
                throw new Error(responseData.message || "Failed to update stylist");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Stylist updated successfully");
            queryClient.invalidateQueries({ queryKey: ["stylists"] });
            queryClient.invalidateQueries({ queryKey: ["stylist", id] });
            router.push("/dashboard/stylist");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Update failed";
            toast.error(errorMessage);
        },
    });
};

// --- Fetch Functions ---

export const getStylistDetails = async (id: string): Promise<Stylist | null> => {
    try {
        const { data } = await api.get(`/admin/stylists/${id}`);
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

export const getStylists = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<StylistListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/stylists?${params.toString()}`);
    return response.data.data;
};

export const useStylists = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['stylists', page, limit, searchParams],
        queryFn: () => getStylists(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};

export const useStylistDetails = (id: string) => {
    return useQuery({
        queryKey: ['stylist', id],
        queryFn: () => getStylistDetails(id),
        enabled: !!id,
    });
};
