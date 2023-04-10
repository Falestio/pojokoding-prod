<template>
  <div>
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from '@firebase/auth';
import { useCurrentUser } from './composables/user/useCurrentUser';

onMounted(async () => {
  console.log("Mounting...")
  await getUser()
})

async function getUser(){ 
  const { $auth } = useNuxtApp()
  const userState = useCurrentUser()
  await onAuthStateChanged($auth, async (user) => {
    if(user){
      console.log(user)

      userState.value = user
    } else {
      console.log("User is not logged in")
      userState.value = null
    }
  })
  
}

</script>