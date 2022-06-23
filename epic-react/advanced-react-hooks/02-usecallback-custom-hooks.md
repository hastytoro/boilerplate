# useCallback: custom hooks

## 📝 Your Notes

## Background

### Memoization in general

Memoization: a performance optimization technique that eliminates the need to
recompute a value for a given input by storing the original computation, and
returning that stored value when the same **input** is provided. Caching is a
form of memoization. Here's a simple implementation of memoization:

```typescript
const values = {}
function addOne(num: number) {
  if (values[num] === undefined) values[num] = num + 1
  return values[num]
}
```

One other aspect of memoization is value referential equality.

```typescript
const dog1 = new Dog('sam')
const dog2 = new Dog('sam')
console.log(dog1 === dog2) // false
```

Even though those two dogs have the same name, they're not the same. However, we
can use memoization to get the same dog:

```typescript
const dogs = {}
function getDog(name: string) {
  if (dogs[name] === undefined) dogs[name] = new Dog(name)
  return dogs[name]
}

const dog1 = getDog('sam')
const dog2 = getDog('sam')
console.log(dog1 === dog2) // true
```

You might have noticed our memoization examples look similar. And its something
you can implement as a generic abstraction:

```typescript
function memoize<ArgType, ReturnValue>(cb: (arg: ArgType) => ReturnValue) {
  const cache: Record<ArgType, ReturnValue> = {}
  return function memoized(arg: ArgType) {
    if (cache[arg] === undefined) {
      cache[arg] = cb(arg)
    }
    return cache[arg]
  }
}

const addOne = memoize((num: number) => num + 1)
const getDog = memoize((name: string) => new Dog(name))
```

Our abstraction only supports one argument, if you want to make it work for any
type/number of arguments, knock yourself out.

### Memoization in React

