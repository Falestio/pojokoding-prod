import { useCurrentUser } from "~~/composables/user/useCurrentUser";

export default defineNuxtRouteMiddleware((to, from) => {
    console.log("Auth middleware");
    const currentUser = useCurrentUser()
    if (!currentUser.value) {
        return '/login'
    }
});
