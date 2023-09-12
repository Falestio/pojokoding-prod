<template>
    <div>
        <h1>Daftar Kursus</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
            <template v-for="course in courses" :key="course._id">
                <div class="bg-white rounded shadow-md p-4">
                    <h2 class="text-xl font-bold mb-2">{{ course.title }}</h2>
                    <p class="text-gray-600">{{ course.shortDescription }}</p>
                    <router-link :to="`/${course.slug.current}`" class="mt-4 block text-blue-500 font-semibold hover:underline">Lihat Kursus</router-link>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
const query = groq`*[_type == "course"]`;
const { data: courses } = await useSanityQuery(query);
</script>