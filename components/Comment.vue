<script setup>
import { useCurrentUser } from "~~/composables/user/useCurrentUser";
import { createComment } from "@/utils/comment/createComment"
import { readAllComment } from "@/utils/comment/readAllComment"
import { updateComment } from "@/utils/comment/updateComment";
import { deleteComment } from "@/utils/comment/deleteComment";
import { upvoteComment } from "@/utils/comment/upvoteComment";
import { createReply } from "@/utils/comment/createReply";
import { readAllReplyInOneComment } from "@/utils/comment/readAllReplyInOneComment";
import { updateReply } from "@/utils/comment/updateReply";
import { deleteReply } from "@/utils/comment/deleteReply";
import { upvoteReply } from "@/utils/comment/upvoteReply";

const props = defineProps(['articleId'])
const currentUser = useCurrentUser()

// Create new Comment
const newCommentContent = ref(null)
async function handleCreateComment(){
    const newComment = await createComment(newCommentContent.value, props.articleId, currentUser.value.uid, currentUser.value.displayName, currentUser.value.photoURL)
}

// Read all comment
const allComments =  ref(null)
const usersComment = ref(null)
async function handleReadAllComments(){
    allComments.value = await readAllComment(props.articleId)
    usersComment.value = allComments.value.filter(comment => {
        return comment.userId = currentUser.value.uid
    })
}

// Update Comments
const newUpdatedCommentContent = ref("This comment have been updated")
async function handleUpdateComment(commentId){
    await updateComment(commentId, newUpdatedCommentContent.value)
    await handleReadAllComments()
}

// Delete Comments
async function handleDeleteComment(commentId){
    await deleteComment(commentId)
    await handleReadAllComments()
}

// Upvote Comment
async function handleUpvoteComment(commentId){
    await upvoteComment(commentId)
}

// Create Reply
const newReplyContent = ref("Konten Reply")
async function handleCreateReply(commentId){    await createReply(newReplyContent.value, commentId, currentUser.value.uid, currentUser.value.displayName, currentUser.value.photoURL)
}

// Read All Reply in One Comment
// replies untuk komentar spesifik, nanti ditentikan di level template
const allReplies = ref([])
async function handleReadAllReplyInOneComment(commentId){
    const fetchedReplies = await readAllReplyInOneComment(commentId)
    
    // hapus dulu semua reply dengan commentId bersangkutan
    allReplies.value = allReplies.value.filter(reply => {
        return reply.commentId !== commentId
    })

    // lalu concat value yang baru di fetch
    allReplies.value = allReplies.value.concat(fetchedReplies)
}

// Update Reply
const updateReplyContent = ref("This reply is updated 2")
async function handleUpdateReply(replyId, commentId){
    await updateReply(replyId, updateReplyContent.value)
    await handleReadAllReplyInOneComment(commentId)
}

// Delete Reply
async function handleDeleteReply(replyId, commentId){
    await deleteReply(replyId)
    handleReadAllReplyInOneComment(commentId)
}

// Upvote Reply
async function handleUpvoteReply(replyId){
    await upvoteReply(replyId)
}

</script>

<template>
    <div>
        <h2 class="text-2xl">Komentar</h2>
           <div class="flex items-start space-x-4">
            <img src="https://avatars.githubusercontent.com/u/33558025?s=80&v=4" alt="Profil Photo" class="w-12 h-12 rounded-full" />
            <div class="flex-grow">
                <textarea v-model="newCommentContent" class="w-full p-2 border border-gray-300 rounded" rows="3" placeholder="Tambahkan komentar..."></textarea>
                <button @click="handleCreateComment()" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Submit</button>
            </div>
        </div>

        <div class="space-y-4">
            <button @click="handleReadAllComments()" class="bg-pink-600 p-3 text-white">Tampilkan Komentar</button>
            <button @click="handleUpdateComment('6GVwdoWPsmNYF4Ij4T3g')" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Edit</button>
            <button @click="handleDeleteComment('6GVwdoWPsmNYF4Ij4T3g')" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Delete</button>
            <pre>
                <h1>Users Comments</h1>
                {{ usersComment }}
            </pre>
            <pre>
                <h1>All Comments</h1>
                {{ allComments }}
            </pre>
        </div>

        <div>
            <h1 class="text-2xl">Balasan</h1>
            <button @click="handleCreateReply('odKOR93QZWWIOqSHX1Be')" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Create</button>            
            <button @click="handleUpdateReply('CnraLP8V8eNDTb84ljco','odKOR93QZWWIOqSHX1Be')" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Update</button>            
            <button @click="handleReadAllReplyInOneComment('odKOR93QZWWIOqSHX1Be')" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Get All</button>            
            <button @click="handleDeleteReply('GaIwFFgRuheY0RBJHkxB', 'odKOR93QZWWIOqSHX1Be')" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Delete</button>            
            <button @click="handleUpvoteReply('CnraLP8V8eNDTb84ljco')" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Upvote</button>            
            <pre>
                {{ allReplies }}
            </pre>
        </div>
    </div>
</template>