<template>
    <div class="h-screen w-full">
        <div class="bg-slate-200 p-5 flex flex-col gap-3 w-[400px] mx-auto mt-20">
            <h1 class="text-2xl">Daftar</h1>
            <input type="text" placeholder="Username" class="p-3" v-model="username">
            <input type="email" placeholder="Email" class="p-3" v-model="email">
            <input type="password" placeholder="Password" class="p-3" v-model="password">
            <button class="bg-blue-300 p-3" @click="handleRegister()">Daftar</button>
        </div>
    </div>
</template> 

<script setup>
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { setDoc, doc } from '@firebase/firestore';
const { $auth, $db } = useNuxtApp()

const email = ref("");
const password = ref("");
const username = ref("");

const handleRegister = async () => {
    // Membuat user dengan email dan password
    const registeredUser = await createUserWithEmailAndPassword($auth, email.value, password.value)
    
    // Modifikasi data yang dimiliki oleh user
    const userWithEditedProfile = await updateProfile($auth.currentUser, {
        displayName: username.value,
        photoURL: `https://avatars.dicebear.com/api/micah/${username.value}.svg`
    })
    
    // Objek data tambahan untuk user
    const data = {
        premium: false,
    }

    // Memasukan data tambahan dengan id dari user sebagai referensi
    const newUserData = await setDoc(doc($db, "users", $auth.currentUser.uid), data) 

    // Arahkan user ke dashboard
    navigateTo('/dashboard')   
}
</script>