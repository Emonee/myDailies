import { app } from "./auth"
import { getFirestore, setDoc, getDocs, doc, serverTimestamp, updateDoc, collection, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore'

const db = getFirestore(app)

export const listenAllDailies = (userId, callback) => {
  const dailiesSubCollection = collection(db, `users/${userId}/dailies`)
  return onSnapshot(dailiesSubCollection, ({ docs }) => {
    callback(docs.map(doc => ({...doc.data(), id: doc.id})))
  })
}

export const addNewDailie = (userId, newDailyText) => {
  const dailiesSubCollection = collection(db, `users/${userId}/dailies`)
  return addDoc(dailiesSubCollection, {
    completed: false,
    content: newDailyText
  })
}

export const deleteDaily = (userId, dailyToDelete) => {
  const docRef = doc(db, `users/${userId}/dailies`, dailyToDelete.id)
  return deleteDoc(docRef)
}

export const toogleDaily = (userId, daily) => {
  const { id, completed } = daily
  const docRef = doc(db, `users/${userId}/dailies`, id)
  return updateDoc(docRef, { completed: !completed })
}
