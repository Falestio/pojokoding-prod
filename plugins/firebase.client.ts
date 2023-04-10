import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


export default defineNuxtPlugin((nuxtApp) => {
    const config = {
        apiKey: "AIzaSyDzw8A4l6p1qAFebUJYHdwwbwg2-kgYXk0",
        authDomain: "pojokoding-test.firebaseapp.com",
        projectId: "pojokoding-test",
        storageBucket: "pojokoding-test.appspot.com",
        messagingSenderId: "323633569210",
        appId: "1:323633569210:web:932d505cac802fb4599183"
    }
    
    const app = initializeApp(config)
    const auth = getAuth(app) 
    const db = getFirestore(app)

    nuxtApp.provide("auth", auth)
    nuxtApp.provide("db", db)
})