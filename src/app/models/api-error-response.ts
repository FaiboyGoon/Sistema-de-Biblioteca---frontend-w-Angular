export interface ApiErrorResponse {
    status: number;
    message: string;
    timestamp: string;
    errors?: { [field: string]: string };
}
