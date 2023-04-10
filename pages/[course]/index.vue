<script setup>
const route = useRoute();

const courseSlug = route.params.course;
const courseQuery = groq`*[_type == "course" && slug.current == "${courseSlug}"][0]`;
const { data: courseData } = await useSanityQuery(courseQuery);

const courseContentQuery = groq`*[_type == "content" && course._ref == "05a58cb4-d523-430f-bee9-37087b44c366"]`;
const { data: courseContentData } = await useSanityQuery(courseContentQuery);
</script>

<template>
    <div class="container mx-auto mt-8 p-8">
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
                <h3 class="text-lg font-semibold">Ruang lingkup </h3>
                <p class="text-gray-600">{{ courseData.learningScope }}</p>
                <h3 class="text-lg font-semibold mt-4">Prerequisites</h3>
                <p class="text-gray-600">{{ courseData.prerequisites }}</p>
                <h3 class="text-lg font-semibold mt-4">Harga</h3>
                <p class="text-gray-600">{{ courseData.price }}</p>
            </div>
        </div>
        <h1 class="text-3xl font-bold">Daftar konten</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <div v-for="course in courseContentData" :key="course.slug" class="bg-white p-4 rounded shadow">
            <h2 class="text-lg font-semibold">{{ course.title }}</h2>
            <p class="text-gray-600 mt-2">{{ course.excerpt }}</p>
            <NuxtLink :to="`/${courseData.slug.current}/${course.slug.current}`" class="mt-4 block text-blue-500 font-semibold hover:text-blue-700">
              Lihat Kursus
            </NuxtLink>
          </div>
        </div>
    </div>
</template>