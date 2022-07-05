/** @jsx jsx */
import {jsx} from '@emotion/core'
import VisuallyHidden from '@reach/visually-hidden'
import React, {cloneElement, createContext, useContext, useState} from 'react'
import {CircleButton, Dialog} from './lib'

// 💰 Here's a reminder of how your components will be used:
/*
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
*/

// We need this set of compound components to be structurally flexible.
// Meaning we don't have control over the structure of the components.
// But we still want to have implicitly shared state, so...
// Create a ModalContext here with `React.createContext`
const ModalContext = createContext()

// Create a Modal component that manages isOpen state (via useState)
// It renders the `ModalContext.Provider` with the `value` from state.
function Modal(props) {
  const [isOpen, setIsOpen] = useState(false)
  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

// Create a ModalDismissButton that accepts children, a button.
// We clone the button to set it's onClick prop to trigger the modal to close.
// https://reactjs.org/docs/react-api.html#cloneelement
// To get the updater function you'll need useContext!
// Keep in mind, children prop we rename to child (the user's button).
function ModalDismissButton({children: child}) {
  const [, setIsOpen] = useContext(ModalContext)
  return cloneElement(child, {
    onClick: () => setIsOpen(false),
  })
}

// Create a ModalOpenButton which is the same except onClick sets true.
// To get the updater function you'll need useContext!
function ModalOpenButton({children: child}) {
  const [, setIsOpen] = useContext(ModalContext)
  return cloneElement(child, {
    onClick: (...args) => {
      setIsOpen(true)
      if (child.props.onClick) child.props.onClick(...args)
    },
  })
}

// Create a ModalContents component which renders the reach-ui `Dialog`.
// To get state and the updater you'll need useContext!
// Be sure to forward remaining props "rest" (especially includes children).
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

// 🐨 don't forget to export all the components here
export {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContents,
  ModalContentsBase,
}