Luckily, in React we don't have to implement a memoization abstraction. They
made two for us! `useMemo` and `useCallback`. See
[Memoization and React](https://epicreact.dev/memoization-and-react).

Do you know the dependency list feature in `useEffect`?

```javascript
React.useEffect(() => {
  window.localStorage.setItem('count', count)
}, [count]) // <-- that's the dependency list
```

Remember the dependency list is how React knows whether to call your effect
callback (if you don't provide one then React will call the callback on every
render). It does this to ensure that the side-effect you're performing in the
callback doesn't get out of sync with "external world state" and the state of
the application. But what happens if we function call in the callback?

```javascript
const updateLocalStorage = () => window.localStorage.setItem('count', count)
React.useEffect(() => {
  updateLocalStorage() // Now you using an extracted implementation.
}, []) // <-- What goes in that dependency list?
```

We could just put the `count` in the dependency and that can accidentally work,
but what happens if someone changes `updateLocalStorage`?

```diff
- const updateLocalStorage = () => window.localStorage.setItem('count', count)
+ const updateLocalStorage = () => window.localStorage.setItem(key, count)
```

Would we remember to update the dependency list to include `key`? But this can
be a pain to keep track of and find dependencies. Especially if the function
that we're using in our effect callback is coming to us as props.

That would be the case of a custom utility function (or custom 🪝). Instead, it
would be easier placing that said function itself, in the dependency list:

```javascript
const updateLocalStorage = () => window.localStorage.setItem('count', count)
React.useEffect(() => {
  updateLocalStorage()
}, [updateLocalStorage]) // <-- function as a dependency
```

The problem with that, it triggers the `useEffect` to run its effect callback on
every single render. Because `updateLocalStorage` in example, is defined within
our component function's body. So it's re-initialized on every render.

Which means it's brand new on every render and changes on every render. And when
dependencies change, you guessed it, our effect callback is triggered.

**This is the problem `useCallback` solves!**

```javascript
const updateLocalStorage = React.useCallback(
  () => window.localStorage.setItem('count', count),
  [count], // <-- Is that your dependency list? Yes it is!
)
React.useEffect(() => {
  updateLocalStorage()
}, [updateLocalStorage])
```

What that does is we pass React a function and React gives that same function
back to us... Sounds kinda useless right?

```javascript
// This is not how React actually implements this function (we're imagining).
function useCallback(callback) {
  return callback
}
```

But there's a catch! On subsequent renders, if the elements in the dependency
list are unchanged, instead of giving the same function back that we give to it,
React will give us the same function it gave us last time. So imagine:

```javascript
// This is not how React actually implements this function (we're imagining).
let lastCallback
function useCallback(callback, deps) {
  if (depsChanged(deps)) {
    lastCallback = callback
    return callback
  } else {
    return lastCallback
  }
}
```

So while we still create a new function every render to pass to `useCallback`,
React only gives us the new one if the dependency list changes. We're going to
be using `useCallback`, and its a shortcut to using `useMemo` for functions:

```typescript
// the useMemo version:
const updateLocalStorage = React.useMemo(
  // useCallback saves us from this annoying double-arrow function thing:
  () => () => window.localStorage.setItem('count', count),
  [count],
)
// the useCallback version: (recommended)
const updateLocalStorage = React.useCallback(
  () => window.localStorage.setItem('count', count),
  [count],
)
```

Question: Why don't we just wrap every function in `useCallback`? Read this blog
post
[When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback).

And if the concept of a "closure" is new or confusing to you, then
[give this a read](https://mdn.io/closure). (Closures are one of the reasons
it's important to keep dependency lists correct.)

## Exercise: Extract Logic into Custom Hook

**You find this exercise more difficult,** so its strongly advised to spend time
understanding how the code works before making any changes!

One thing to keep in mind is that React hooks are a great foundation upon which
to build libraries. For that reason, you don't often need to go this deep into
making custom hooks. So if you find this one isn't clicking for you, know that
you _are_ learning and when you _do_ face a situation when you need to use this
knowledge, you'll be able to come back and it will click right into place.

We're going to refactor out the async logic so we can reuse this in other areas
of the app. So extract the logic from the `PokemonInfo` component into a custom
and generic `useAsync` 🪝. In the process you'll find you need to do some fancy
things with dependencies (the biggest challenge to deal with in custom hooks).

NOTE: In this part of the exercise, we don't need `useCallback` yet. We'll add
it in the extra section. It's important that you work on this first refactor so
you can appreciate the value `useCallback` provides in circumstances.

First lets break down our program into smaller functions starting with logic we
would need in a generic reducer that handles all async conditions. Because this
is a generic thing, we need to generalize all the state data we retrieve. For
example we have made sure that our status object's hold a `data` field

```javascript
// Reusable generic reducer ✂️
function asyncReducer(state, action) {
  console.log('    asyncReducer: 🗽 state', state)
  console.log('    asyncReducer: 🎬 action', action)
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
```

**Create a Custom Hook:** We're going to make a new `useAsync` function. Now
instead of components handling any logic, we going to move all that to a generic
custom "reusable" hook for handling any asynchronous logic for our App. We'll
(`...`) spread `initialState` with a default object, and it can be overridden
with whatever is passed in additionally to this 🪝. Specifically `status`. And
don't forget to ensure that the object includes `data` when initialized.

```javascript
// Reusable generic async custom 🪝.
function useAsync(asyncCallback, initialState, dependencies) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })
  // Here we provide a mechanism for consumers of this custom 🪝.
  // They can side step the asynchronous steps by exiting early.
  // Or the accepted `asyncCallback` that returns a promise can we invoked.
  // The callback needs to return a `Promise` for any farther activity.
  // Or as mentioned, return early by passing a null or undefined.
  React.useEffect(() => {
    const promise = asyncCallback()
    if (!promise) {
      console.log('  useAsync: ❗ exited early.')
      return
    }
    console.log('  useAsync: 📮 dispatch() pending')
    dispatch({type: 'pending'})
    promise.then(
      data => {
        console.log('  useAsync: 📮 dispatch() data')
        dispatch({type: 'resolved', data})
      },
      error => {
        console.log('  useAsync: 📮 dispatch() error')
        dispatch({type: 'rejected', error})
      },
    )
    // Before looking at `useCallback` as a solution, lets **workaround**.
    // Instead of [asyncCallback], we disable linting and provide an argument.
    // We disable eslint here as its unsure if we included all dependencies.
    // Now the consumer of this custom 🪝 needs to specify them.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
  return state
}
```

Because we're calling this external dependency in our `useEffect`, we have to
include it in our dependency array. Note, you would't need this for a async
function helper coming from a module-level import as it likely never changes.
However, a "promise" that a consumer provides can change. So we don't have the
static code analysis to know whether or not people who are using our custom 🪝
`useAsync`, would actually change the async callback `Promise` they provide.

**Catch 22:** If we don't include `asyncCallback` as a dependency to the custom
hook, the `<App>` state 🗽 could fall out of sync with changes taken place in
the external "world" state 🌐 because we depend on it now. But the real kicker
is that this callback being passed would trigger a effect "re-run" within the
`useEffect` on each render from the consuming component.

It kinda says, "Hey, `useAsync`, here's that callback function you need." And
every time this `PokemonInfo` is re-rendering, this callback function is going
to be completely different, because we're defining it inside the render.

```jsx
function PokemonInfo({pokemonName}) {
  // All that logic we would have required in the component is now extracted.
  // Now we pass what is needed as parameters, to the "reusable" custom 🪝.
  // The `fetchPokemon` utility returns a promise that we pass on.
  // But on every render/invoke this `fetchPokemon` is going to be read/run.
  // * remember the workaround is to pass a dependency.
  const state = useAsync(
    // 1️⃣ asyncCallback "unnamed" function
    () => {
      if (!pokemonName) {
        console.log(' PokemonInfo: 💔 exit point.')
        return
      }
      console.log(' PokemonInfo: 🐕 fetch return Promise.')
      return fetchPokemon(pokemonName)
    },
    // 2️⃣ initialState
    {status: pokemonName ? 'pending' : 'idle'},
    // 3️⃣ dependencies
    [pokemonName],
  )
  // We have aliased the destructuring of our state 🗽 here:
  const {data: pokemon, status, error} = state

  switch (status) {
    case 'idle': {
      console.log(" PokemonInfo: 🍿 render 'idle' component")
      return <span>Submit a pokemon</span>
    }
    case 'pending': {
      console.log(" PokemonInfo: 🍿 render 'pending' component")
      return <PokemonInfoFallback name={pokemonName} />
    }
    case 'rejected': {
      console.log(" PokemonInfo: 🍿 render 'rejected' component")
      throw error
    }
    case 'resolved': {
      console.log(" PokemonInfo: 🍿 render 'resolved' component")

      return <PokemonDataView pokemon={pokemon} />
    }
    default:
      throw new Error('This should be impossible')
  }
}
```

Now looking at our consuming component (before we refactor anything and include
`useCallback` ) the main function call is coming from `PokemonInfo`, that needs
this logic extracted, to return values for its own conditional rendering 🍿. So
remember the custom 🪝 requires three arguments!

## Extra Credit

### 1. 💯 use useCallback to empower the user to customize memoization

Unfortunately, the ESLint plugin above is now unable to determine whether the
dependencies are valid for our `useEffect` activity in our custom 🪝. And the
consumer of `useAsync`, could forget to provide a dependency argument. But we
have a solution to this problem. Let's first cover the basic API:

The first argument to `useCallback` is the callback you want called, second is a
dependencies, like `useEffect`. But when a dependency changes, the callback you
passed in the first argument will be returned from `useCallback`. If they do not
change, then you'll get the same result returned the previous time/calculation.
And so the callback remains the same between renders.

```javascript
function ConsoleGreeting(props) {
  const greet = React.useCallback(
    greeting => console.log(`${greeting} ${props.name}`),
    [props.name],
  )

  React.useEffect(() => {
    const helloGreeting = 'Hello'
    greet(helloGreeting)
  }, [greet])
  return <div>check the console</div>
}
```

Again, the **workaround** has three problems. One we only want `asyncCallback`
to invoke when `pokemonName` changes. but it invokes our custom hook `useAsync`
on each child consumer function render. Two this custom hook does not have any
linting warnings. Three we don't get an ESlint warnings either when we call it
from the consuming child component, when passing those needed dependencies.

```javascript
// Problematic configuration example ❌:
function useAsync(asyncCallback, initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })
  React.useEffect(() => {
    const promise = asyncCallback()
    if (!promise) { return }
    dispatch({type: 'pending'})
    promise.then(
      data => dispatch({type: 'resolved', data}),
      error => dispatch({type: 'rejected', error})
    )
  }, [asyncCallback]) // <-- Will invoke on each consumer "render" 😵.
...

function ({pokemonName}) {
  const state = useAsync(
    // This unnamed function is going to be redefined on every render.
    // Meaning this section will execute "read" again, calling our promise API.
    // Even if the prop pokemonName did not change 😵.
    // That's absolutely a big problem, producing unnecessary load.
    () => {
      if (!pokemonName) { return }
      return fetchPokemon(pokemonName)
    },
    {status: pokemonName ? 'pending' : 'idle'},
    [], // <-- 😕 problem application will remain 'idle'
    [pokemonName], // <-- 😕 problem application will infinitive loop
  )
...
```

A solution is to force the consuming component `PokemonInfo` to rather do the
dependency checking instead. Then the unnamed callback we pass into our custom
`useAsync` 🪝 will be relocated, managed and passed as an argument from here.
Similarly, we can return the result into a variable like asyncCallback.

**The main takeaway with `useCallback`:** only when its dependency changes does
React then return a newer `() => {}` anonymous function, with the `pokemonName`
prop in its closure. This allows us to ensure how we "memoize" and guarantee a
more stable dependency provided, to our custom `useAsync` 🪝.

- It's an optimization to avoid calling 🤙 things too many times.

```jsx
function PokemonInfo({pokemonName}) {
  // 1️⃣ asyncCallback "named" function
  const asyncCallback = React.useCallback(() => {
    if (!pokemonName) {
       console.log(' PokemonInfo: 💔 exit point.')
      return
    }
    console.log('PokemonInfo: 🐶 fetching promise.')
    return fetchPokemon(pokemonName)
  }, [pokemonName])
  // You no longer need a dependency argument and we have no linting errors.
  const state = useAsync(asyncCallback, {
    // 2️⃣ initialState
    status: pokemonName ? 'pending' : 'idle',
  })
   // We have aliased the destructuring of our state 🗽 here:
  const {data: pokemon, status, error} = state
...
```

In review, we solved the problem that we initially had a third argument for
dependencies within our custom hook, that would trigger on each consumer render
👎. And we also had to disabled are ESlint "linting" to avoid errors.

Whenever asyncCallback dependency changes, the `useEffect` knows. Because
`useCallback` is called again, it in turn would provide to our custom 🪝
useAsync, a then modified value for its own dependency.

### 2. 💯 return a memoized `run` function from useAsync

Not a huge fan of APIs that require you to memoize things you pass into them.
Requiring users to provide a memoized value is not fine. You need to document it
as part of the API. Rather redesign the API a bit so we (as the hook developers)
are the ones who have to memoize 💾 the callback function instead.

```jsx
function PokemonInfo({pokemonName}) {
  // Not ideal API configuration the consumer ❌!
  const asyncCallback = React.useCallback(() => {
    if (!pokemonName) {
      console.log(' PokemonInfo: 💔 exit point.')
      return
    }
    console.log('PokemonInfo: 🐶 fetching promise.')
    return fetchPokemon(pokemonName)
  }, [pokemonName])

  const state = useAsync(asyncCallback, {
    status: pokemonName ? 'pending' : 'idle',
  })

  // We have aliased the destructuring of our state 🗽 here:
  const {data: pokemon, status, error} = state

  switch (status) { ...
  }
}
```

Developers reusing your "generic" custom 🪝 as a utility, in other projects may
not know or remember that when interacting with this `useAsync` API, to memoize
their callback `() => {}`. We have to document in the API that you want to make
sure that this is memoized. People could very easily skip over this. It doesn't
cause bugs, it's suboptimal 🐢. People could forget this and not know it until
it gets into production, and land up hitting a backend way too much 🥵.

Redesign this by providing a memoized `run` function that consumers can call in
their own effects. This better API approach ensures the custom 🪝 is responsible
for memoizing. Then consumers can do their `useEffects` like this.

```javascript
function PokemonInfo({pokemonName}) {
  // Your destructuring may feel a bit weird retrieving "state" like this.
  // Just keep in mind that all needed state is coming from custom hook.
  // We have aliased the destructuring of our returned state 🗽 here:
  const {
    data: pokemon,
    status,
    error,
    run,
  } = useAsync({status: pokemonName ? 'pending' : 'idle'})

  React.useEffect(() => {
    if (!pokemonName) {
      console.log(' PokemonInfo: 💔 exit point.')
      return
    }
    // We provide `run()` a promise which as a function handles for us and keeps
    // our state like data, status, error all up-to-date based on the status of
    // the promise we pass to it. Because the `run` function is coming from our
    // our custom hook, the implementation detail of `useAsync` can ensure that
    // the function only changes when necessary and a consumer component can now
    // add any dependencies it needs for when they want side-effects to trigger.
    // This ensures the custom 🪝 API is tidy and easier to reuse ♻.
    console.log('PokemonInfo: 🐶 fetching promise.')
    return run(fetchPokemon(pokemonName))
  }, [pokemonName, run])
...
```

To make that work our custom `useAsync` no longer accepts a callback to effect.
Instead, it's just going to accept initial state, and provide `[status]` state
object 📦 for any consuming component. A consumer get to call `useCallback` via
a returned `run` function, they then able to side-effect. A main advantage here,
the returned callback (`run`) is going to be memorized with `useCallback`.

The custom `useAsync` provided dispatching to reducers with the `useCallback`.
And notice we return an object that has (`...`) spread state, and a completed
status of the introduced `run` function that can be used by a consumer.

```javascript
// Reusable generic async custom hook 🪝.
function useAsync(initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })
  const run = React.useCallback(promise => {
    if (!promise) {
      console.log('  useAsync: 💔 exit point.')
      return
    }
    console.log('  useAsync: 📮 dispatch pending')
    dispatch({type: 'pending'})
    promise.then(
      data => {
        console.log('  useAsync: 📮 dispatch data')
        dispatch({type: 'resolved', data})
      },
      error => {
        console.log('  useAsync: 📮 dispatch error')
        dispatch({type: 'rejected', error})
      },
    )
  }, [])
  return {...state, run}
}
```

In review, earlier our custom 🪝 accepted a memoized callback from our consuming
component. That calling component used the `useCallback` hook returning a async
callback (memoized) that would later be passed in the custom hook's `useEffect`
dependency list. That was found not ideal 👎!

Instead, we force the user/consumer of `useAsync` to call its returning `run`
function when they want to have their asynchronous promise handled. We pass the
promise that we get back from a fetch API `fetchPokemon` then the `run` function
calls/dispatches our state to the right event handler.

Keeping previous functionality, a promise is dispatched resolved if successful.
Errors can dispatch if rejected. The `run` can maintain all state handling for
us. That is the real benefit of a custom 🪝 using `useCallback`, to memorize.

### 3. 💯 make safeDispatch with useCallback, useRef, and useEffect

**NOTICE: Things have changed slightly.** The app you're running the exercises
in was changed since the videos were recorded and you can no longer see this
issue by changing the exercise. All the exercises are now rendered in an iframe
on the exercise pages, so when you go to a different exercise, you're
effectively "closing" the page, so all JS execution for that exercise stops.

So I've added a little checkbox which you can use to mount and unmount the
component with ease. This has the benefit of also working on the isolated page
as well. On the exercise page, you'll want to make sure that your console output
is showing the output from the iframe by
[selecting the right context](https://developers.google.com/web/tools/chrome-devtools/console/reference#context).

I've also added a test for this one to help make sure you've got it right.

Also notice that while what we're doing here is still useful and you'll learn
valuable skills, the warning we're suppressing
[goes away in React v18](https://github.com/reactwg/react-18/discussions/82).

Phew, ok, back to your extra credit!

Consider the scenario where we fetch a promise for in our example a pokemon, and
before the request finishes we navigate to a different page or unmount the page.
In that case, the component gets removed from the DOM ("unmounted") and when the
request finally does complete, it will call `dispatch`, but because a component
has been removed from the page, we'll get this warning from React:

**Warning:** Can't perform a React state update on an unmounted component. This
is a no-op, but it indicates a memory leak in your application. To fix, cancel
all subscriptions/asynchronous tasks in a useEffect cleanup function.

The best solution to this problem would be to cancel the promise, but even then,
we'd have to handle that cancel/error and prevent the `dispatch` being called
for then a rejected promise. Here don't necessarily want to call any dispatching
if we have (unmounted) being destroyed the page by navigating away. So we can
keep track of this mounting status with a mount ref from `useRef`.

To make sense of this, rename the dispatch function with the prefix unsafe. That
means "If you call this, we going to trigger a re-render, even if the component
has not been mounted". Then we return that using React `useCallback`, that calls
dispatching state updater function called `unsafeDispatch` with all arguments.

Now, we need to ensure we don't call this function if our component's unmounted.
We can handle this by defining a reference with `useRef`. We'll initialize that
to false, signalling to use that its not mounted. Then to set that value to true
when our component (mounts), we trigger an effect and cleanup to ensure we back
to false, when the component has unmounted.

```jsx
function useAsync(initialState) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const mountedRef = React.useRef(false)
  React.useEffect(() => {
    mountedRef.current = true
    return () => (mountedRef.current = false)
  }, [])

  const dispatch = React.useCallback((...args) => {
    if (mountedRef.current) unsafeDispatch(...args)
  }, [])
  ...
}
```

Hence the use of an empty dependency list in the `useEffect` hook that ensures
these effect and cleanup callbacks, trigger only at mounts and unmounts.

Back in the `useCallback` we invoke the actual dispatching state updater based
on the components "current" effect condition, set on the reference.

Lastly to extract this into a generic and reusable hook, define a new function
that takes in the dispatch updater from the component's useReducer as a argument
and just returns the `useCallback` memoized callback in the same condition.

```jsx
// Reusable generic async custom hook 🪝.
function useSafeDispatch(dispatch) {
  const mountedRef = React.useRef(false)
  React.useEffect(() => {
    mountedRef.current = true
    return () => (mountedRef.current = false)
  }, [])

  return React.useCallback(
    (...args) => {
      if (mountedRef.current) dispatch(...args)
    },
    [dispatch],
  )
}

// Reusable generic async custom hook 🪝.
function useAsync(initialState) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const dispatch = useSafeDispatch(unsafeDispatch)
  ...
}
```

You may notice before we refactored into a custom hook that ESLint knew that the
dispatch function was coming from `useReducer`. But above it can't track across
function calls. So we add that `[dispatch]` function (we pass as an argument),
to our dependency list within the new custom hook. That's not a problem here as
the function is stable and we never change it so we don't need to worry.

We'll just include it even though it's not going to change.

## Other notes

### `useEffect` and `useCallback`

The `useCallback` use case here is a perfect example of problems its intended to
solve. But you can simplify things a great deal by _not_ extracting code within
`useEffect` functions that had been `useCallback` memoized.

For more info:
[Myths about useEffect](https://epicreact.dev/myths-about-useeffect).

### `useCallback` use cases

The entire purpose of `useCallback` is memoize callback use in a dependency list
and props in a memoized component. The _only_ time it's useful to `useCallback`,
is when the function you're memoizing is used in one of those two situations.
