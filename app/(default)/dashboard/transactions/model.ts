export interface Transaction {
    _id: string;
    order_id: string;
    user_id: string | null;
    salon_id: {
        _id: string;
        salon_name: string;
    };
    booking_id: {
        _id: string;
        booking_id: string;
    } | null;
    amount: number;
    currency: string;
    status: "initiated" | "success" | "failed" | "pending" | "refunded";
    gateway: string;
    request_payload: any;
    response_payload?: any;
    created_at: string;
    updated_at: string;
}

export interface TransactionListResponse {
    data: Transaction[];
    pagination: {
        current: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
