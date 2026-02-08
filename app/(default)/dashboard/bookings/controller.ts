
import api from "@/lib/api_client";
import { BookingListResponse, Booking } from "./model";
import { useQuery } from "@tanstack/react-query";

export const getBookings = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<BookingListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    // Handle 'search' parameter specifically for booking_id if needed, 
    // or just pass it as 'search' if backend expects ?search=...
    // The requirement says /app/bookings?search=BK2023 

    const response = await api.get(`/admin/bookings?${params.toString()}`);
    if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to fetch bookings");
    }
    return response.data.data;
};

export const getBookingDetails = async (id: string): Promise<Booking> => {
    const response = await api.get(`/admin/bookings/${id}`);
    if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to fetch booking details");
    }
    return response.data.data;
};

export const useBookings = (
    page: number,
    limit: number,
    searchParams: Record<string, string>
) => {
    return useQuery({
        queryKey: ["bookings", page, limit, searchParams],
        queryFn: () => getBookings(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};

export const useBookingDetails = (id: string) => {
    return useQuery({
        queryKey: ["booking", id],
        queryFn: () => getBookingDetails(id),
        enabled: !!id,
    });
};
