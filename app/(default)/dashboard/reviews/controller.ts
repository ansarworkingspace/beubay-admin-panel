import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api_client";
import { ApiResponse, SalonRating, StylistRating } from "./model";

export const useSalonRatings = (page: number, limit: number, params: Record<string, string>) => {
    return useQuery({
        queryKey: ["salon-ratings", page, limit, params],
        queryFn: async () => {
            const response = await api.get<ApiResponse<SalonRating>>("/admin/ratings/salon", {
                params: {
                    page,
                    limit,
                    ...params,
                },
            });
            return response.data.data;
        },
    });
};

export const useStylistRatings = (page: number, limit: number, params: Record<string, string>) => {
    return useQuery({
        queryKey: ["stylist-ratings", page, limit, params],
        queryFn: async () => {
            const response = await api.get<ApiResponse<StylistRating>>("/admin/ratings/stylist", {
                params: {
                    page,
                    limit,
                    ...params,
                },
            });
            return response.data.data;
        },
    });
};
