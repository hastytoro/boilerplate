# Lifting state

## 📝 Your Notes

## Background

A common question from React beginners is how to share state between two sibling
components. The solution, lift state by finding the lowest common parent between
the two components, and placing the state management there, then you can pass
state and a mechanism for updating it, down to children that need it.

## Exercise

We move state management to the least common parent (`App`) and pass it down.

```jsx
function Name({name, onChange}) {
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={onChange} />
    </div>
  )
}

function Pet({pet, onChange}) {
  return (
    <div>
      <label htmlFor="pet">Favorite pet: </label>
      <input id="pet" value={pet} onChange={onChange} />
    </div>
  )
}

function Display({name, pet}) {
  return <div>{`Hey ${name}, your favorite pet is: ${pet}!`}</div>
}

function App() {
  const [name, setName] = React.useState('')
  const [pet, setPet] = React.useState('')
  return (
    <form>
      {/* sibling components */}
      <Name name={name} onChange={event => setName(event.target.value)} />
      <Pet pet={pet} onChange={event => setPet(event.target.value)} />
      <Display name={name} pet={pet} />
    </form>
  )
}
```

## Extra Credit

### 1. 💯 co-locating state

What happens when we need to complete the opposite known as co-locating.

```javascript
function Name() {
  const [name, setName] = React.useState('')
  const handleChange = event => setName(event.target.value)
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={handleChange} />
      <h3>{`Hi my name is ${name}.`}</h3>
    </div>
  )
}

function Pet() {
  const [pet, setPet] = React.useState('')
  const handleChange = event => setPet(event.target.value)
  return (
    <div>
      <label htmlFor="pet">Pet: </label>
      <input id="pet" value={pet} onChange={handleChange} />
      <h4>{`My favorite pet is: ${pet}!`}</h4>
    </div>
  )
}

function App() {
  return (
    <form>
      <Name />
      <Pet />
    </form>
  )
}
```

Above works better because we don't have to re-render our entire `App` on every
state change. And we ensure that the component that needs the state, is managing
it locally making it more readable. Additionally, maintenance improves here as
the component(s) can be reused in other places without having to worry about
passing state and a mechanism for updating that state as **props**.

We don't have to worry about maintaining state in the parenting `App` as we
keeping state as close to where it's relevant as possible. Over time, maintain
that practice with your application, "Does this state need to be here anymore?
or can we co-locate it where it needs to be."
