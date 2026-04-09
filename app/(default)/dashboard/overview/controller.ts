import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api_client";
import { AnalyticsResponse } from "./model";

export const useAnalyticsSummary = (period: string = "month", startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ["analytics-summary", period, startDate, endDate],
        queryFn: async () => {
            const params: Record<string, string> = { period };
            if (period === "custom" && startDate && endDate) {
                params.start_date = startDate;
                params.end_date = endDate;
            }
            const response = await api.get<AnalyticsResponse>("/admin/analytics/summary", { params });
            return response.data.data;
        },
    });
};
