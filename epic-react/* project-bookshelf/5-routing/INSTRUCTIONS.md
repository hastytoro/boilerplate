# Routing

## 📝 Your Notes

## Background

The URL is arguably one of the best features of the web. The ability for one
user to share a link to another user who can use it to go directly to a piece of
content on a given website is fantastic. Other platforms don't really have this.

The de-facto standard library for routing React applications is
[React Router](https://reacttraining.com/react-router).

The idea behind routing, is you have some API that informs you of changes to the
URL, then you react (no pun intended) to those changes by rendering the correct
user interface based on that URL route. In addition, you can change the URL when
the user performs an action (like clicking a link or submitting a form). This
all happens **client-side** and does not reload the browser. Here's a basic demo
of a few of the features you'll need for this exercise:

```javascript
import * as React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Dog() {
  const params = useParams();
  const { dogId } = params;
  return <img src={`/img/dogs/${dogId}`} />;
}

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/dog/123">My Favorite Dog</Link>
    </nav>
  );
}

function YouLost() {
  return <div>You lost?</div>;
}

function App() {
  return (
    <div>
      <h1>Welcome</h1>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dog/:dogId" element={<Dog />} />
        <Route path="*" element={<YouLost />} />
      </Routes>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

ReactDOM.render(<AppWithRouter />, document.getElementById("app"));
```

That should be enough to get you going on this exercise.

As a fun exercise in routing on the web, you can read this blog post
demonstrating how you might build your own React Router (version 4):
https://ui.dev/build-your-own-react-router/

## Exercise

Users want to be able to click on the book in the search results and be taken to
a special page for that book. We want the URL to be `/book/:bookId`. Oh, and if
the user lands on a page that we don't have a route for, then we should show
them a nice message and a link to take them back home.

And we want to have a nav bar on the left. There's really only one link we'll
have in there right now, but we'll put more in there soon.

Here are the URLs we should support:

```
/discover       ->     Discover books screen
/book/:bookId   ->     Book screen
*               ->     Helpful "not found" screen
```

Firstly we need to import the Browser Router into out main App component.

```jsx
// The react router dom library exposes a context `provider` that all Router
// components use to implicitly access the router data. We need to wrap our
// AuthenticatedApp in this Browser Router that we alias to Router.
import {BrowserRouter as Router} from 'react-router-dom'
...
function App() {
  ...
  if (isSuccess) {
    const props = {user, login, register, logout}
    // Wrap the BrowserRouter around the AuthenticatedApp
    return user ? (
      <Router>
        <AuthenticatedApp {...props} />
      </Router>
    ) : (
      <UnauthenticatedApp {...props} />
    )
  }
}
```

Now every component within our wrapped component would then have access to the
context provided by this router. Meaning it can use Browser Router components.
Now we can navigate to the consumer and use some React Router components.

Opening `<AuthenticatedApp>` import `Routes` for our route definitions, `Route`
for a single route definition, and `Link` for the links that we're going to be
rendering from `react-router-dom`. Example our styled NavLink from a plain
anchor tag, we can render a React Router component like, a Link.

Now, NavLink no longer renders an anchor tag, which means its props, which did
accept an href, but now accepts the Link component's `to` prop. We can use that
prop, so that when the user clicks on "Discover", the `Router` manages updating
the URL and rendering the right component for that particular URL.

```jsx
import {Routes, Route, Link} from 'react-router-dom'
...
function NavLink(props) {
  return (
    <Link
      css={{ ...
        },
      }}
      {...props}
    />
  )
}

function Nav() {
  return (
    <nav
      css={{ ...
        },
      }}
    >
      <ul
        css={{ ...
        }}
      >
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  )
}
```

Lets define a component called `AppRoutes` thats only used to render a set of
route(s) for our application, inside the main content.

It renders individual route(s) and link(s) for usm `Routes` is the component
where we can define "separate" `Route` definitions.

Each has a `path` prop for path matching, which will match with a `Link`. We can
use a `element` prop that will determine what component to be rendered when our
`Route` **path matches**. Next we route a book `path` that has a param `:here`.
That element BookScreen also has props. Additionally we forward along user as a
prop. Finally, we'll just have a `*` catch-all path. If we don't match anything,
meaning we take all other path matching and renders our not found component.

```jsx
function AppRoutes({ user }) {
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverBooksScreen user={user} />} />
      <Route path="/book/:bookId" element={<BookScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}
```

How can users directed to (DiscoverBooksScreen) produce a `/book/:id` path in
the URL so we can match up? First we need to find out where "book" data is being
rendered. DiscoverBooksScreen has a `BookRow` iterated by a list of data. We
need a `Link` to replace a div inside that content we iterated and we `to` prop
a {`/book/${book.id}`} link that produces a URL for us to match up with.

```jsx
// src/screens/discover.js
function DiscoverBooksScreen({user}) {
  ...
  return (
    <div>
      ...
      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}
// src/components/book-row.js:
function BookRow({book}) {
  const {title, author, coverImageUrl} = book
  const id = `book-row-book-${book.id}`
  return (
    <div
      css={{ ...
      }}
    >
      <Link
        aria-labelledby={id}
        to={`/book/${book.id}`}
        css={{ ...
        }}
      > ...
      </Link>
    </div>
  )
}
```

So now, when a user authenticates into our App, the first path they will match
with is `/discover` toward the DiscoverBooksScreen page. Thats fine, but when
they attempt to select a single book once searched, we need to take a look at
the way `AppRoutes` handles that again, remember we **path param**.

We're saying this part of the path `/book/:here` is a parameter prop (`props`)
passed to BookScreen. And guess what its parameter name is going to be called?
Well, dynamically the prop is called `bookId`.

In BookScreen, to retrieve those props we use a `useParams` hook. It returns a
object with all the **params** we've specified in the `Route` definition. You
should be able to get the bookId from that.

```jsx
// src/screens/book.js
import {useParams} from 'react-router'
...
function BookScreen({user}) {
  const {bookId} = useParams()
  const {data, run} = useAsync()

  React.useEffect(() => {
    run(client(`books/${bookId}`, {token: user.token}))
  }, [run, bookId, user.token])

  const {title, author, coverImageUrl, publisher, synopsis} =
    data?.book ?? loadingBook

  return ( ...
  )
}
```

When a user lands on BookScreen, that `bookId` is going to be dynamic. Whatever
is generated in the browser URL. We need to say, "Hey, React Router, I want to
get the param `/book/:here` from the URL, and it provides that special hook.
What `useParams()` returns is an object you can destructure values from.

### Files

- `src/app.js`
- `src/authenticated-app.js`
- `src/components/book-row.js`
- `src/screens/not-found.js`
- `src/screens/book.js`

## Extra Credit

### 1. 💯 handle URL redirects

Redirects with a client-side router (CSR) are interesting because traditionally,
people would redirect just with the CSR and things would work out pretty well
that way. You could have all of your `Routes` defined in one place.

But the problem with that is search engines and browsers don't get the proper
status codes for those kinds of things. You can get dinged in search engine
optimization space as well as the browser behaving strangely for your redirects
because you can't set the 301 or 302 status code for that.

Instead, it's better to do a redirects through the configuration of the CDN or
the server that you're using. There are three contexts where we're using servers
for our application, and we want to configure all three of them.

So in example, we don't have anything to show at the home route `/`. We should
redirect user traffic from `/` "home" route to `/discover` automatically. Often,
dev's would use their client-side router (CSR) to redirect users.

A problem as mentioned above, it's not possible for the browser and search
engines to get the proper status codes for example redirects (301 or 302) so
that's not optimal. Our server should be setup to handle that.

Here are three environments where we have a server serving our content:

1. Locally during development
2. Locally when running the built code via the `npm run serve` script
   - Which uses https://npm.im/serve
3. In production with Netlify

So here you need to configure each of these to redirect `/` to `/discover`.

**Local Development**

With create-react-app (CRA), it has this feature `setupProxy`, which allows us
to modify a Express server "if running". We need to add redirect functionality.
We export a function that accepts an `app` being a express application. We can
attach a `get` handler so that it can send requests sent to a URL matching a
regex string: `/\/$/` and redirects to `/discover `.

```javascript
module.exports = (app) => {
  app.get(/^\/$/, (req, res) => res.redirect("/discover"));
};
```

Here are some docs that might be helpful to you:

- http://expressjs.com/en/4x/api.html#app.get.method
- http://expressjs.com/en/4x/api.html#res.redirect

We're basically going to say, "Hey, if you hit a route, if you're trying to get
a `/` home route. Then we're going to take that request and response, and we're
going to take that response and say redirect you to `/discover`." Now within
your (CRA) express development server, navigation to home, will redirect.

**With serve**

The `serve` module can be configured with a `serve.json` file in the directory
you serve. Open `./public/serve.json` and see if you can figure out how to get
that to redirect properly. To know whether it worked, you'll need to run:

```
npm run build
npm run serve
```

Then open `http://localhost:8811`. It worked if your redirected to
`http://localhost:8811/discover`.

Here are the docs you'll probably want:

- https://github.com/zeit/serve-handler/tree/ce35fcd4e1c67356348f4735eed88fb084af9b43#redirects-array

When we build our project, and we want to run it locally, we're using a module
called `serve`. With Serve, we're going to say redirects.

```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/discover",
      "type": 302
    }
  ]
}
```

An array of `redirects` objects where the source is `/`. Landing on `/` page,
the destination should be `/discover`, and the type is a 302. That's the status
code that the Serve server will send back to the browser for a redirection.

**In production**

There are a few ways to configure Netlify to do redirects.

We'll use the `_redirects` file. Open `./public/_redirects` and add support for
redirecting `/` to `/discover`.

```markdown
/ /discover 302! /\* /index.html 200
```

If you really want to check it out, you can run `npm run build` and then drag
and drop the `build` directory here: https://app.netlify.com/drop

Here's the docs for Netlify's `_redirects` file:

- https://docs.netlify.com/routing/redirects

> Hint: you need to use the "!" force feature for this.

For more on why we prefer server-side redirects (SSR) over client-side, read
[Stop using client-side route redirects](https://kentcdodds.com/blog/stop-using-client-side-route-redirects).

**Files:**

- `src/setupProxy.js`
- `public/serve.json`
- `public/_redirects`

### 2. 💯 add `useMatch` to highlight the active nav item

This isn't quite useful now, but when we've got several other `Link`s in the
nav, it will be helpful to orient users if we have some indication as to which
link the user is currently viewing.

```javascript
{
  borderLeft: `5px solid ${colors.indigo}`,
  background: colors.gray10,
  ':hover': {
    background: colors.gray20,
  },
}
```

You can determine whether a URL matches a given path via the `useMatch` hook:

```javascript
const matches = useMatch("/some-path");
```

```javascript
<div
  css={[
    {
      /* styles 1 */
    },
    {
      /* styles 2 */
    },
  ]}
/>
```

From there, you can conditionally apply the styles. Tip: the `Link` component in
NavLink already has a `css` prop on it. The easiest way to add additional styles
is by passing an `array` to the `css` prop like so:

```jsx
function NavLink(props) {
  const match = useMatch(props.to);
  return (
    <Link
      css={[
        {
          display: "block",
          padding: "8px 15px 8px 10px",
          margin: "5px 0",
          width: "100%",
          height: "100%",
          color: colors.text,
          borderRadius: "2px",
          borderLeft: "5px solid transparent",
          ":hover": {
            color: colors.indigo,
            textDecoration: "none",
            background: colors.gray10,
          },
        },
        match
          ? {
              borderLeft: `5px solid ${colors.indigo}`,
              background: colors.gray10,
              textDecorationStyle: "none",
              ":hover": {
                background: colors.indigoDarken10,
                fontWeight: "bold",
                color: colors.gray10,
              },
            }
          : null,
      ]}
      {...props}
    />
  );
}
```

If you ever need to know whether the current URL matches a specific route, then
you can use the `useMatch` hook from react-router-dom, and what you get back
will tell you whether or not you match that current route.

**Files:**

- `src/authenticated-app.js`
