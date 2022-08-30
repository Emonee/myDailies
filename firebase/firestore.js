import { app } from "./auth"
import { getFirestore, setDoc, getDocs, doc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, collection, addDoc } from 'firebase/firestore/lite'

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
    .then(docSnaps => setDailies(docSnaps.docs.map(doc => doc.data())))
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
  const docRef = doc(db, 'dailies', userId)
  return updateDoc(docRef, { dailies: arrayRemove(dailyToDelete) })
}

export const toogleDaily = (userId, daily) => {
  const dailyStatus = daily.completed
  const docRef = doc(db, 'dailies', userId)
  updateDoc(docRef, { dailies: arrayRemove(daily) })
  return updateDoc(docRef, {
    dailies: arrayUnion({
      ...daily,
      completed: !dailyStatus
    })
  })
}