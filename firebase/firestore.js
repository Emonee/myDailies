import { app } from "./auth"
import { getFirestore, setDoc, getDocs, doc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, collection, addDoc, deleteDoc, documentId } from 'firebase/firestore/lite'

const db = getFirestore(app)

export const insertNewDailies = userId => {
  const userDailiesCollection = doc(db, 'dailies', userId)
  return setDoc(userDailiesCollection, {
    dailies: [{ id: Date.now(), text: 'Mi primera daily!', completed: false }],
    lastTimeOnApp: serverTimestamp()
  })
}

export const getDailies = (userId, setDailies) => {
  const dailiesSubCollection = collection(db, `users/${userId}/dailies`)
  return getDocs(dailiesSubCollection)
    .then(docSnaps => setDailies(docSnaps.docs.map(doc => ({...doc.data(), id: doc.id}))))
    .catch(err => console.error(err))
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
