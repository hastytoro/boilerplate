# Authentication

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

### Authenticated HTTP requests

Applications without user authentication cannot reliably store and present data
tied to a specific user. And users expect the ability to save data, close the
app, and return to the app and interact with the same data they created. To do
this securely (in a way that doesn't allow anyone to access anyone else's data),
you need authentication. The most common approach is a username/password pair.

However, the user doesn't want to submit their password every time they need to
make a request for data. They want to be able to log into the application and
then the app can continuously authenticate requests for them automatically. That
said, we don't want to store the user's password and send that in every request.

A solution to this problem is to use a special limited use "token" which
represents the user's _current_ session. That way the token can be invalidated,
(in the case that it's lost or stolen) the user doesn't have to change their
password. They simply re-authenticate and they can get a fresh token.

Every request the client makes, must include this token to send authenticated
requests. This is one reason it's so nice to have a wrapper around `fetch` so
you can automatically include a token, in every made request . A common way to
attach the token is to use a special request header called "Authorization".
Here's an example of how to make an authenticated request:

```javascript
window.fetch('http://example.com/pets', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

That token can really be anything that uniquely identifies the user, but a
common standard is to use a [JSON Web Token 'JWT'](https://jwt.io).

Authentication and user identity management is a difficult problem, so it's
recommended to use a service to handle this for you. Most services will give you
a mechanism for retrieving a token when the user opens your application and you
can use that token to make authenticated requests to your backend.

Consider [Auth0](https://auth0.com/),
[Netlify Identity](https://docs.netlify.com/visitor-access/identity/#enable-identity-in-the-ui),
and [Firebase Authentication](https://firebase.google.com/products/auth).

Recommended, don't build the backend for authentication yourself. Instead, rely
on services that are 100% dedicated to solving this difficult problem.

Regardless of which one you choose, they pretty much all have the same idea. You
get a token. If the user's logged in, then you'll get that token you can make
authenticated requests. If they're not, then you can render a login screen where
they can authenticate. What your learn from this exercise are the same:

1. Call some API to retrieve a token.
2. If there's a token, then send it along with the requests you make.

```javascript
const token = await authProvider.getToken()
const headers = {
  Authorization: token ? `Bearer ${token}` : undefined,
}
window.fetch('http://example.com/pets', {headers})
```

### Auth in React

In React applications you manage user `[auth]` state the same way you manage any
state: `useState` + `useEffect` (for making the request). When the user provides
a username and password, you make a request and if the request is successful,
you can then use that token to send additional auth requests. In addition to the
token, the server will often respond with the user's info, which you can store
in state and use it to display the user's data.

The easiest way to manage displaying the right content to the user based on
whether they've logged in, is to split your app into two parts:

Authenticated, and Unauthenticated. Then you choose which to render based on
whether you have the user's information.

And when the app loads in the first place, you'll call your provider's API to
retrieve a token if the user is already logged in. If they are, show a loading
component, while you request the user data before rendering anything else. If
they aren't then you know you can render the login screen right away.

## Exercise

We're using a service called "auth provider" (it's a made-up thing, but should
give you a good idea of how to use any typical Auth provider which is the
point). Here's what you need to know about "Auth Provider":

- You import it like this: `import * as auth from 'auth-provider'`
- Here are the exports you'll need (they're all `async`):

  - `getToken()` - resolves the user token if it exists
  - `login({username, password})` - resolves to the user if successful
  - `register({username, password})` - resolves to the user if successful
  - `logout` - logs the user out

To make an authenticated request, you'll need to get the token, and attach an
`Authorization` header to the request set to: `Bearer {token}`

As for the UI, when the user registers or logs in, they should be shown the
discover page. They should also have a button to logout which will clear the
user's token from the browser and render the home page again.

```jsx
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
  const [user, setUser] = React.useState(null)
  console.log(user)
  const login = form => {
    auth.login(form).then(user => setUser(user))
  }
  const register = form => {
    auth.register(form).then(user => setUser(user))
  }
  const logout = () => {
    auth.logout()
    setUser(null)
  }
  // conditional rendering:
  return !user ? (
    // renders landing page if user is not yet authenticated.
    <UnauthenticatedApp login={login} register={register} />
  ) : (
    // renders app's main search page if successfully authorized.
    <AuthenticatedApp user={user} logout={logout} />
  )
}
```

All that we did here in our app was we brought in both a `Authenticated` side
and the `Unauthenticated` side of our App, and we determined which one of these
conditionally render based on whether we have a `[user]` in our state.

We brought in our `auth-provider` to handle all authentication functionality of
our application.

and then our logout just calls `auth.logout` and sets our user to null so that
we will render the unauthenticated portion of our app.

Unauthorized users render the `<UnauthenticatedApp>` component passing props for
`auth.login` and `auth.register` callback handlers. Example selecting Login or
Register, invokes a handler. When that promise resolves, we send/update `[user]`
state to whatever returned from the `auth.login` or `register` promise.

```jsx
function ReusableForm({onSubmit, submitButton}) {
  const {isLoading, isError, error, run} = useAsync()
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements
    run(
      onSubmit({
        username: username.value,
        password: password.value,
      }),
    )
  }
  return (
    <form
      onSubmit={handleSubmit}
      css={{ ...
      }}
    >
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>
        {React.cloneElement(
          submitButton,
          {type: 'submit'},
          ...(Array.isArray(submitButton.props.children)
            ? submitButton.props.children
            : [submitButton.props.children]),
          isLoading ? <Spinner css={{marginLeft: 5}} /> : null,
        )}
      </div>
      {isError ? <ErrorMessage error={error} /> : null}
    </form>
  )
}

