import { onAuthStateChanged } from "@firebase/auth";
import { useCurrentUser } from "../composables/user/useCurrentUser";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        const { $auth } = useNuxtApp();
        const userState = useCurrentUser();

        console.log("User state sebelum onAuthStateChange: ", userState.value);
        return onAuthStateChanged($auth, async (user) => {
            console.log("OnAuthStateChanged: ", user)
            if (user) {
                // @ts-ignore
                userState.value = user;
            } else {
                userState.value = null;
            }
        });
    }
});
    