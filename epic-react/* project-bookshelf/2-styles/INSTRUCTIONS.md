# Style React Components

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

There are many ways to style React applications, each approach comes with its
own trade-offs, but ultimately all of them comes back to stylesheets. Because
we're using webpack, we can import css files directly into our application and
utilize the cascading nature of CSS to our advantage for some situations.

After developing production applications at scale, I've found great success
using a library called [emotion 👩‍🎤](https://emotion.sh). This library uses an
approach called "CSS-in-JS" which enables you to write CSS in your JS.

There are a lot of benefits to this approach.

- [A Unified Styling Language](https://medium.com/seek-blog/a-unified-styling-language-d0c208de2660)
- [Maintainable CSS in React](https://www.youtube.com/watch?v=3-4KsXPO2Q4&list=PLV5CVI1eNcJgNqzNwcs4UKrlJdhfDjshf)

There are two ways to use emotion, and typically you use both of them in any
given application for different use cases.

The first allows you to make a component that "carries its styles with it." The
second allows you to apply styles to a component.

### Making a styled component with emotion

Here's how you define styled components and the first way we showing you is the
template literal approach:

```javascript
import styled from '@emotion/styled'
// option #1: template literal
const Button= styled.button`
  color: turquoise;
```

```
// When we render:
<Button>Hello</Button>
👇
// What you will find in the DevTools:
<button className="css-1ueegjh">Hello</button>
```

This will make a button who's text color is `turquoise`. It works by creating a
stylesheet at runtime with that class name, and its unique. Alternatively, you
can also use object syntax (this is my personal preference):

```javascript
// option #2: styled object
const Button = styled.button({
  color: 'turquoise',
})
```

You can also accept `props` so that you can **dynamically** set these styled
properties in both the object and the string form.

```javascript
// option #1: template literal
const Box = styled.div`
  height: ${props => (props.variant === 'tall' ? '150px' : '80px')};
`

// option #2: styled object
const Box = styled.div(props => {
  return {
    height: props.variant === 'tall' ? 150 : 80,
  }
})
```

https://emotion.sh/docs/styled

### Using emotion's css prop

The styled component is only really useful for you when you need to reuse a
component. For one-off styles, it's less useful. You inevitably end up creating
components with meaningless names like "Wrapper" or "Container".

In that case, rather write one-off styles as `props` directly on the element.
Emotion does this using a special `prop` and a custom JSX function (similar to
`React.createElement`). You can learn more about how this works from emotion's
docs, but all you need to know is to make it work, you simply add this to the
top of the file where you want to use this special `css` prop:

```javascript
/** @jsx jsx */
import {jsx} from '@emotion/core'
import * as React from 'react'
```

You need the required comment and import of the jsx function from the core
library. With that, you're ready to use `css` prop anywhere.

```jsx
function SomeComponent() {
  return (
    <div
      css={{
        backgroundColor: 'hotpink',
        '&:hover': {
          color: 'lightgreen',
        },
      }}
    >
      This has a hotpink background.
    </div>
  )
}

// or you can keep to the string template literal syntax:

