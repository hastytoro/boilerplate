# useDebugValue: useMedia

## 📝 Your Notes

## Background

React DevTools browser extension is a must-have for any React developer. When
you start writing custom hooks, it can be useful to give them a special label.
This is especially useful to differentiate different usages of the same hook in
a given component. This is where `useDebugValue` comes in.

```javascript
function useCount({ initialCount = 0, step = 1 } = {}) {
  React.useDebugValue({ initialCount, step });
  const [count, setCount] = React.useState(initialCount);
  const increment = () => setCount((c) => c + step);
  return [count, increment];
}
```

So now when people use the `useCount` hook, they'll see the `initialCount` and
`step` values for that particular hook.

## Exercise

We have a custom `useMedia` hook which uses `window.matchMedia` to determine
whether the user-agent satisfies "webpage" for a given media query. In our `Box`
component, we're using it three times to determine whether the screen is big,
medium, or small and we change the color of the box based on that.

Now, take a look at the png files associated with this exercise. You'll notice
that the before doesn't give any useful information for you to know which hook
record references which hook. In the after version, you'll see a really nice
label associated with each hook which makes it obvious which is which.

If you don't have the browser extension installed, install it now and open the
React tab in the DevTools. Select the `<Box />` component in the React tree.
Your job is to use `useDebugValue` to provide a nice label.

```jsx
function useMedia(query) {
  const [state, setState] = React.useState(false);
  React.useDebugValue(`${query} is ${state}`);

  React.useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    function onChange() {
      if (!mounted) return; // exist logic!
      setState(Boolean(mql.matches));
    }
    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeListener(onChange);
    };
  }, [query]);

  return state;
}

function Box() {
  const isBig = useMedia("(min-width: 1000px)");
  const isMedium = useMedia("(max-width: 999px) and (min-width: 700px)");
  const isSmall = useMedia("(max-width: 699px)");
  const color = isBig ? "green" : isMedium ? "yellow" : isSmall ? "red" : null;
  return <div style={{ width: 200, height: 200, backgroundColor: color }} />;
}
```

As a reminder, this would not work inside a component, Your not going to see
anything because there's nothing to label.

**This is just to label custom hooks.**

## Extra Credit

### 1. 💯 use the format function

`useDebugValue` also takes a second argument which is an optional formatter
function, allowing you to do stuff like this:

```javascript
const formatCountDebugValue = ({ initialCount, step }) =>
  `init: ${initialCount}; step: ${step}`;

function useCount({ initialCount = 0, step = 1 } = {}) {
  React.useDebugValue({ initialCount, step }, formatCountDebugValue); // here!
  const [count, setCount] = React.useState(0);
  const increment = () => setCount((c) => c + step);
  return [count, increment];
}
```

This is only really useful for situations where computing the debug value is
computationally expensive (and therefore you only want it calculated when the
DevTools are open and not when your users are using the App).
