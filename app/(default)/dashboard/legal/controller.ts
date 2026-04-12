import api from "@/lib/api_client";
import { LegalApiResponse, LegalUpdatePayload, LegalContent } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// --- Fetch Functions ---

export const getLegalContent = async (type: 'terms' | 'privacy' | 'about'): Promise<LegalContent | null> => {
    try {
        const { data } = await api.get(`/admin/legal/${type}`);
        if (data?.status !== "success") {
            toast.error(data?.message || `Failed to fetch ${type}`);
            return null;
        }
        return data.data;
    } catch (error: any) {
        toast.error(
            error?.response?.data?.message ||
            `Failed to fetch ${type}`
        );
        return null;
    }
};

// --- Hooks ---

export const useLegalContent = (type: 'terms' | 'privacy' | 'about') => {
    return useQuery({
        queryKey: ['legal', type],
        queryFn: () => getLegalContent(type),
    });
};

export const useUpdateLegalMutation = (type: 'terms' | 'privacy' | 'about') => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: LegalUpdatePayload) => {
            const response = await api.post(`/admin/legal/${type}`, payload);
            if (response.data.status !== "success") {
                throw new Error(response.data.message || `Failed to update ${type}`);
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
            queryClient.invalidateQueries({ queryKey: ["legal", type] });
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage = error?.response?.data?.message || "Update failed";
            toast.error(errorMessage);
        },
    });
};
