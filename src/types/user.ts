export interface User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'user';
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phone?: string;
}

export interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}
