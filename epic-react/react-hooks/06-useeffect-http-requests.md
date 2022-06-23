# useEffect: HTTP requests

## 📝 Your Notes

## Background

Every application that is worth really anything is going to be interacting with
a backend or doing some async work, and that is a side effect.

HTTP requests are another common side-effect that we need to do in applications.
This is no different from applying effects to a already painted and rendered DOM
node or interacting with browser APIs like localStorage. In all these cases, we
do that within a `useEffect` 🪝 callback. This allows us to ensure whenever
certain conditions occur, we apply side-effects based on those changes.

One important thing to note about the `useEffect` 🪝 is that you cannot return
anything other than the cleanup function. This has interesting implications with
regards to `async/await` syntax:

```javascript
// this does not work ❌, don't do this.
React.useEffect(async () => {
  const result = await doSomeAsyncThing();
  // do something with the result
});
```

The reason this doesn't work is because when you make a function `async`, it
automatically will **return** a `Promise` (whether you not returning anything,
or explicitly returning something). This is due to semantics of `async/await`
syntax. To get it working in your 🪝, do the following:

```javascript
// this does work ✅!
React.useEffect(() => {
  async function effect() {
    const result = await doSomeAsyncThing();
    // do something with the result
  }
  effect();
});
```

This ensures you don't **return** anything but a cleanup callback when you.
However its typically recommended and easier to extract all the async code into
a septate utility function. Which you can call and use the promise-based `.then`
method instead of using `async/await` syntax:

```javascript
React.useEffect(() => {
  doSomeAsyncThing().then((result) => {
    // do something with the result
  });
});
```

But how you prefer to do this is totally up to you :)

## Exercise

Here we'll demonstrate data fetching directly in our `useEffect` effect/setup
callback, within our component. The fetching is external "world state" 🌐, that
is a backend GET request to synchronize with local managed application state
`[pokemonName]` 📦. That we optimize with a dependency array.

```jsx
import { PokemonDataView, PokemonForm, PokemonInfoFallback } from "../pokemon";

function PokemonInfo({ pokemonName }) {
  // managed state 📦 (locally)
  const [pokemon, setPokemon] = React.useState(null);
  // fetching is external "world state" 🌐
  React.useEffect(() => {
    if (!pokemonName) return; // exist logic
    fetchPokemon(pokemonName).then((data) => setPokemon(data));
  }, [pokemonName]);
  // basic `if` conditional rendering:
  if (!pokemonName) return <p>Submit a pokemon</p>;
  else if (!pokemon) return <PokemonInfoFallback name={pokemonName} />;
  else return <PokemonDataView pokemon={pokemon} />;
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");
  const handleSubmit = (newName) => setPokemonName(newName);
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}
```

Our component accepts `[pokemonName]` 📦 state as a props and then conditionally
renders. Locally if we don't updated state yet, we fallback render. Otherwise,
we'll render our data based on updated `[pokemon]` 📦 state.

If both `!pokemonName` and `!pokemon` conditions are falsy, we **else** clause
into and render our data view component. In section two we improve this with a
more explicit approach based on `[status]` 📦 state for rendering.

Your notice we make use of `pokemon.js` that has the following components and
function needed, for the application:

- PokemonForm: UI buttons for selecting pre-set submission
- PokemonInfoFallback: UI while we're loading the pokemon info
- PokemonDataView: UI we use to display the pokemon info
- fetchPokemon: A helper function we call to get world state

## Extra Credit

### 1. 💯 handle errors

Unfortunately, when things go wrong, we need to handle errors when they do so we
can show the user useful information. We introduce `[error]` 📦 state.

```jsx
function PokemonInfo({ pokemonName }) {
  // managed state 📦 (locally)
  const [pokemon, setPokemon] = React.useState(null);
  const [error, setError] = React.useState(null);
  // fetching is external "world state" 🌐
  React.useEffect(() => {
    // Here we ensure we recover from error state.
    // When we forcing a component re-render (update).
    // Otherwise we only going to render the error conditionally.
    if (!pokemonName) return; // exist logic
    setError(null); // here
    setPokemon(null); // here
    // ...
    fetchPokemon(pokemonName)
      .then((pokemonData) => setPokemon(pokemonData))
      .catch((errorData) => setError(errorData)); // here
  }, [pokemonName]);
  // basic `if` conditional rendering:
  if (error) return <pre>{error.message}</pre>; // here
  if (!pokemonName) return <p>Submit a pokemon</p>;
  else if (!pokemon) return <PokemonInfoFallback name={pokemonName} />;
  else return <PokemonDataView pokemon={pokemon} />;
}
```

You can make an error happen by typing an incorrect pokemon name into the input.
One common question, how to handle promise errors. There are two ways:

```javascript
// option 1️⃣: using catch() block
fetchPokemon(pokemonName)
  .then((pokemon) => setPokemon(pokemon))
  .catch((error) => setError(error));

// option 2️⃣: using the second then() argument
fetchPokemon(pokemonName).then(
  (pokemon) => setPokemon(pokemon),
  (error) => setError(error)
);
```

