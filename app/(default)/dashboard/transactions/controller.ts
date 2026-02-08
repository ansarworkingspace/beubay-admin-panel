
import api from "@/lib/api_client";
import { TransactionListResponse, Transaction } from "./model";
import { useQuery } from "@tanstack/react-query";

export const getTransactions = async (
    page: number = 1,
    limit: number = 10,
    searchParams: Record<string, string> = {}
): Promise<TransactionListResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
        }
    });

    const response = await api.get(`/admin/transactions?${params.toString()}`);
    if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to fetch transactions");
    }
    return response.data.data;
};

export const getTransactionDetails = async (id: string): Promise<Transaction> => {
    const response = await api.get(`/admin/transactions/${id}`);
    if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to fetch transaction details");
    }
    return response.data.data;
};

export const useTransactions = (
    page: number,
    limit: number,
    searchParams: Record<string, string>
) => {
    return useQuery({
        queryKey: ["transactions", page, limit, searchParams],
        queryFn: () => getTransactions(page, limit, searchParams),
        placeholderData: (previousData) => previousData,
    });
};

export const useTransactionDetails = (id: string) => {
    return useQuery({
        queryKey: ["transaction", id],
        queryFn: () => getTransactionDetails(id),
        enabled: !!id,
    });
};