function SomeOtherComponent() {
  const color = 'darkgreen'
  return (
    <div
      css={css`
        background-color: hotpink;
        &:hover {
          color: ${color};
        }
      `}
    >
      This has a hotpink background.
    </div>
  )
}
```

Ultimately, when Babel compiled it looks something like this:

```javascript
function SomeComponent() {
  return <div className="css-bp9m3j">This has a hotpink background.</div>
}
```

With the relevant styles being generated and inserted into a stylesheet to make
this all work. https://emotion.sh/docs/css-prop

> If the `/** @jsx jsx */` thing is annoying to you, then you can also install
> and configure a
> [babel preset](https://emotion.sh/docs/@emotion/babel-preset-css-prop) to set
> it up for you automatically. Unfortunately for us, `react-scripts` doesn't
> support customizing the babel configuration.

> Note also that for this to work, you need to disable the JSX transform feature
> new to React 17. We do this in the `.env` file with the
> `DISABLE_NEW_JSX_TRANSFORM=true` line.

## Exercise

The first thing that we did was pretty quick and easy. We just imported a reboot
file here. This is known as a **Global Reset** that resets a bunch of styles in
our application to make things a little bit more consistent across browsers.

```javascript
// src/App.js
import 'bootstrap/dist/css/bootstrap-reboot.css'
```

We need a consistent style for buttons and we need our form to be styled. Lets
create a styled `button` component that supports the following API:

```javascript
import {Button, Input, FormGroup} from './components/lib'
...
return (
  <>
    <Button variant="primary">Login</Button>
    <Button variant="secondary">Register</Button>
  </>
)
```

Then you can use that for all buttons in your application. Too make the styled
component dynamic, we ensure it takes a second argument, a dynamic argument. You
can pass any number of additional argument to your styled component. They'll all
compose together, and any of these can be a function.

```jsx
const btnVariants = {
  primary: {
    background: '#3f51b5',
    color: 'white',
  },
  secondary: {
    background: '#f1f2f7',
    color: '#434449',
  },
}
const Button = styled.button(
  {
    padding: '10px 15px',
    border: '0',
    lineHeight: '1',
    borderRadius: '3px',
  },
  ({variant}) =>
    variant === 'primary' ? btnVariants.primary : btnVariants.secondary,
)
```

Here, this is going to take `props` passed to the `<Button>`. A `props.variant`
is going to be either a secondary, or defaulted, then I'll destructure variants
but default it to primary. With that variant then, we can apply these different
styles based on the value of variance. Ensure your function that changes css
properties is applied last so that it will win any conflicts.

Once you're finished with that, you can add support for the `css` prop and then
happy with the way things look.

Lastly, when you don't need a reusable and entirely styled component, it makes a
lot more sense to use the `css` prop. Like when you have to just simplify center
something on the box model and you don't need another Wrapper/Container.

The solution to that is pretty easy. We need to add the `@jsx` pragma force that
any React elements that are created (which normally React.createElement), should
instead be handled by the `{jsx}` function we import from `@emotion/core`.

```javascript
/**@jsx jsx */
import {jsx} from '@emotion/core'
// Make sure to add the comment and import `jsx` from @emotion/core.
// This ensures we can use the `css` props handled by jsx() function.
```

We're bringing in **jsx** from `@emotion/core`. Just to be clear, normally say a
simple div in React, thats compiled via `React.createElement('div')`, but with
the **pragma**, it's going to be doing `jsx('div')`. That passes createElement
calls into emotion, which can then handle any `css` props.

```jsx
function App() {
  ...
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
    ...
  )
}
```

### Files

- `src/components/lib.js`
- `src/index.js`

## Extra Credit

### 1. 💯 use the emotion macro

A label can help a lot during debugging. The `css` prop gets the label for free,
but to get labels applied to our `styled` components, you need a special version
of the `styled` package called a "`/macro`".

A macro basically is a Babel plugin or a code transform that does not need any
configuration. Once you have `babel-plugin-macros` configured and added to your
Babel configuration, then you can just start using macros, and they will run
automatically. Luckily for us, `react-scripts` has that built-in.

```diff
- import styled from '@emotion/styled'
+ import styled from '@emotion/styled/macro'
```

Once you've done that, then all your class names should have a label! They would
be named the same as the variable name. Learn more about macros:

- https://emotion.sh/docs/babel-macros
- https://github.com/kentcdodds/babel-plugin-macros

In review, literally the only change we made is we added a `/macro`, which will
trigger the Babel plugin for a `babel-plugin-macros` to apply the transform to
any use of the `styled` import, which will automatically add a displayName for
every styled component that we make, automatically.

**Files:**

- `src/components/lib.js`

### 2. 💯 use colors and media queries file

Emotion has a fantastic theming API (https://emotion.sh/docs/theming) which is
great for when users can change the theme of the app on the fly. You can also
use css variables if you like.

In our case, we don't support changing the theme on the fly, but we still want
to keep colors and breakpoints consistent throughout the app.

```javascript
// styles/colors.js
export const base = 'white'
export const text = '#434449'
export const gray = '#f1f2f7'
export const gray10 = '#f1f1f4'
export const gray20 = '#e4e5e9'
export const gray80 = '#6f7077'
export const indigo = '#3f51b5'
export const indigoDarken10 = '#364495'
export const indigoLighten80 = '#b7c1f8'
export const yellow = '#ffc107'
export const green = '#4caf50'
export const danger = '#ef5350'
export const orange = 'orange'
```

You can find all the places you're using those values and replace them with a
reference to the values exported from those modules.

```javascript
// styles/media-queries.js
export const large = '@media (min-width: 1200px)'
export const medium = '@media (min-width: 992px) and (max-width: 1199px)'
export const small = '@media (max-width: 991px)'
```

Here's a tip:

```javascript
import * as mq from 'styles/media-queries'
// You can use a media query within a styled object like so:
{
  [mq.small]: {
    /* small styles */
  }
}
// ...or in a string template literal like so:
css`
  ${mq.small} {
    /* small styles */
  }
`
```

https://emotion.sh/docs/media-queries

**Files:**

- `src/components/lib.js`

### 3. 💯 make a loading spinner component

Emotion fully supports animations and keyframe. So define a `Spinner` component
using the API. For now, you can render it alongside the login button.

You can get a spinner icon via:

```javascript
import {FaSpinner} from 'react-icons/fa'
// And to make a regular components a "styled component" you can do:
const Spinner = styled(FaSpinner)({
  /* styles here */
})
```

The first we do is make our spinner, which is going to be a styled component,
but a sort of SVG icon, and we have a library of SVG icons. Grab FaSpinner from
`'react-icons/fa'`. Lets make a styled version out of this FaSpinner component
by calling `styled()` and passing the SVG as an argument. We can then pass our
own styling either by either using the styled object or template literal.

Next to include `keyframes` in our JS, we luckily have it built `@emotion/core`.
Now you can define animations, with keyframes.

```jsx
import {keyframes} from '@emotion/core'
import {FaSpinner} from 'react-icons/fa'
...
const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
})
const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
})
```

- https://emotion.sh/docs/keyframes

- https://stackoverflow.com/a/14859567/971592

**Files:**

- `src/components/lib.js`
- `src/index.js`
