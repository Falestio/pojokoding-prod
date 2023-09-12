import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore"
import { Review } from "~~/types/models/review"

export const readAllReview = async (courseId: string) => {
    const { $db } = useNuxtApp()
    const reviewsRef = collection($db, "reviews")
    const q = query(reviewsRef, where("courseId", "==", courseId))
    const querySnapshot = await getDocs(q)
    const reviews: Review[] = []
    querySnapshot.forEach((doc) => {
        const review = doc.data() as Review
        // @ts-ignore
        review.id = doc.id
        reviews.push(review)
    })
    return reviews
}