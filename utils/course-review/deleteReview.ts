import { doc, deleteDoc } from "firebase/firestore";

export const deleteReview = async (reviewId: string) => {
    const { $db } = useNuxtApp();
    const reviewRef = doc($db, "reviews", reviewId);
    await deleteDoc(reviewRef);
}