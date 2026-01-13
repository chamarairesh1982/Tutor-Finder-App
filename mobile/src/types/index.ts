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
    Other = 99
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
    refreshToken?: string;
    refreshTokenExpiresAt?: string;
}

export interface TutorProfile {
    id: string;
    userId: string;
    fullName: string;
    photoUrl?: string;
    bio: string;
    qualifications?: string;
    teachingStyle?: string;
    specialities?: string[];
    category: Category;
    baseLatitude: number;
    baseLongitude: number;
    postcode: string;
    travelRadiusMiles: number;
    pricePerHour: number;
    teachingMode: TeachingMode;
    subjects: string[];
    locationSummary?: string;
    availabilitySummary?: string;
    averageRating: number;
    reviewCount: number;
    viewCount: number;
    isActive: boolean;
    hasDbs: boolean;
    hasCertification: boolean;
    responseTimeText?: string;
    reviews?: Review[];
    ratingBreakdown?: Record<number, number>;
    nextAvailableText?: string;
    availabilitySlots?: AvailabilitySlot[];
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
    teachingMode?: TeachingMode;
    responseTimeText?: string;
    hasDbs: boolean;
    hasCertification: boolean;
    badges?: string[];
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
    availabilityDay?: number;
}

export interface PagedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
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
    hasReview: boolean;
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

// Favorites feature types
export interface Favorite {
    id: string;
    userId: string;
    tutorProfileId: string;
    tutorName: string;
    tutorPhotoUrl?: string;
    tutorCategory: Category;
    tutorPricePerHour: number;
    tutorAverageRating: number;
    tutorReviewCount: number;
    subjects: string[];
    hasDbs: boolean;
    hasCertification: boolean;
    createdAt: string;
}

export interface TutorStats {
    totalViews: number;
    pendingBookings: number;
    activeBookings: number;
    completedBookings: number;
    totalEarnings: number;
    responseRate: number;
}
