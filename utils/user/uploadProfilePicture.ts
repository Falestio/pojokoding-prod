import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'


export const uploadProfilePicture = async (file: any, userId: string) => {
    if(file && userId) {    
        const { $storage } = useNuxtApp()
        const storageRef = ref($storage, `users/${userId}/profilePicture`)
        const snapshot = await uploadBytes(storageRef, file)
        const pictureUrl = getDownloadURL(snapshot.ref)
        return pictureUrl
    } else {
        alert('File or userId is not provided')
    }
}