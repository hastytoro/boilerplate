# useContext: simple Counter

## 📝 Your Notes

## Background

Sharing state between components is a common problem. The best solution for this
is to [lift your state](https://reactjs.org/docs/lifting-state-up.html). This
requires [prop drilling](https://kentcdodds.com/blog/prop-drilling) which is not
a problem, but there are some times where prop drilling can cause a real pain.

To avoid this pain, we can insert state into a section of our React tree, and
then extract that state anywhere within that tree without having to explicitly
pass it everywhere. This feature is called `context`. In some ways it's like a
global variable, but it doesn't suffer the same problems (maintainability) of
thanks to how the context API works to make the relationships explicit.

We don't need three components for this, but these are contrived example, just
to keep it simple before looking into realistic examples of using context. You
typically have your context provider placed in a different file and expose a
provider component itself. As well as a custom hook to access context value.

```javascript
const FooContext = React.createContext();

function FooDisplay() {
  const foo = React.useContext(FooContext);
  return <div>Foo is: {foo}</div>;
}

ReactDOM.render(
  <FooContext.Provider value="I am foo">
    <FooDisplay />
  </FooContext.Provider>,
  document.getElementById("root")
);
// renders: `<div>Foo is: I am foo</div>`
```

`<FooDisplay />` could appear anywhere in the render tree, and it will have
access to the `value` passed by the `FooContext.Provider` component.

Note, the first argument we pass to `createContext`, can be the a default value
which React will use in the event someone calls `useContext` with your context,
when no `value={}` prop setup by a consumer component:

```javascript
ReactDOM.render(<FooDisplay />, document.getElementById("root"));
```

Most of the time, I don't recommend using a default value because it's probably
a mistake to try and use context outside a provider, so avoid that.

Keep in mind, that while context makes sharing state easy, it's not the only
solution to **prop drilling** pains and it's not necessarily the best solution.
React's composition model is powerful and can also be used. Learn more:
[Michael Jackson on Twitter](https://twitter.com/mjackson/status/1195495535483817984)

## Exercise

We need to access both the `count` state as well as the `setCount` updater in
these different components which live in different parts of the tree. Normally
**lifting state** up would be the way to solve this trivial problem, but this is
a contrived example so you can focus on learning how to use context API.

```jsx
// 1) First we need to create are context with `React.createContext`.
const CountContext = React.createContext();

// 2) Next we need the acting `<Provider>` function "component" that:
// - Gets the state and state updater with React.useState.
// - Used to define the `value` array that would generally hold state.
// - We return a `Context.Provider` with a value prop or forward all available.
// - But more specifically we need the `children` prop forwarded.
// - This wrapper component "wraps" component(s) and provides context `value`.
function CountProvider(props) {
  const [count, setCount] = React.useState(0);
  const value = [count, setCount];
  return <CountContext.Provider value={value} {...props} />;
}

// 3) Here we "wrap" consuming "descendant" components within the <Provider>.
// We could have defined the <Context.Provider value={} {...props }> directly.
// But its cleaner to put everything into its own component (recommended).
// So that it can manage its own state, take props, side-effect etc...
function App() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  );
}
```

Consumer components have access to the `value` because of the `useContext` API.
This means: "Hey, you want access to some context `value={}`? Let's look up your
tree to find the closest `<Provider>` of that context to grab the value".

```jsx
// A sibling example:
function CountDisplay() {
  // 4) Consumer value from `useContext` API into our context.
  // We demonstrate not destructing the value props.
  const value = React.useContext(CountContext);
  const count = value[0];
  return <div>{`The current count is ${count}`}</div>;
}
// A sibling example:
function Counter() {
  // 4) Consumer value from `useContext` API into our context.
  // We demonstrate destructing the value props and ignoring the first one.
  const [value, setCount] = React.useContext(CountContext);
  const increment = () => setCount((c) => c + 1);
  return <button onClick={increment}>Increment</button>;
}
```

## Extra Credit

### 1. 💯 create a consumer custom hook

Imagine what would happen if someone tried to consume context `value` without
using a context provider. As mentioned above when discussing default value:

```javascript
ReactDOM.render(<FooDisplay />, document.getElementById("root"));
```

If you don't provide a default context `value`, that would just render a plain
`<div>Foo is: </div>`. Because the context `value` would be `undefined`. In a
real-world scenario, having an unexpected value can result in errors hard to
debug, and without error boundaries, you left with a white screen.

Let's assist with a custom hook for all consumers of a `<Provider>` component
for the context API we are serving. So that we don't have to write the same
logic in all consumers using our `useContext`. To reach into the context from
the consumer we have defined a custom 🪝 called `useCount`.

```jsx
function useCount() {
  const context = React.useContext(CountContext);
  if (!context) throw new Error(`Consumer must be rendered within Provider`);
  return context;
}

// A sibling example:
function CountDisplay() {
  const [count] = useCount();
  return <div>{`The current count is ${count}`}</div>;
}
// A sibling example:
function Counter() {
  const [, setCount] = useCount();
  const increment = () => setCount((c) => c + 1);
  return <button onClick={increment}>Increment</button>;
}
```

It should throw an error indicating consumer must be used within the Provider.

## Other notes

`Context` also has the unique ability to be scoped to a specific section of the
React component tree. A common mistake of context (and generally any app state)
is to make it globally available anywhere in your app when it's actually only
needed to be available in a part of the app (like a single page).

Keeping context value "scoped" to the area that needs it, mostly improves
performance and maintainability characteristics.
