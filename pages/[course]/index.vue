<script setup>
import { useCurrentUser } from "@/composables/user/useCurrentUser";
import { createReview } from "@/utils/course-review/createReview";
import { readAllReview } from "@/utils/course-review/readAllReview";
import { editReview } from "@/utils/course-review/editReview";
import { deleteReview } from "@/utils/course-review/deleteReview";

const route = useRoute();
const currentUser = useCurrentUser();

const courseSlug = route.params.course;
const courseQuery = groq`*[_type == "course" && slug.current == "${courseSlug}"][0]`;
const { data: courseData } = await useSanityQuery(courseQuery);

const courseContentQuery = groq`*[_type == "course" && slug.current == "${courseSlug}"]{
  "content": *[_type == "content" && course._ref == ^._id]{title, slug, orderRank} | order(orderRank asc)
}`;

const { data: courseContentData } = await useSanityQuery(courseContentQuery);
const courseContent = courseContentData.value[0].content;

console.log(courseData.value);

// REVIEW FUNCTIONALITY
// 1. Create Review
const reviewContent = ref("");
const reviewRating = ref(0);

async function handleSubmitReview() {
    const newReview = await createReview(currentUser.value, reviewContent.value, reviewRating.value, courseData.value._id);
    reviewContent.value = "";
    reviewRating.value = 0;
    //TODO: get all review in this course
}

// 2. Read all review and users review
const allReview = ref([]);
const usersReview = ref(null);

async function handleReadAllReview() {
    console.log("Read all review");
    const allReviewResult = await readAllReview(courseData.value._id);
    allReview.value = allReviewResult;
    // get review that have the same userId as current logged in user
    console.log(currentUser.value.uid);
    const fetchedUsersReview = allReviewResult.filter((review) => review.userId === currentUser.value.uid);
    usersReview.value = fetchedUsersReview[0];

    console.log("All Review in this course", allReview.value);
    console.log("User's value", usersReview.value);
}

// 4. Edit Review
const newReviewContent = ref("");

async function handleEditReview() {
    const editReviewResult = await editReview(usersReview.value.id, newReviewContent.value);
    console.log("EDIT REVIEW RESULT", editReviewResult)
    newReviewContent.value = "";
    usersReview.value = editReviewResult
}

// 5. Delete Review
async function handleDeleteReview(){
    await deleteReview(usersReview.value.id)
    usersReview.value = null
}

</script>

<template>
    <div class="container mx-auto mt-8 p-8">
        <pre>
            {{ courseData }}
        </pre>
        <h1 class="text-3xl font-bold">{{ courseData.title }}</h1>
        <h2 class="text-xl font-semibold text-gray-600 mt-2">{{ courseData.shortDescription }}</h2>
        <div class="flex justify-between mt-4">
            <div class="w-1/2">
                <h3 class="text-lg font-semibold">Deskripsi Kursus</h3>
                <p class="text-gray-600">{{ courseData.description }}</p>
                <h3 class="text-lg font-semibold mt-4">TIngkat kesulitan</h3>
                <p class="text-gray-600">{{ courseData.difficulty }}</p>
            </div>
            <div class="w-1/2">
                <h3 class="text-lg font-semibold">Ruang lingkup</h3>
                <p class="text-gray-600">{{ courseData.learningScope }}</p>
                <h3 class="text-lg font-semibold mt-4">Prerequisites</h3>
                <p class="text-gray-600">{{ courseData.prerequisites }}</p>
                <h3 class="text-lg font-semibold mt-4">Harga</h3>
                <p class="text-gray-600">{{ courseData.price }}</p>
            </div>
        </div>
        <h1 class="text-3xl font-bold">Daftar konten</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            <div v-for="course in courseContent" :key="course.slug" class="bg-white p-4 rounded shadow">
                <h2 class="text-lg font-semibold">{{ course.title }}</h2>
                <p class="text-gray-600 mt-2">{{ course.excerpt }}</p>
                <NuxtLink :to="`/${courseData.slug.current}/${course.slug.current}`" class="mt-4 block text-blue-500 font-semibold hover:text-blue-700"> Mulai Belajar </NuxtLink>
            </div>
        </div>

        <div v-if="currentUser" class="pb-8 border-b-amber-700">
            <h1 class="text-3xl mt-3">Review User</h1>
            <div class="flex flex-col">
                <img :src="currentUser.photoURL" alt="profile-picture" class="h-20 w-20 mr-2" />
                <h2>Rating</h2>
                <input type="number" class="w-8" v-model="reviewRating" />
                <h2>Review</h2>
                <textarea class="flex-grow h-16 w-64" placeholder="Tulis Review Anda" v-model="reviewContent"></textarea>
                <button class="bg-pink-200 p-2 mt-2" @click="handleSubmitReview()">Berikan Review</button>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <button @click="handleReadAllReview()" class="bg-blue-300 p-3">Show Reviews</button>

            <div v-if="usersReview">
                <h2 class="text-3xl">Review anda</h2>
                <div>
                    <img :src="usersReview.photoUrl" alt="profilePic" class="w-10 h-10" />
                    <p class="font-bold">{{ usersReview.username }}</p>
                    <p class="font-bold text-yellow-600">Bintang {{ usersReview.rating }}</p>
                    <p>{{ usersReview.content }}</p>
                    <p>Jumlah terbantu: {{ usersReview.upvotes }}</p>
                    <div>
                        <input type="text" v-model="newReviewContent" /><br />
                        <button @click="handleEditReview()" class="p-3 bg-green-600 text-white mr-2">Edit</button>
                        <button @click="handleDeleteReview()" class="p-3 bg-red-600 text-white">Delete</button>
                    </div>
                </div>
            </div>

            <div v-if="allReview">
                <template v-for="review in allReview" :key="review.id">
                    <div v-if="review.userId !== currentUser.uid">
                        <img :src="review.photoUrl" alt="profilePic" class="w-10 h-10" />
                        <p class="font-bold">{{ review.username }}</p>
                        <p class="font-bold text-yellow-600">Bintang {{ review.rating }}</p>
                        <p>{{ review.content }}</p>
                        <p>Jumlah terbantu: {{ review.upvotes }}</p>
                    </div>
                </template>
                <pre>
                {{ allReview }}
              </pre
                >
            </div>
        </div>
    </div>
</template>