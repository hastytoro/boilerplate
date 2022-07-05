import React from 'react'
import {createRoot} from 'react-dom/client'
import {Logo} from 'components/logo'

import '@reach/dialog/styles.css'
import {Dialog} from '@reach/dialog'

function Form({onSubmit, buttonText}) {
  const handleSubmit = event => {
    event.preventDefault()
    const {username, password} = event.target.elements
    onSubmit({
      username: username.value,
      password: password.value,
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">
          Username:
          <input id="username" type="text" />
        </label>
      </div>
      <div>
        <label htmlFor="password">
          Password:
          <input id="password" type="password" />
        </label>
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}

function App() {
  const [openModal, setOpenModal] = React.useState('none')

  const handleLogin = FormData => {
    console.log('login', FormData)
  }
  const handleRegister = FormData => {
    console.log('register', FormData)
  }

  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setOpenModal('login')}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>
      <Dialog aria-label="Login form" isOpen={openModal === 'login'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Login</h3>
        <Form onSubmit={handleLogin} buttonText="Login" />
      </Dialog>
      <Dialog aria-label="Register form" isOpen={openModal === 'register'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Register</h3>
        <Form onSubmit={handleRegister} buttonText="Register" />
      </Dialog>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
export {root}
