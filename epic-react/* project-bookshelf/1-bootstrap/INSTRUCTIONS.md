# Render a React App

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

The first step to any React app is to create a component and render it to the
page. In modern applications with modern tools, you'll import React and ReactDOM
and use them to create your `react-element`, and render them.

## Exercise

Let's start out by rendering our awesome logo and the title of our app.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import {Logo} from 'components/logo'

function App() {
  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => alert('login clicked')}>Login</button>
      </div>
      <div>
        <button onClick={() => alert('register clicked')}>Register</button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

**Files:**

- `src/index.js`

## Extra Credit

### 1. 💯 Use `@reach/dialog`

When the user clicks the buttons, we should open a modal with a form for them to
provide their username and password.

In this extra credit, get the `Dialog` component from `@reach/dialog` and make
it open when the user clicks the our buttons. It's a fantastic component with a
great API and fantastic accessibility characteristics,
[reach/dialog](https://reacttraining.com/reach-ui/dialog).

There are many ways to toggle state. Here lets render between the two individual
dialogs and toggle which is open based on a `openModal` state.

Don't forget to include the styles: `import '@reach/dialog/styles.css'`

```jsx
import '@reach/dialog/styles.css'
import {Dialog} from '@reach/dialog'

function App() {
  const [openModal, setOpenModal] = React.useState('none')
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
      </Dialog>
      <Dialog aria-label="Register form" isOpen={openModal === 'register'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Register</h3>
      </Dialog>
    </div>
  )
}
```

In review, what we did here to make all of this work, we pulled in the `Dialog`
from the `@reach` component library for the `{ Dialog }`. A reach UI requirement
is to pull in styles from `@reach/dialog/styles.css`. Then we rendered that
Dialog component differently depending, using the `isOpen` prop.

Example the login button, set managed state to `login`. That determined whether
Dialog should be open. We did the exact same thing for our registration.

**Files:**

- `src/index.js`

### 2. 💯 Create a LoginForm component

Here we define a `<Form />` components which renders a form accepting a username
and password. When the user submits the form, it should call an `onSubmit` prop
with the `username` and `password`. Here's how it will be used:

```javascript
function App() {
  const [openModal, setOpenModal] = React.useState('none')
  const handleLogin = FormData => console.log('login', FormData)
  const handleRegister = FormData => console.log('register', FormData)
  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      {/* Will toggle different modal state */}
      <div>
        <button onClick={() => setOpenModal('login')}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>

      {/* Toggled depending on state change */}
      <Dialog aria-label="Login form" isOpen={openModal === 'login'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Login</h3>
        <Form onSubmit={handleLogin} buttonText="Login" />
      </Dialog>
      {/* Toggled depending on state */}
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
```

In review, we created a reusable form component within our two modals. We pass
handlers and button names down toward our `Form` component.

```jsx
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
```

We lifting our data produced in our `Form` by invoking a callback handler that
was passed a prop. Separately the component itself has a `onSubmit` event wired
up to its handler that grabs values after preventing the default behavior of a
full-page refresh, by the HTML form element.

Again, we invoke the callback that was passed down as a prop handler, and
provide it destructed form data, as a object. Then for now, we just console
logging that object. But we'll likely interact with a backend.

**Files:**

- `src/index.js`
