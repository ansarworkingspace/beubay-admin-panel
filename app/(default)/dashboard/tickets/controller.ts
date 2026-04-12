import api from "@/lib/api_client";
import { TicketListResponse, TicketDetailResponse, TicketStatus, Ticket } from "./model";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// --- Fetch Functions ---

export const getTickets = async (
    page: number = 1,
    limit: number = 10,
    status: string = "all"
): Promise<TicketListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (status !== "all") {
        params.append("type", status.toUpperCase());
    }

    const response = await api.get(`/admin/tickets?${params.toString()}`);
    return response.data;
};

export const getTicketDetails = async (id: string): Promise<Ticket | null> => {
    try {
        const { data } = await api.get(`/admin/tickets/${id}`);
        if (data?.status !== "success") {
            toast.error(data?.message || "Failed to fetch ticket details");
            return null;
        }
        return data.data;
    } catch (error: any) {
        toast.error(
            error?.response?.data?.message ||
            "Failed to fetch ticket details"
        );
        return null;
    }
};

// --- Hooks ---

export const useTickets = (page: number, limit: number, status: string) => {
    return useQuery({
        queryKey: ['tickets', page, limit, status],
        queryFn: () => getTickets(page, limit, status),
    });
};

export const useTicketDetails = (id: string) => {
    return useQuery({
        queryKey: ['ticket', id],
        queryFn: () => getTicketDetails(id),
        enabled: !!id,
    });
};

export const useUpdateTicketStatusMutation = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (status: TicketStatus) => {
            const response = await api.patch(`/admin/tickets/${id}/status`, { status });
            if (response.data.status !== "success") {
                throw new Error(response.data.message || "Failed to update status");
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success("Ticket status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            queryClient.invalidateQueries({ queryKey: ["ticket", id] });
        },
        onError: (error: any) => {
            console.error(error);
            const errorMessage = error?.response?.data?.message || "Update failed";
            toast.error(errorMessage);
        },
    });
};
