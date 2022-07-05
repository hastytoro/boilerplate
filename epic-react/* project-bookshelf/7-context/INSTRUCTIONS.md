# Context

## 📝 Your Notes

## Background

Once we've got all our server cache state inside `react-query`, there's not a
whole lot of global state left in our application that can't be easily managed
via a combination of React state, composition, and lifting state.

That said, there are definitely still scenarios where having UI state globally
available through context API would be valuable. Things like application "toast"
notifications, user authentication state, or modal and focus management can all
benefit from the coordination and freedom from **Prop Drilling**, that a single
global provider could provide.

For a refresher on the APIs we'll be using:

- https://reactjs.org/docs/hooks-reference.html#usecontext

## Exercise

Rather than passing the `user` object, `login`, `register`, `logout` functions
as props around, we're going to put those values in an `Context.Provider` value,
and then components "consumers" will get values they need from context.

### Files

- `src/context/auth-context.js`
- `src/app.js`
- `src/utils/list-items.js`
- `src/utils/books.js`
- `src/components/list-item-list.js`
- `src/components/status-buttons.js`
- `src/components/rating.js`
- `src/components/book-row.js`
- `src/screens/reading-list.js`
- `src/screens/finished.js`
- `src/screens/book.js`
- `src/screens/discover.js`
- `src/authenticated-app.js`
- `src/unauthenticated-app.js`

## Extra Credit

### 1. 💯 create a `useAuth` hook

Personally not a huge fan of creating context API and then only to be calling
`useContext` wherever we need to access it. I'd much prefer the ability to just
call a custom hook and get data and not care where it's coming from.

```javascript
const AuthContext = React.createContext()

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthContext provider`)
  }
  return context
}

export {AuthContext, useAuth}
```

Its annoying to have to pass the `AuthContext` around to `React.useContext`.
Additionally, if you were to accidentally use `useContext(AuthContext)` without
rendering a `AuthContext.Provider`, they would get a pretty unhelpful error
messages about not being able to destructure `undefined`. Create a custom hook
thats a "consumer" of the context from `useContext`. If you want protection to
ensure people only use it within a "provider", then you can do that.

```jsx
import {AuthContext} from './context/auth-context'

function App() {
  ...

  if (isSuccess) {
    const props = {user, login, register, logout}
    return (
      <AuthContext.Provider value={props}>
        {user ? (
          <Router>
            <AuthenticatedApp />
          </Router>
        ) : (
          <UnauthenticatedApp />
        )}
      </AuthContext.Provider>
    )
  }
}
```

In review, we made a custom hook called `useAuth`, which is the first "consumer"
of the AuthContext "context". If context is'nt defined, then you using the hook
outside of the AuthContext.Provider "provider", which is a problem. We'll give a
nice error message to explain what the problem is.

Otherwise, to simply return context values, you can now just call the `useAuth`
hook. An easier way for our main "consumers" to consume context value.

**Files:**

- `src/context/auth-context.js`
- `src/authenticated-app.js`
- `src/unauthenticated-app.js`
- `src/utils/books.js`
- `src/utils/list-items.js`

### 2. 💯 create an `AuthProvider` component

Rendering "providers" directly in regular App code is fine, but one nice way to
create a logical separation of concerns (helps maintainability) is by creating a
component who's sole purpose is manage, consume, provide authentication state.

Most of the code for this component will be moved from the `src/app.js` module
and you'll move it to the `src/context/auth-context.js` module.

```jsx
// create context API
const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

// consumer of context
function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a Auth Provider`)
  }
  return context
}

async function getUser() { ...
}

// provider component
function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => { ... }
  const register = form => { ... }
  const logout = () => { ... }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }
  if (isError) {
    return (
      <div
        css={{ ...
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }
  if (isSuccess) {
    const value = {user, login, register, logout}
    return <AuthContext.Provider value={value} {...props} />
  }
}

export {AuthProvider, useAuth}
```

We include the `AuthProvider` component that renders the `AuthContext.Provider`
Copy most of the code from the `App` component in the `src/app.js` module and
make sure that the `value` you pass to the provider is:

`value = {user, login, register, logout}`

Don't forget to export the `AuthProvider` component along with the `useAuth`
hook. And you don't need to export the `AuthContext` anymore!

```jsx
// src/index.js
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './app'
import {AuthProvider} from 'context/auth-context.exercise'

// src/Spp.js
function App() {
  const {user} = useAuth()
  return user ? (
    <Router>
      <AuthenticatedApp />
    </Router>
  ) : (
    <UnauthenticatedApp />
  )
}

const root = createRoot(document.getElementById('root'))
root.render(
  <ReactQueryConfigProvider config={queryConfig}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ReactQueryConfigProvider>,
)
```

What we've accomplished here is we drastically simplified our App component to
only care about rendering based on whether a user is authenticated, and removed
all of that logic to a new `AuthProvider`, which manages getting a user, as well
as the functions that we have for interacting with users logged in state.

As well as what we render in isLoading, isIdle, isError state. Finally, when
we're successful with isSuccess to determine if the use has authenticated state.

Then we take the `AuthProvider`, and render it around the root of our
application, so "every" component of our app has access to that providers
context value.

This means that any context API interaction is no longer accessible by any
module other than this custom one. Meaning users can not use the traditional
useContext hook, as its integrated in our custom hook module.

**Files:**

- `src/context/auth-context.js`
- `src/app.js`
- `src/index.js` (this is where you'll render the `AuthProvider`)

### 3. 💯 colocate providers and make a single "global" provider

[Production deploy](https://exercises-07-context.bookshelf.lol/extra-3)

Typically in applications, you'll have several context providers that are global
or near-global. Most of the time, it's harmless to just make them all global and
create a single provider component that brings them all together. In addition to
general "cleanup", this can help make testing easier.

Inside `src/context/index.js` module create an `AppProviders` component that:

- accepts a `children` prop
- renders all the context providers for our app:
  - `ReactQueryConfigProvider` <-- get that from the `src/index.js` module
  - `Router` <-- get that from the `src/app.js` module
  - `AuthProvider` <-- you should have created that in
    `src/context/auth-context.js`
- Pass the children along to the last provider

```javascript
function AppProviders({children}) {
  return (
    <Provider1>
      <Provider2>
        <Provider3>{children}</Provider3>
      </Provider2>
    </Provider1>
  )
}
```

We took the `Router` from our App.js, as its being rendered further up the tree.
Into global and central place for all Providers.

Now we have global context providers from our entry file in the `index.js` and
moved those to a `AppProvider`, as well as all configuration for our provider.
Then we exported the component, and was able to clean up our code.

```jsx
// src/App.js
function App() {
  const {user} = useAuth()
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

// src/index.js
const root = createRoot(document.getElementById('root'))
root.render(
  <AppProviders>
    <App />
  </AppProviders>,
)
```

Here's how it'll look:

```jsx
// src/context/app-providers.js
const queryConfig = {
  retry(failureCount, error) {
    if (error.status === 404) return false
    else if (failureCount < 2) return true
    else return false
  },
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

function AppProviders({children}) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </ReactQueryConfigProvider>
  )
}

export {AppProviders}
```

**Files:**

- `src/index.js`
- `src/context/index.js`
- `src/app.js`
