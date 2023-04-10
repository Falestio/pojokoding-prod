<script setup>
const query = groq`*[_type == "course"]`;
const { data: courses } = await useSanityQuery(query);
</script>

<template>
    <div>
        <section id="head" class="h-[60vh] container flex justify-center items-center">
            <div class="contain flex flex-col gap-12 justify-center">
                <div>
                    <h1 class="text-6xl font-bold text-center">Pojokoding</h1>
                    <p class="text-2xl text-center">Repository Panduan Koding Berbahasa Indonesia</p>
                </div>
                <va-button size="large" class="mx-auto"> Lihat Daftar Kursus </va-button>
                <div class="grid grid-cols-3">
                    <div class="text-center">
                        <va-icon size="4rem" name="text_fields"></va-icon>
                        <p class="text-xl font-bold mt-2">Pembelajaran dengan text</p>
                    </div>
                    <div class="text-center">
                        <va-icon size="4rem" name="terminal"></va-icon>
                        <p class="text-xl font-bold mt-2">Banyak Latihannya!</p>
                    </div>
                    <div class="text-center">
                        <va-icon size="4rem" name="check_circle"></va-icon>
                        <p class="text-xl font-bold mt-2">Progress Belajar Kamu Tersimpan</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="courses">
            <div class="contain">
                <h2 class="text-5xl mb-8">Daftar Kursus</h2>
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
        </section>
    </div>
</template>

<style>
.contain {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
}

@media (min-width: 768px) {
    .contain {
        width: 750px;
    }
}
@media (min-width: 992px) {
    .contain {
        width: 970px;
    }
}
@media (min-width: 1200px) {
    .contain {
        width: 1170px;
    }
}
</style>