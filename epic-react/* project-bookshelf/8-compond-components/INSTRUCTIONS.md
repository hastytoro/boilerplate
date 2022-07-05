# Compound Components

## 📝 Your Notes

## Background

Whenever you find yourself copy/pasting stuff in your codebase, you may have the
urge to abstract code into a reusable component.

Not all reusable components are actually reusable. Most of the time it turns
into a mess of `props`. Being enormously difficult to use and maintain. They're
also riddled with performance problems and actual bugs.

But if we're mindful of the kinds of abstractions we create, then we can make
something that is truly easy to use and maintain, are bug free.

Give my talk a watch for more on this concept:
[Simply React](https://www.youtube.com/watch?v=AiJ8tRRH0f8&list=PLV5CVI1eNcJgNqzNwcs4UKrlJdhfDjshf)

## Exercise

Here we've got a `LoginFormModal` component that's a abstracted modal for our
login and registration forms. The component itself isn't complicated and only
accepts a handful of `props`, but it's pretty inflexible. You may need to create
more modals throughout the app so do something that's more flexible.

For comparison, here's our `LoginFormModal`'s API:

```jsx
<LoginFormModal
  onSubmit={handleSubmit}
  modalTitle="Modal title"
  modalLabelText="Modal label (for screen readers)"
  submitButton={<button>Submit form</button>}
  openButton={<button>Open Modal</button>}
/>
```

Rather, we're going to create a set of compound components for the modal, so
users can do this. It's definitely more code to use than our existing, but it
actually is simpler and more flexible and will suite our future use cases
without getting any more complex.

```jsx
<Modal>
  <ModalOpenButton>
    <button>Open Modal</button>
  </ModalOpenButton>
  <ModalContents aria-label="Modal label (for screen readers)">
    <ModalDismissButton>
      <button>Close Modal</button>
    </ModalDismissButton>
    <h3>Modal title</h3>
    <div>Some great contents of the modal</div>
  </ModalContents>
</Modal>
```

For example, consider a situation where we don't want to only render a form but
want to render whatever we like.

`Modal` supports that! but `LoginFormModal` would need to accept new `props`. Or
what if we want the close button to appear below the contents?

We'd need a special prop called like renderCloseBelow. But with our `Modal`,
it's obvious. You just move `ModalCloseButton` to where you want it to go. But
has a much more flexible use, and less API surface area.

Here we implement a `Modal` compound component(s) `src/components/modal.js` and
use them in place of the `LoginFormModal` (and delete the `LoginFormModal`).

```jsx
// #1
// We need this set of compound components to be structurally flexible.
// Meaning we don't have control over the structure of the components.
// But we still want to have implicitly shared state, so...
// Create a ModalContext here with `React.createContext`
const ModalContext = createContext()

// #2
// Create a Modal component that manages isOpen state (via useState)
// It renders the `ModalContext.Provider` with the `value` from state.
function Modal(props) {
  const [isOpen, setIsOpen] = useState(false)
  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

// #3
// Create a ModalDismissButton that accepts children, a button.
// We clone the Button to set it's onClick prop to trigger the modal to close.
// https://reactjs.org/docs/react-api.html#cloneelement
// To get the updater function you'll need useContext!
// Keep in mind, children prop we rename to child (the user's button).
function ModalDismissButton({children: child}) {
  const [, setIsOpen] = useContext(ModalContext)
  return cloneElement(child, {
    onClick: () => setIsOpen(false),
  })
}
function ModalOpenButton({children: child}) {
  const [, setIsOpen] = useContext(ModalContext)
  return cloneElement(child, {
    onClick: () => setIsOpen(true),
  })
}

// #4
// Create a ModalContents component which renders the reach-ui `Dialog`.
// To get state and the updater you'll need useContext!
// Be sure to forward remaining props "rest" (especially includes children).
function ModalContents(props) {
  const [isOpen, setIsOpen] = useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}
```

Let's review how we made this abstraction. #1, we made a `ModalContext`. That's
how we implicitly share state between all compounded modal components. The modal
is responsible for rendering #2 `ContextProvider`, that provides the `value` to
all of the models compound components.

Then #3 children components "consume" that context and grab the piece of that
context `value` that they need to do their job. We `cloneElement` so that both
dismiss and open button(s) have an API that accepts a single child and makes a
copy of all settings but modifies the onClick prop in its instance. We update
state from the context API, thats implicitly shared via the provider.

Then our #4 `ModalContents` component is responsible for rendering the UI. That
being the reach-ui-dialog. It forwards along isOpenState. It also handles the
onDismiss event callback to update the state that's been implicitly shared.

### Files

- `src/components/modal.js`
- `src/unauthenticated-app.js`

## Extra Credit

### 1. 💯 Add `callAll`

The `ModalOpenButton` and `ModalCloseButton` implementations set the `onClick`
of their child button so you can open and close the modal. But what if the users
of those components want to do something when the user clicks the button. Say in
addition to opening/closing the modal, for example, triggering analytics.

Your job is to make this use case work:

```jsx
<ModalOpenButton>
  <button onClick={() => console.log('run analytics')}>Open Modal</button>
</ModalOpenButton>
```

With this abstraction in place, we can now assign an additional onClick.

```javascript
function ModalOpenButton({children: child}) {
  const [, setIsOpen] = useContext(ModalContext)
  return cloneElement(child, {
    onClick: (...args) => {
      setIsOpen(true)
      if (child.props.onClick) child.props.onClick(...args)
    },
  })
}
```

**Files:**

- `src/components/modal.js`

### 2. 💯 Create ModalContentsBase

So both of our current modals have a circle dismiss button and an `h3` for the
title that they're using and most modals in our app are going to have that same
layout. With that you might be tempted to just move that UI in `ModalContents`
directly, but then we'll be stuck later if you need to customize UI differently.

Rather let's rename our current modal content component to `ModalContentsBase`
and then create a _new_ `ModalContents` that _uses_ `ModalContentsBase` under
the hood, but also renders the circle dismiss button and the title.

When you're done people will be able to go from this:

```jsx
<ModalContents aria-label="Registration form">
  {circleDismissButton}
  <h3 css={{textAlign: 'center', fontSize: '2em'}}>Register</h3>
  <LoginForm
    onSubmit={register}
    submitButton={<Button variant="secondary">Register</Button>}
  />
</ModalContents>
```

To this:

```jsx
<ModalContents title="Register" aria-label="Registration form">
  <LoginForm
    onSubmit={register}
    submitButton={<Button variant="secondary">Register</Button>}
  />
</ModalContents>
```

What we can take whats common between both of those login forms, copied over
here, and then accept any differences as `props`.

Now `ModalContentsBase` is an acting wrapper, with the newer `ModalContents`
component rendering whatever in particular needs to render, as its children.

This composition can go as deep as you need it to. You can have different types
of ModalContents based on the type of modal that you want to create.

> With composition, whenever you creating a new kind of modal, then you can
> define an additional component that encapsulates that type of modal.

```jsx
function ModalContentsBase(props) {
  const [isOpen, setIsOpen] = useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

function ModalContents({title, children, ...otherProps}) {
  return (
    <ModalContentsBase {...otherProps}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>✖</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}
```

It ends up working perfectly because of the way that we're implicitly sharing
the state between these components. Using the newer modal means your using the
base still to apply its settings, followed by children props it wraps over.

**Composition** can go as deep as you need it to. You can have different types
of modal contents based on the type of modal that you want to create.

**Files:**

- `src/components/modal.js`
- `src/unauthenticated-app.js`
