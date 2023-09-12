import { deleteUser } from "firebase/auth";

export const deleteAccount = async (user: any) => {
    deleteUser(user).then(() => {
        alert("user is deleted")
      }).catch((error) => {
        console.log(error) 
      });
}