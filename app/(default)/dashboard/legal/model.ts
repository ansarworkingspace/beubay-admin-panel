export interface LegalContent {
    content: string;
    version?: string;
    last_updated?: string;
}

export interface LegalUpdatePayload {
    content: string;
    version?: string;
}

export interface LegalApiResponse {
    status: string;
    message: string;
    data: LegalContent;
}