These are functionally equivalent for our purposes, but they are semantically
different in general.

Using `catch` means you'll handle an error in the `fetchPokemon` promise, but
you'll _also_ handle an error in the `setPokemon(pokemon)` call as well. This is
due to the semantics of how promises work. However, using the second argument to
`then` means you will catch an error that happens within the imported utility
function `fetchPokemon` _only_.

In this case, we knew that calling `setPokemon` would not throw an error (React
handles errors and we have an API to catch those called error boundaries).

However, in this situation, it doesn't really make much of a difference. If you
want to go with the safe option, then opt for `catch` block.

### 2. 💯 use a status

Our logic for what to render to the user is kind of convoluted and requires that
we be really careful about which state we setup and its not explicit.

We can avoid that logic flow and make things much simpler by having some state
explicit (hardcoded) to our `[status]` 📦 state of the component.

- `idle`: no request yet (default)
- `pending`: request started (loading)
- `resolved`: request successful (paint)
- `rejected`: request failed (error)

Instead of conditional rendering based on existing state and truly/falsy
booleans, we use `[status]` 📦 state setting it specific string values rather.
This approach lands up being more **declarative**, clearer to understand.

```jsx
function PokemonInfo({ pokemonName }) {
  const [status, setStatus] = React.useState("idle");
  const [pokemon, setPokemon] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setStatus("pending");
    fetchPokemon(pokemonName).then(
      (pokemonData) => {
        setPokemon(pokemonData);
        setStatus("resolved");
      },
      (errorData) => {
        setError(errorData);
        setStatus("rejected");
      }
    );
  }, [pokemonName]);

  // recommended controlled/explicit conditional rendering:
  switch (status) {
    case "idle":
      return <p>Submit a pokemon</p>;
    case "pending":
      return <PokemonInfoFallback name={pokemonName} />;
    case "resolved":
      return <PokemonDataView pokemon={pokemon} />;
    case "rejected":
      return <pre>{error.message}</pre>;
    default:
      throw new Error("Because of 'explicit' rendering, this will never throw");
  }
}
```

Warning: Make sure you call `setPokemon` before calling `setStatus`. Otherwise
you going to re-render and not setup and change that field.

### 3. 💯 store the state in an object

You'll notice we're calling a bunch of state updaters in a row. Normally its not
a problem, but each call results in a re-render (update) of our component. And
React batches these calls so you only get a single re-render.

So you might notice that if you do this:

```javascript
// Problem in React <18 and older builds ⛔.
setStatus('resolved')
setPokemon(pokemonDate), // Will not trigger this callback 😠!
```

You'll get an error indicating that you cannot read `image` of `null`. This is
because the `setStatus` call results in a re-render (update) that occurs before
the `setPokemon` happens within our effect callback.

A solution is storing your state collectively as a more complex object.

```jsx
function PokemonInfo({pokemonName}) {
  // managed state object 📦 (locally)
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  console.log(state)
  const {status, pokemon, error} = state
  // fetching is external "world state" 🌐
  React.useEffect(() => {
    if (!pokemonName) return // exist logic
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({status: 'resolved', pokemon: pokemonData})
      },
      errorData => {
        setState({status: 'rejected', error: errorData})
      },
    )
  }, [pokemonName])

  switch (status) { ...
  }
}
```

> Remember it's unable to do this in an asynchronous callback. However, this is
> no longer the case in React >=18 😊 so the above is not necessary, as today it
> supports automatic batching for asynchronous callback too.

Still its better to maintain closely related states as an object anyway, rather
than maintaining them using individual useState hooks.

A `useReducer` can solve this problem really elegantly also, but we can still
accomplish this by storing state as a more complex object that has all the
properties of state we're managing for a application.

### 4. 💯 create an ErrorBoundary component

We've already solved the problem for errors in our request, but we're only
handling that one error. But there are a lot of different kinds of errors your
applications can produce. No matter how hard you try, eventually your app code
just isn’t going to behave the way you expect it.

If an error is thrown and unhandled, your application will be removed from the
page, leaving the user with a **blank screen** kind of awkward...

