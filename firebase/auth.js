import { firebaseConfig } from "./config"
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth"
import { addNewUserWithBasicSchema } from "./firestore";

export const app = initializeApp(firebaseConfig)

export const auth = getAuth()

export const something = setUser => {
  return onAuthStateChanged(auth, user => {
    user && setUser(user.displayName)
  })
}

export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
    .then(({ user }) => addNewUserWithBasicSchema(user.uid))
    .catch(err => console.error(err))
}

export const logOut = setUser => {
  return signOut(auth)
    .then(() => setUser(null))
    .catch(err => console.error(err))
}
