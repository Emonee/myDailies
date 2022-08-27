import { app } from "./auth"
import { getFirestore, setDoc, getDoc, doc, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore/lite'

const db = getFirestore(app)

export const insertNewDailies = userId => {
  const userDailiesCollection = doc(db, 'dailies', userId)
  return setDoc(userDailiesCollection, {
    dailies: [{ id: Date.now(), text: 'Mi primera daily!', completed: false }],
    lastTimeOnApp: serverTimestamp()
  })
}

export const getDailies = (useId, setDailies) => {
  const docRef = doc(db, 'dailies', useId)
  return getDoc(docRef)
    .then(docSnap => {
      if (docSnap.exists()) setDailies(docSnap.data().dailies)
      else changeText([{ id: 123, text: 'Sin dailies :(', completed: false }])
    })
    .catch(err => console.error(err))
}

export const addDailie = (userId, newDailyText) => {
  const docRef = doc(db, 'dailies', userId)
  return updateDoc(docRef, {
    dailies: arrayUnion({
      id: Date.now(),
      text: newDailyText,
      completed: false
    })
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