Luckily, there’s a simple way to handle screen errors using a special component
[Error Boundary](https://reactjs.org/docs/error-boundaries.html). Unfortunately,
there is currently no way to create an error boundary component with a function
and you have to use a class component instead.

But because this library exists `react-error-boundary`, you never have to write
error boundary, so skip to section 6.

### 6. 💯 use react-error-boundary

Instead of maintain your own class `<ErrorBoundary>` component, consider using
the [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary).
You can npm this library into your project as `{ErrorBoundary}`.

Consider adding an error boundary to your component tree "stack" to customize
error-handling behavior. This kind of stack is also known as an execution stack,
program stack, control stack, run-time stack, or machine stack, and is often
shortened to just "the stack". When you execute a script, the JS engine creates
a **global execution context** and pushes it on top of the call stack.

Whenever a function is called, the engine creates another function execution
context for that function also and pushes it on top of the _call-stack_, and
starts executing that function. If a function calls another function, the engine
creates a another context for the that function and again pushes it on top of
the stack. When the current function completes, the JS engine pops it off the
call-stack and resumes/returns execution from where it left off.

Again when an error occurs, what is visible is only a blank screen. Luckily for
us, there’s a simple way to handle errors in your application for you whole
component tree using a `ErrorBoundary`.

The React elements we return from this error boundary are going to be the same
React elements that are provided as its children props. This way we can wrap
other components with it.

```jsx
import {ErrorBoundary} from 'react-error-boundary'
...
function PokemonInfo({pokemonName}) {
  ...
  switch (status) {
    case 'idle':
      return <p>Submit a pokemon!</p>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    case 'rejected':
      // This is now handled by an <ErrorBoundary>
      throw error
    default:
      throw new Error("Because of 'explicit' rendering this will never throw")
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      Error caught by our ErrorBoundary:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}
```

We create a generic `ErrorFallback` component that excepts a `{error}` prop and
renders/returns JSX using that error to display the problem in a more friendlier
UI. We then modify our `ErrorBoundary` we imported, to render this component
rather when a error occurs by providing this prop `FallbackComponent={here}`
from where we are calling our boundary for assistance with errors. This will
render out our backup/fallback component incase there is an error.

Below the `<ErrorBoundary>` can be rendered anywhere in the component tree, but
the location of the error boundary has a special significance.

```jsx
function App() {
  const [pokemonName, setPokemonName] = React.useState("");
  const handleSubmit = (newPokemonName) => setPokemonName(newPokemonName);
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
```

`ReactErrorBoundary` can handle any errors that are thrown by its descendants,
but it's also important to note that the boundary is going to render something
in place of all of its descendants also, when there is an error. If we were to
move this error boundary up to encompass our entire app and save that, when a
error occurs, then the entire app is replaced by our `ErrorFallback` component.
This may or may not be desirable, but a general error boundary rendered at the
topmost level, with other specific boundaries rendered throughout your `<App>`
with more specific fallbacks is recommended.

**Important:** boundary can only handle certain errors, specifically errors that
are happen within the React _call-stack_. It won't handle errors occurring in
event handlers or errors in a individual async callback, like a promise. It will
only handle errors within a React call stack, like the render method or a React
hook like `useEffect` callback etc.

### 7. 💯 reset the error boundary state

You may have noticed a problem when we're resetting internal state that relates
to our `<ErrorBoundary>` and its `key={}` prop. What's going on here is every
time we change state being our `[pokemonName]` 📦 state, it's completely
re-rendering the `<ErrorBoundary>` component, which in turn is "re-rendering"
unmounting/mounting the children component it is wrapping, the `<PokemonInfo>`.
and then it's going to mount a new instance of each of these elements.

> That's how the `key` prop works.

Well this is unfortunately, not only re-mounting because state has changed, but
we're also "re-rendering" that being the wrapped component, being `PokemonInfo`.
This results in a flash of the initial status `idle` state.

Because that process is updating the `key={}` prop, we therefore unmounting and
remounting both components, we can solve this by using the `resetErrorBoundary`
function provided by the library (which can be passed to our component) to reset
state of your `ErrorBoundary` component **only**.

```jsx
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:{" "}
      <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");
  const handleSubmit = (newPokemonName) => setPokemonName(newPokemonName);
  const handleReset = () => setPokemonName("");
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
```

So you can remove the `key` prop and we can explicitly reset the state without
having to unmount and remount are component.

Once you have this button wired up and a `onClick={}` event, React does the
reset of the `ErrorBoundary`'s state by resetting our own state so we don't wind
up triggering the error again. To do this we can use the `onReset` prop of the
`ErrorBoundary`. We can simply `setPokemonName` to an empty string.

### 8. 💯 use resetKeys

Again the reason we're using `ErrorBoundaries` is to catch all kinds of errors,
not just these errors that we're getting for this async state changes.

Unfortunately now the user can't simply select a new pokemon and continue with
their day. They have to first click "Try again" that is presented by the
`Fallback` component, and then select their new pokemon.

We think it would be cooler if they can just submit a new `pokemonName` and the
`ErrorBoundary` would reset itself automatically.

Luckily for us `react-error-boundary` supports the `resetKeys` prop.

```jsx
function App() {
  const [pokemonName, setPokemonName] = React.useState("");
  const handleSubmit = (newName) => setPokemonName(newName);
  const handleReset = () => setPokemonName("");
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
```

In review, all that we did here was add this `resetKeys` to our `ErrorBoundary`,
and now, when boundary's in an error state, it will reset itself if any of the
values in this array change and attempt to render its children again.
