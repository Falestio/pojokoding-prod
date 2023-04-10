<template>
    <div>
        <p>User</p>
        <pre>
            {{ currentUser }}
        </pre>
    </div>
</template>

<script setup>
import { useCurrentUser } from "~~/composables/user/useCurrentUser"

definePageMeta({
  middleware: ["auth-client"]
})

const { $auth } = useNuxtApp()
const currentUser = useCurrentUser()


</script>