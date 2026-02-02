import api from "@/lib/api_client";
import { StateFormData, StateResponse, StatesListResponse, CountryDropdownItem } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Hooks ---

export const useCreateStateMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: StateFormData) => {
            const { data }: { data: StateResponse } = await api.post(
                "/admin/states",
                formData
            );
            if (data.status !== "success" && !(data as any).success)
                throw new Error(data.message || "Failed to create state");
            return data.data;
        },
        onSuccess: () => {
            toast.success("State created successfully");
            queryClient.invalidateQueries({ queryKey: ["states"] });
            router.push("/dashboard/utility/state");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "State creation failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateStateMutation = (stateId: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: StateFormData) => {
            const { data }: { data: StateResponse } = await api.put(
                `/admin/states/${stateId}`,
                formData
            );
            if (data.status !== "success" && !(data as any).success)
                throw new Error(data.message || "Failed to update state");
            return data.data;
        },
        onSuccess: () => {
            toast.success("State updated successfully");
            queryClient.invalidateQueries({ queryKey: ["states"] });
            queryClient.invalidateQueries({ queryKey: ["state", stateId] });
            router.push("/dashboard/utility/state");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "State update failed";
            toast.error(errorMessage);
        },
    });
};

export function useToggleStateStatus(options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleStateStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["states"] });
            toast.success("State status updated successfully!");
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

export const getStates = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<StatesListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/states?${params.toString()}`);
    return response.data.data;
};

export const getStateDetails = async (stateId: string) => {
    try {
        const { data }: { data: StateResponse } = await api.get(
            `/admin/states/${stateId}`
        );
        if (!data?.data) {
            toast.error("Failed to fetch state details");
            return null;
        }
        // Return object compatible with StateFormData & extras
        return {
            name: data.data.name,
            state_code: data.data.state_code,
            country_id: data.data.country_id,
            is_active: data.data.is_active,
            _id: data.data._id,
            id: data.data._id,
            country_name: data.data.country_name // useful for reading
        };
    } catch (error: any) {
        toast.error(
            error?.response?.data?.message ||
            "Failed to fetch state details"
        );
        return null;
    }
};

export const toggleStateStatus = (data: { id: string; currentStatus: boolean }): Promise<void> => {
    return api.patch(`/admin/states/${data.id}/status`, {
        is_active: !data.currentStatus
    }).then((res) => res.data);
}

// --- React Query Hooks ---

export const useStates = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['states', page, limit, searchParams],
        queryFn: () => getStates(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};

// --- Dropdown Helpers ---

export const getAllCountries = async (): Promise<CountryDropdownItem[]> => {
    try {
        const response = await api.get(`/admin/countries/all`);
        // Assuming response matches { status: 'success', data: { data: [...] } } or just { data: [...] }
        // The user said: "call the admin/countries/all -> this api have no pagination"
        // Let's assume standard response structure
        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch all countries", error);
        return [];
    }
}
