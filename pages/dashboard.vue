<template>
    <div>
        <h1 class="text-3xl my-8">Kursusku</h1>

        <button class="p-3 bg-pink-600 text-white" @click="handleGetUsersProgress()">Ambil progress</button>
        <pre>
            {{ usersProgress }}
        </pre>

        <h1 class="text-3xl my-8">Akunku</h1>
        <h2>User Data</h2>
        <pre>
            {{ currentUser }}
        </pre>

        <div v-if="currentUser">
            <div class="w-20 p-2 border border-slate-200">
                <img :src="currentUser.photoURL" alt="" />
            </div>
            <h1 class="text-2xl">{{ currentUser.displayName }}</h1>
            <div class="flex flex-col gap-4 w-40 mt-4">
                <!-- Ganti Nama -->
                <h1>Ganti Nama</h1>
                <input type="text" placeholder="Nama Baru" v-model="namaBaru"/>
                <va-button @click="gantiNama()">Ganti Nama</va-button>
                
                <!-- Ganti Profile Picture -->
                <h1>Ganti Profile Picture</h1>
                <va-file-upload v-model="newProfilePictureImage" />
                <va-button @click="uploadPP">Upload new picture</va-button>


                <va-button>Reset Password</va-button>
                <va-button @click="handleDeleteAccount()">Hapus Akun</va-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { updateProfile } from "firebase/auth";
import { useCurrentUser } from "@/composables/user/useCurrentUser";
import { uploadProfilePicture } from "@/utils/user/uploadProfilePicture";
import { deleteAccount } from "@/utils/user/deleteAccount"
import { getProgressDashboard } from "~~/utils/progress/getProgressDashboard";
const { $auth, $storage } = useNuxtApp();

console.log("$auth: ", $auth)
console.log("$storage: ", $storage)
const currentUser = useCurrentUser();

// Get Informasi progress kursus user
const usersProgress = ref(null)
async function handleGetUsersProgress(){
    usersProgress.value = await getProgressDashboard(currentUser.value.uid)
}

//TODO: Still Null
if(currentUser.value){
    console.log("Current User di dashboard", currentUser.value);
}

// Ganti Nama
const namaBaru = ref("");
async function gantiNama() {
    try {
        await updateProfile(currentUser.value, { displayName: namaBaru.value })
        alert("berhasil mengganti nama")
    } catch (error) {
        console.log(error);
    }
}

// Upload Profile Picture
const newProfilePictureImage = ref([])
async function uploadPP(){
    const profilePictureUrl = await uploadProfilePicture(newProfilePictureImage.value[0], currentUser.value.uid)
    updateProfile(currentUser.value, {photoURL: profilePictureUrl})
}

// Delete Account
// butuh reauthenticate
async function handleDeleteAccount(){
    await deleteAccount(currentUser.value)
}

</script>