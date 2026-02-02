import api from "@/lib/api_client";
import { CountryFormData, CountryResponse, CountriesListResponse } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateCountryMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: CountryFormData) => {
            const { data }: { data: CountryResponse } = await api.post(
                "/admin/countries",
                formData
            );
            if (!data.success)
                throw new Error(data.message || "Failed to create country");
            return data.data;
        },
        onSuccess: () => {
            toast.success("Country created successfully");
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            router.push("/dashboard/utility/country");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Country creation failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateCountryMutation = (countryId: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: CountryFormData) => {
            const { data }: { data: CountryResponse } = await api.put(
                `/admin/countries/${countryId}`,
                formData
            );
            if (!data.success)
                throw new Error(data.message || "Failed to update country");
            return data.data;
        },
        onSuccess: () => {
            toast.success("Country updated successfully");
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            queryClient.invalidateQueries({ queryKey: ["country", countryId] });
            router.push("/dashboard/utility/country");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Country update failed";
            toast.error(errorMessage);
        },
    });
};

export const getCountryDetails = async (countryId: string) => {
    try {
        const { data }: { data: CountryResponse } = await api.get(
            `/admin/countries/${countryId}`
        );
        if (!data?.data) {
            toast.error("Failed to fetch country details");
            return null;
        }
        // Return both the form data structure AND the original data structure if needed
        // But the form expects specific fields.
        const result: CountryFormData & { _id: string, id: string } = {
            name: data.data.name,
            phone_code: data.data.phone_code,
            country_code: data.data.country_code,
            currency: data.data.currency,
            currency_symbol: data.data.currency_symbol,
            is_active: data.data.is_active,
            _id: data.data._id,
            id: data.data._id
        };
        return result;
    } catch (error: any) {
        toast.error(
            error?.response?.data?.message ||
            "Failed to fetch country details"
        );
        return null;
    }
};

export const getCountries = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<CountriesListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    // Add search filters with _like suffix for partial matching
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
            // Handle special cases or defaults
            params.append(`${key}`, value);
        }
    });

    const response = await api.get(`/admin/countries?${params.toString()}`);
    return response.data.data;
};

// React Query Hook for getting countries (Table use)
export const useCountries = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['countries', page, limit, searchParams],
        queryFn: () => getCountries(page, limit, searchParams),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    });
};

export function toggleCountryStatus(id: string): Promise<void> {

    return api.patch(`/admin/countries/${id}`)
        .then((res) => res.data);
}

export function useToggleCountryStatus(options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleCountryStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            toast.success("Country status updated successfully!");
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            console.error("Toggle status error:", error);
            const errorMessage = error?.response?.data?.message || "Failed to update status";
            // toast.error(errorMessage); // Optional to show error toast
            options?.onError?.(error);
        },
    });
}
