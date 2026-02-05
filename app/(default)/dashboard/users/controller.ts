import api from "@/lib/api_client";
import { CustomerFormData, CustomerListResponse, Customer } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Helpers ---
const createFormData = (data: CustomerFormData) => {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    formData.append("phone", data.phone);
    if (data.email) formData.append("email", data.email);
    if (data.gender) formData.append("gender", data.gender);
    if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);
    if (data.preferred_language) formData.append("preferred_language", data.preferred_language);
    if (data.password) formData.append("password", data.password);

    // Explicitly handle is_active if needed, though usually handled by separate status API or default
    // If backend expects boolean as string
    if (data.is_active !== undefined) formData.append("is_active", String(data.is_active));

    if (data.profile_image && data.profile_image instanceof FileList && data.profile_image.length > 0) {
        formData.append("profile_image", data.profile_image[0]);
    }

    return formData;
};

// --- Hooks ---

export const useCreateCustomerMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CustomerFormData) => {
            const formData = createFormData(data);
            const response = await api.post("/admin/customers", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData = response.data;
            if (responseData.status !== "success")
                throw new Error(responseData.message || "Failed to create customer");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Customer created successfully");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            router.push("/dashboard/users");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Creation failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateCustomerMutation = (id: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CustomerFormData) => {
            const formData = createFormData(data);
            const response = await api.put(`/admin/customers/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const responseData = response.data;
            if (responseData.status !== "success")
                throw new Error(responseData.message || "Failed to update customer");
            return responseData.data;
        },
        onSuccess: () => {
            toast.success("Customer updated successfully");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["customer", id] });
            router.push("/dashboard/users");
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Update failed";
            toast.error(errorMessage);
        },
    });
};

export const useUpdateCustomerStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
            // Usually status updates might be a PATCH request with JSON body
            // Given "router.patch('/:id/status', controller.updateStatus);"
            // It might expect { is_active: boolean } or similar
            const response = await api.patch(`/admin/customers/${id}/status`, { is_active: status });
            const responseData = response.data;
            if (responseData.status !== "success")
                throw new Error(responseData.message || "Failed to update status");
            return responseData.data;
        },
        onSuccess: (data, variables) => {
            toast.success("Customer status updated");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message || "Status update failed";
            toast.error(errorMessage);
        },
    });
};

// --- Fetch Functions ---

export const getCustomerDetails = async (id: string): Promise<Customer | null> => {
    try {
        const { data } = await api.get(`/admin/customers/${id}`);
        // Adjust based on if it returns Wrapped Response or direct data
        // Given list response has { data: { data: [] } }, usually detailed is { data: { ... } }
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

export const getCustomers = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<CustomerListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/customers?${params.toString()}`);
    return response.data.data;
};

export const useCustomers = (page: number, limit: number, searchParams: Record<string, string>) => {
    return useQuery({
        queryKey: ['customers', page, limit, searchParams],
        queryFn: () => getCustomers(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};

export const useCustomerDetails = (id: string) => {
    return useQuery({
        queryKey: ['customer', id],
        queryFn: () => getCustomerDetails(id),
        enabled: !!id,
    });
};
