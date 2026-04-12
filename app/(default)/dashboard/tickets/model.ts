export interface TicketUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

export type TicketStatus = "OPEN" | "CLOSED";

export interface Ticket {
    _id: string;
    reason: string;
    details: string;
    status: TicketStatus;
    user_id: TicketUser;
    created_at: string;
    updated_at: string;
}

export interface TicketPagination {
    current: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface TicketListResponse {
    status: string;
    message: string;
    data: {
        data: Ticket[];
        pagination: TicketPagination;
    };
}

export interface TicketDetailResponse {
    status: string;
    message: string;
    data: Ticket;
}
