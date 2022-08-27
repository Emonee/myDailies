import { firebaseConfig } from "./config"
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth"

export const app = initializeApp(firebaseConfig)

export const auth = getAuth()

export const something = setUser => {
  return onAuthStateChanged(auth, user => {
    user && setUser(user.displayName)
  })
}

export const loginWithGoogle = setUser => {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
    .then(res => setUser(res.user.displayName))
    .catch(err => console.error(err))
}

export const logOut = setUser => {
  return signOut(auth)
    .then(() => setUser(null))
    .catch(err => console.error(err))
}
