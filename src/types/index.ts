export * from './user';
export * from './course';
export * from './booking';

export interface Service {
    id: number;
    name: string;
    description: string;
    icon: string;
}

export interface ServiceState {
    services: Service[];
    isLoading: boolean;
    error: string | null;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
