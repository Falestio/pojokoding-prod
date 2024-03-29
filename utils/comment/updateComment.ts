import { doc, updateDoc } from "@firebase/firestore"

export const updateComment = async (commentId: string, commentContent: string) => {
    const { $db } = useNuxtApp()

    const commentRef = doc($db, "comments", commentId)

    await updateDoc(commentRef, {
        content: commentContent,
        updatedAt: new Date()
    })
}