// Context Module Functions
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import {dequal} from 'dequal'

// ./context/user-context.js

import * as userClient from '../user-client'
import {useAuth} from '../auth-context'

// 1) Firstly lets define our context API with `createContext`.
// We going to store our context values 📦 (state object and dispatch).
const UserContext = React.createContext()
UserContext.displayName = 'UserContext'

// 2) User information (state) is managed by our reducer ✂️:
function userReducer(state, action) {
  switch (action.type) {
    case 'start update': {
      return {
        ...state,
        user: {...state.user, ...action.updates},
        status: 'pending',
        storedUser: state.user,
      }
    }
    case 'finish update': {
      return {
        ...state,
        user: action.updatedUser,
        status: 'resolved',
        storedUser: null,
        error: null,
      }
    }
    case 'fail update': {
      return {
        ...state,
        status: 'rejected',
        error: action.error,
        user: state.storedUser,
        storedUser: null,
      }
    }
    case 'reset': {
      return {
        ...state,
        status: null,
        error: null,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// 2) The above reducer is used by our <Provider> 👨🏻:
// We dispatch and match an action to determine the context value returned.
function UserProvider({children}) {
  const {user} = useAuth()
  const [state, dispatch] = React.useReducer(userReducer, {
    status: null,
    error: null,
    storedUser: user,
    user,
  })
  const value = [state, dispatch]
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
// 3) We consume 🛍 our <Provider> with `useContext` in a custom 🪝:
function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }
  return context
}

async function updateUser(dispatch, user, update) {
  dispatch({type: 'start update', updates: update})
  try {
    const updatedUser = await userClient.updateUser(user, update)
    dispatch({type: 'finish update', updatedUser})
    return updatedUser
  } catch (error) {
    dispatch({type: 'fail update', error})
    throw error
  }
}

// 🐨 add a function here called `updateUser`
// Then go down to the `handleSubmit` from `UserSettings` and put that logic in
// this function. It should accept: dispatch, user, and updates

// export {UserProvider, useUser, updateUser}

// src/screens/user-profile.js
// import {UserProvider, useUser} from './context/user-context'

// 4) Lastly our component ⚙️ makes use of the `useUser` custom hook.
// We returned context that holds state and a dispatch function.
function UserSettings() {
  const [{user, status, error}, userDispatch] = useUser()

  const isPending = status === 'pending'
  const isRejected = status === 'rejected'

  const [formState, setFormState] = React.useState(user)

  const isChanged = !dequal(user, formState)

  function handleChange(e) {
    setFormState({...formState, [e.target.name]: e.target.value})
  }

  function handleSubmit(event) {
    event.preventDefault()
    updateUser(userDispatch, user, formState)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{marginBottom: 12}}>
        <label style={{display: 'block'}} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          disabled
          readOnly
          value={formState.username}
          style={{width: '100%'}}
        />
      </div>
      <div style={{marginBottom: 12}}>
        <label style={{display: 'block'}} htmlFor="tagline">
          Tagline
        </label>
        <input
          id="tagline"
          name="tagline"
          value={formState.tagline}
          onChange={handleChange}
          style={{width: '100%'}}
        />
      </div>
      <div style={{marginBottom: 12}}>
        <label style={{display: 'block'}} htmlFor="bio">
          Biography
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formState.bio}
          onChange={handleChange}
          style={{width: '100%'}}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            setFormState(user)
            userDispatch({type: 'reset'})
          }}
          disabled={!isChanged || isPending}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={(!isChanged && !isRejected) || isPending}
        >
          {isPending
            ? '...'
            : isRejected
            ? '✖ Try again'
            : isChanged
            ? 'Submit'
            : '✔'}
        </button>
        {isRejected ? <pre style={{color: 'red'}}>{error.message}</pre> : null}
      </div>
    </form>
  )
}

function UserDataDisplay() {
  const [{user}] = useUser()
  return <pre>{JSON.stringify(user, null, 2)}</pre>
}

function App() {
  return (
    <div
      style={{
        minHeight: 350,
        width: 300,
        backgroundColor: '#ddd',
        borderRadius: 4,
        padding: 10,
      }}
    >
      <UserProvider>
        <UserSettings />
        <UserDataDisplay />
      </UserProvider>
    </div>
  )
}

export default App
