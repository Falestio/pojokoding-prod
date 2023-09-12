export interface Review {
    courseId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    photoUrl: string;
    upvotes: number;
    rating: number;
}