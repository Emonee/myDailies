import { firebaseConfig } from "./config"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, serverTimestamp, updateDoc, collection, addDoc, deleteDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'

const db = getFirestore(initializeApp(firebaseConfig))

export async function addNewUserWithBasicSchema(userId) {
  const docRef = doc(db, 'users', userId)
  const userData = await getDoc(docRef)
  if (userData.exists()) return
  setDoc(docRef, { lastConection: serverTimestamp() })
    .then(() => addNewDailie(userId, 'My first daily!'))
}

export function listenAllDailies(userId, callback) {
  const dailiesSubCollection = collection(db, `users/${userId}/dailies`)
  return onSnapshot(dailiesSubCollection, ({ docs }) => {
    callback(docs.map(doc => ({...doc.data(), id: doc.id})))
  })
}

export function addNewDailie(userId, newDailyText) {
  const dailiesSubCollection = collection(db, `users/${userId}/dailies`)
  return addDoc(dailiesSubCollection, {
    completed: false,
    content: newDailyText
  })
}

export function deleteDaily(userId, dailyToDelete) {
  const docRef = doc(db, `users/${userId}/dailies`, dailyToDelete.id)
  return deleteDoc(docRef)
}

export function toogleDaily(userId, daily) {
  const { id, completed } = daily
  const docRef = doc(db, `users/${userId}/dailies`, id)
  return updateDoc(docRef, { completed: !completed })
}

export function registerDateConection(userId) {
  const docRef = doc(db, 'users', userId)
  updateDoc(docRef, { lastConection: serverTimestamp() })
    .catch(err => console.error(err))
}
