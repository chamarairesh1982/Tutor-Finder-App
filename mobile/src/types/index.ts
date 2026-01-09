export enum UserRole {
    Student = 0,
    Tutor = 1,
    Admin = 2,
}

export enum Category {
    Music = 0,
    Maths = 1,
    English = 2,
    Science = 3,
    Languages = 4,
    Programming = 5,
    Other = 99,
}

export enum TeachingMode {
    InPerson = 0,
    Online = 1,
    Both = 2,
}

export enum BookingStatus {
    Pending = 0,
    Accepted = 1,
    Declined = 2,
    Cancelled = 3,
    Completed = 4,
}

export interface User {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
}

export interface AuthResponse {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    token: string;
}

export interface TutorProfile {
    id: string;
    userId: string;
    fullName: string;
    photoUrl?: string;
    bio: string;
    category: Category;
    baseLatitude: number;
    baseLongitude: number;
    postcode: string;
    travelRadiusMiles: number;
    pricePerHour: number;
    teachingMode: TeachingMode;
    subjects: string[];
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
}

export interface TutorSearchResult {
    id: string;
    fullName: string;
    photoUrl?: string;
    category: Category;
    subjects: string[];
    pricePerHour: number;
    averageRating: number;
    reviewCount: number;
    distanceMiles: number;
    nextAvailableText: string;
}

export interface TutorSearchRequest {
    lat?: number;
    lng?: number;
    postcode?: string;
    radiusMiles: number;
    subject?: string;
    category?: Category;
    minRating?: number;
    priceMin?: number;
    priceMax?: number;
    mode?: TeachingMode;
    page: number;
    pageSize: number;
    sortBy: 'nearest' | 'best' | 'rating' | 'price';
}

export interface BookingRequest {
    tutorId: string;
    preferredMode: TeachingMode;
    preferredDate?: string;
    initialMessage: string;
}

export interface Booking {
    id: string;
    studentId: string;
    studentName: string;
    tutorId: string;
    tutorName: string;
    preferredMode: TeachingMode;
    preferredDate?: string;
    pricePerHour: number;
    status: BookingStatus;
    createdAt: string;
    messages: BookingMessage[];
}

export interface BookingMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    sentAt: string;
}

export interface Review {
    id: string;
    studentId: string;
    studentName: string;
    tutorProfileId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface AvailabilitySlot {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}
