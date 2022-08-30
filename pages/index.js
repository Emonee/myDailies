import { useEffect, useState } from "react"
import { loginWithGoogle, something, logOut, auth } from "../firebase/auth"
import { insertNewDailies, addNewDailie, deleteDaily, toogleDaily, listenAllDailies } from "../firebase/firestore"

export default function Home() {
  const [user, setUser] = useState(null)
  const [dailies, setDailies] = useState(null)
  const [newDailyText, setNewDailyText] = useState('')

  useEffect(() => something(setUser), [user])
  useEffect(() => {
    let unsubscribe
    if (user) {
      unsubscribe = listenAllDailies(auth.currentUser.uid, setDailies)
    }
    return () => unsubscribe && unsubscribe()
  }, [user])

  const handleClick = () => loginWithGoogle(setUser)
  const logout = () => logOut(setUser)
  const setFirstDaily = () => insertNewDailies(auth.currentUser.uid)
  const handleChange = ({ target }) => setNewDailyText(target.value)
  const createDaily = () => addNewDailie(auth.currentUser.uid, newDailyText)
  const updateDaily = (daily) => toogleDaily(auth.currentUser.uid, daily)
  const removeDaily = (daily) => deleteDaily(auth.currentUser.uid, daily)
  
  return (
    <>
      { user ?
        <>
          <h1>Hola {user}</h1>
          <button onClick={logout}>Log out</button>
          <button onClick={setFirstDaily}>Set first Daily</button>
          <u>
            {dailies && dailies.map(daily => (
              <>
                <li key={daily.id}>
                  {daily.content} is {daily.completed ? 'Completed' : 'Unfinished'}
                  <button onClick={() => updateDaily(daily)}>Check/Uncheck</button>
                  <button onClick={() => removeDaily(daily)}>Delete</button>
                </li>
              </>
            ))}
          </u>
          <button onClick={createDaily}>Add daily</button>
          <input onChange={handleChange} value={newDailyText}/>
        </> :
        <button onClick={handleClick}>Sign in with google</button>
      }
    </>
  )
}
