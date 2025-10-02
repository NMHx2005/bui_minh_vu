export interface Booking {
    id: number;
    userId: number;
    courseId: number;
    bookingDate: string; // YYYY-MM-DD format
    bookingTime: string; // HH:MM format
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string; // ISO 8601 format
    notes?: string;
}

export interface BookingWithDetails extends Booking {
    user?: {
        id: number;
        fullName: string;
        email: string;
    };
    course?: {
        id: number;
        name: string;
        type: string;
        price: number;
    };
}

export interface BookingState {
    bookings: Booking[];
    userBookings: Booking[];
    isLoading: boolean;
    error: string | null;
}

export interface CreateBookingRequest {
    userId: number;
    courseId: number;
    bookingDate: string;
    bookingTime: string;
    notes?: string;
}

export interface UpdateBookingRequest {
    id: number;
    bookingDate?: string;
    bookingTime?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface BookingFilters {
    email?: string;
    courseId?: number;
    bookingDate?: string;
    status?: string;
}