function UnauthenticatedApp({login, register}) {
  return (
    <div
      css={{ ...
      }}
    >
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div
        css={{ ...
        }}
      >
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <ReusableForm
              onSubmit={login}
              submitButton={<Button variant="primary">Login</Button>}
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <ReusableForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}
```

Authorized users will render the `<AuthenticatedApp>` component passing in the
now set `[user]` state as a prop, and `auth.logout` handler when needed.

```jsx
import {DiscoverBooksScreen} from './discover'

function AuthenticatedApp({user, logout}) {
  return (
    <React.Fragment>
      <div
        css={{ ...
        }}
      >
        {user.username}
        <Button variant="secondary" css={{marginLeft: '10px'}} onClick={logout}>
          Logout
        </Button>
      </div>
      <div
        css={{ ...
          },
        }}
      >
        <DiscoverBooksScreen />
      </div>
    </React.Fragment>
  )
}
```

### Files

- `src/app.js`

## Extra Credit

### 1. 💯 Load the user's data on page load

Lets check if there's a token in `localStorage` and make a request to get the
user's info if there is on page refreshes. Luckily the backend dev's gave us an
API we can use to get the user's information by providing the token:

```javascript
let user = null
const token = await auth.getToken()
if (token) {
  // We're logged in! Let's go get the user's data
} else {
  // If no token, just exit to default login page
}
console.log('updated user object: ', user)
```

Add capability in a effect callback `useEffect` so users don't have to re-enter
username and password if the `auth` Provider has the token already. You'll also
need to add the ability to accept the `token` option in the client and set that
in the `Authorization` header (remember, `Bearer ${token}`).

We can invoke a helper function within our effect callback.

```javascript
async function getUser() {
  let user = null
  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  } else return // exit early 🔚
  return user
}

function App() {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    getUser().then(u => setUser(u))
  }, [])
  ...
}
```

In review, we defined a `async` helper function that will `await` a get user
token call via `auth.getToken`. If they're currently logged, the backend will
return a token back. We make a request to our backend with the custom `client`
API passing the token. As soon as App mounts, we trigger this effect call. When
that resolves, we then chain updating our `[user]` state. That way, the user
doesn't have to log in every time they reach our app.

```javascript
function client(
  endpoint,
  // destructing configuration for use in the `config` object:
  {token, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }
  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}
