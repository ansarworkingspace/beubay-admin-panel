import api from "@/lib/api_client";
import { CityFormData, CityResponse, CitiesListResponse, CityData } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Hooks ---

export const useCreateCityMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: CityFormData) => {
            const { data }: { data: CityResponse } = await api.post(
                "/admin/cities",
                formData
            );
            if (data.status !== "success" && !(data as any).success)
                throw new Error(data.message || "Failed to create city");
            return data.data;
        },
        onSuccess: () => {
            toast.success("City created successfully");
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            router.push("/dashboard/utility/city");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "City creation failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateCityMutation = (cityId: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: CityFormData) => {
            const { data }: { data: CityResponse } = await api.put(
                `/admin/cities/${cityId}`,
                formData
            );
            if (data.status !== "success" && !(data as any).success)
                throw new Error(data.message || "Failed to update city");
            return data.data;
        },
        onSuccess: () => {
            toast.success("City updated successfully");
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            queryClient.invalidateQueries({ queryKey: ["city", cityId] });
            router.push("/dashboard/utility/city");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "City update failed";
            toast.error(errorMessage);
        },
    });
};

export function useToggleCityStatus(options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleCityStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            toast.success("City status updated successfully!");
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

export const getCities = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<CitiesListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/cities?${params.toString()}`);
    return response.data.data;
};

export const getCityDetails = async (cityId: string) => {
    try {
        const { data }: { data: CityResponse } = await api.get(
            `/admin/cities/${cityId}`
        );
        if (!data?.data) {
            toast.error("Failed to fetch city details");
            return null;
        }
        return {
            name: data.data.name,
            country_id: data.data.country_id,
            state_id: data.data.state_id,
            is_active: data.data.is_active,
            _id: data.data._id,
            id: data.data._id,
        };
    } catch (error: any) {
        toast.error(
            error?.response?.data?.message ||
            "Failed to fetch city details"
        );
        return null;
    }
};

export const toggleCityStatus = (data: { id: string; currentStatus: boolean }): Promise<void> => {
    return api.patch(`/admin/cities/${data.id}/status`, {
        is_active: !data.currentStatus
    }).then((res) => res.data);
}

// --- React Query Hooks ---

export const useCities = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['cities', page, limit, searchParams],
        queryFn: () => getCities(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};

// --- Dropdown Helpers ---

export const getAllCountries = async () => {
    try {
        const response = await api.get(`/admin/countries/all`);
        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch all countries", error);
        return [];
    }
}

export const getAllStates = async () => {
    try {
        const response = await api.get(`/admin/states/all`);
        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch all states", error);
        return [];
    }
}
