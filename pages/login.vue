<template>
    <div class="h-screen w-full">
        <div class="bg-slate-200 p-5 flex flex-col gap-3 w-[400px] mx-auto mt-20">
            <h1 class="text-2xl">Masuk</h1>
            <input type="email" placeholder="Email" class="p-3" v-model="email">
            <input type="password" placeholder="Password" class="p-3" v-model="password">
            <button class="bg-blue-300 p-3" @click="handleLogin()">Masuk</button>
        </div>
    </div>
</template>

<script setup>
import { signInWithEmailAndPassword } from '@firebase/auth';
const { $auth } = useNuxtApp()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    const loggedInUser = await signInWithEmailAndPassword($auth, email.value, password.value)
    navigateTo('/dashboard')
}
</script>