```

We added functionality in the `client` API, to include token information from
our `auth.getToken` call. It now accepts a token argument, it will destructure
off any custom config or header if provided. Conditionally if a token exists,
we'll set it to `headers` object's authorization section as needed. We (`...`)
merge "spread" all of it together before we pass it on to fetch API.

This restructured headers, allows dev's to provide their own custom headers.

**Files:**

- `src/app.js`
- `src/utils/api-client.js`

### 2. 💯 Use `useAsync`

A problem, when App renders the login screen for a bit is rendered, while it's
requesting the user's information. But remember we could get loading state and
everything via a custom `useAsync` hook. Let's update App to use `useAsync` and
solve this loading state issue. Here is what we can destructure off it:

```javascript
const {
  data: user,
  error,
  isIdle,
  isLoading,
  isSuccess,
  isError,
  run,
  setData,
} = useAsync()
```

We can conditionally render based on the returned values from our custom 🪝. For
example in `isLoading` or `isIdle` state, you can render a `FullPageSpinner`.

```jsx
function App() {
  const {
    // see above snippet.
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }
  // conditional rendering:
  if (isLoading || isIdle) return <FullPageSpinner />

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  if (isSuccess) {
    return !user ? (
      // renders landing page if user is not yet authenticated.
      <UnauthenticatedApp login={login} register={register} />
    ) : (
      // renders app's main search page if successfully authorized.
      <AuthenticatedApp user={user} logout={logout} />
    )
  }
}
```

In review, we imported a FullPageSpinner, colors, and a custom useAsync hook. We
moved our state management into our `useAsync` function. It handles everything
within a state object using React useReducer and useCallback hooks.

With `run` we can get a user as soon as this component mounts in a side-effect.
Then, when the user triggers any `onClick` event, we call the `setData` helper
returned from `useAsync` and same with register and logout. Then based on the
current `status` of our asynchronous request, if we're loading or if we haven't
started it yet, then we'll show the FullPageSpinner.

If there was an error, then we'll show this error message. If it was successful,
then we'll render the authenticated app.

**Files:**

- `src/app.js`

### 3. 💯 automatically logout on 401 (HERE)

If the user's token expires or the user does something they're not supposed to,
the backend can send a 401 request. If that happens, we want to log the user out
and page refresh automatically, so all data is removed from the page.

```javascript
import * as auth from 'auth-provider'

function client( ...
) {
  const config = { ...
  }
  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      await auth.logout()
      window.location.assign(window.location)
      return Promise.reject({message: 'Please re-authenticate'})
    }
    ...
  })
}

```

Call `auth.logout()` to ensure we delete the user's token from the Provider and
call `window.location.assign(window.location)` to force reload the page.

**Files:**

- `src/utils/api-client.js`

### 4. 💯 Support posting data

It won't be long before we need to actually start sending data along with our
requests, so let's enhance the `client` API to support that use case. Here's how
we should be able to use the `client` when this is all done:

```javascript
client('http://example.com/pets', {
  token: 'THE_USER_TOKEN',
  data: {name: 'Fluffy', type: 'cat'},
})
```

```
// results in fetch getting called with:
`url: http://example.com/pets
  config:
  - method: 'POST'
  - body: '{"name": "Fluffy", "type": "cat"}'
  - headers:
    - 'Content-Type': 'application/json'
    - Authorization: 'Bearer THE_USER_TOKEN'`
```

In review, we modified our client API so it can accept a `data` option. If we
provide that data option, then the method will default to `POST`. Of course, we
can override that if we need to for say PUT requests.

```javascript
function client(
  endpoint,
  {data, token, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }
  ...
}
```

If we pass `data` argument that will filter in a `body` property of our config
object. And if so we ternary truthy to JSON stringify that data so that it can
be set as our JSON body for a typical backend. Because it's a JSON stringified
data, we need to set that Content-Type to be `application/json` in the header.

The client is reusable, that each property can be overridden. Say we wanted to
send a body that wasn't 'Content-Type': 'application/json', we could specify our
own `customHeaders`, that will (`...`) spread "merge" nicely over as expected.

**Files:**

- `src/utils/api-client.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=04%3A%20Authentication&em=
