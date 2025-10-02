export interface Course {
    id: number;
    name: string;
    type: string;
    description: string;
    price: number;
    imageUrl: string;
    duration: number; // in minutes
    instructor: string;
    maxStudents: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    equipment: string[];
    schedule: {
        [key: string]: string[];
    };
}

export interface CourseState {
    courses: Course[];
    isLoading: boolean;
    error: string | null;
}

export interface CreateCourseRequest {
    name: string;
    type: string;
    description: string;
    price: number;
    imageUrl: string;
    duration: number;
    instructor: string;
    maxStudents: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    equipment: string[];
    schedule: {
        [key: string]: string[];
    };
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
    id: number;
}
