import { Review } from "~~/types/models/review"
import { collection, addDoc } from "firebase/firestore"

export const createReview = async (user: any, reviewContent: string, reviewRating: number, courseId: string) => {
    const { $db } = useNuxtApp()
    
    const newReview: Review = {
        courseId: courseId,
        userId: user.uid,
        content: reviewContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: user.displayName,
        photoUrl: user.photoURL,
        upvotes: 0,
        rating: reviewRating
    }

    console.log("New Review Object", newReview)
 
    const reviewRef = await addDoc(collection($db, "reviews"), newReview)
    console.log("New review with id: ", reviewRef)
}