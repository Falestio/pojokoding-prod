<template>
    <va-navbar color="primary">
        <template #left>
            <va-navbar-item class="navbar-item-slot">
                <h1 class="text-3xl">
                  <nuxt-link to="/">Pojokoding</nuxt-link>
                </h1>
            </va-navbar-item>
        </template>
        <template #right>
            <va-navbar-item class="navbar-item-slot">
                <div class="flex gap-4 items-center">
                    <nuxt-link to="ide">Demo fitur latihan</nuxt-link>
                    <nuxt-link to="/login">Masuk</nuxt-link>
                    <nuxt-link to="/register">Daftar</nuxt-link>
                    <nuxt-link @click="handleLogout()" class="cursor-pointer">Keluar</nuxt-link>
                    <nuxt-link to="/dashboard">Dashboard</nuxt-link>
                    <div class="w-10" v-if="currentUser">
                        <img :src="currentUser.photoURL" alt="Profile picture">
                    </div>
                    <p v-if="currentUser">Hallo, {{ currentUser.displayName }}</p>
                </div>
            </va-navbar-item>
        </template>

        <va-navbar-item class="navbar-item-slot"></va-navbar-item>
    </va-navbar>
</template>

<script setup>
import { signOut } from "@firebase/auth";
import { useCurrentUser } from "~~/composables/user/useCurrentUser"
const { $auth } = useNuxtApp();

const currentUser = await useCurrentUser()

const handleLogout = async () => {
    await signOut($auth);
    navigateTo("/");
};
</script>