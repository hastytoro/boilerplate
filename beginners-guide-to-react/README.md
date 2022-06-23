# Beginners Guide to React

> Click :star: if you like the content and pull request's are highly appreciated.
> Follow me [@hastytoro](https://twitter.com/hastytoro) for updates.

### Table of Contents

| No. | Questions                                           |
| --- | --------------------------------------------------- |
|     | **Core React**                                      |
| 1   | [document create element](#document-create-element) |
| 2   | [react create element](#react-create-element)       |
| 3   | [jsx syntax](#jsx-syntax)                           |
| 4   | [jsx tricks](#jsx-tricks)                           |
| 5   | [fragments](#fragments)                             |
| 6   | [custom component](#custom-component)               |
| 7   | [prop types](#prop-types)                           |
| 8   | [jsx interpolation](#jsx-interpolation)             |
| 9   | [re-render](#re-render)                             |
| 10  | [styling](#styling)                                 |
| 11  | [event handlers](#event-handlers)                   |
| 12  | [state](#state)                                     |
| 13  | [side-effects](#side-effects)                       |
| 14  | [lazy initialization](#lazy-initialization)         |
| 15  | [effect dependency array](#effect-dependency-array) |
| 16  | [custom hooks](#custom-hooks)                       |
| 17  | [dom refs](#dom-refs)                               |
| 18  | [hook flow](#hook-flow)                             |
| 19  | [basic forms](#basic-forms)                         |
| 20  | [dynamic forms](#dynamic-forms)                     |
| 21  | [controlled forms](#controlled-forms)               |
| 22  | [error boundaries](#error-boundaries)               |
| 23  | [rendering lists](#rendering-lists)                 |
| 24  | [lifting and co-locating](#lifting-and-co-locating) |
| 25  | [http](#http)                                       |
| 26  | [http errors](#http-errors)                         |

## Beginners Guide to React

1. ### document create element?

   You can create a simple user interface on the web using HTML and CSS. But as soon as you want to make your application interactive, you need to use JavaScript to manipulate the DOM (Document Object Model) to listen to user events and make updates to the user interface. Here we create a `<div>` element using raw JavaScript and browser APIs.

   ```html
   <body>
     <div id="root"></div>
     <script text="text/javascript">
       const root = document.getElementById("root");
       const element = document.createElement("div");
       element.textContent = "Hello World";
       element.className = "container";
       root.appendChild(element);
     </script>
   </body>
   ```

   Above demonstrates the land before React. To create a user interface in JavaScript. You're going to need to have a place where you append your JS-generated DOM elements. We're going to get access to that element from the `document` APIs. Then we'll create our own element with `createElement()`. We'll add some properties onto that element. Then we'll append that element to our root element with the `appendChild()`.

   **[⬆ Back to Top](#table-of-contents)**

2. ### react create element

   React uses the same APIs to control and update the DOM. Instead of creating DOM elements, we’ll create React elements and then hand those off to `react-dom` to handle turning those into DOM elements and putting them into the page. You are probably more familiar with JSX than React’s `createElement()` API, however understanding it is **important** in getting JSX.

   To use React to create this user interface, we're going to need to have React on the page. We can get React from npm, but there's a service called [unpackage](https://unpkg.com) that you can use that has any file that distributed on npm also available in a minified version. Add the following `<script>` tags to your html page so that React packages are accessible on the page.

   ```html
   <script src="https:/unpkg.com/react@16.12.0/umd/react.development.js"></script>
   <script src="https://unpkg.com/react-dom@16.12.0/umd/react-dom.development.js"></script>
   ```

   With `react` we create React elements and then use `react-dom` to render those elements to the page. Now the element that we provide is not going to be a `document` instanced object. Instead, it's going to be a `React.createElement` instantiated by React. The API is not exactly the same. We do get to specify the type of element as the first argument below being `div`, but instead of getting the element via `document.getElementById("root")` and attaching properties to it, we specify those properties on instantiation of the object instance. We then can render this element with `ReactDOM.render()` method to the root element.

   ```html
   <body>
     <div id="root"></div>
     <script src="https://unpkg.com/react@16.12.0/umd/react.development.js"></script>
     <script src="https://unpkg.com/react-dom@16.12.0/umd/react-dom.development.js"></script>
     <script type="text/javascript">
       const rootElement = document.getElementById("root");
       const element = React.createElement("div", {
         children: "Hello World",
         className: "container",
       });
       console.log(element);
       ReactDOM.render(element, rootElement);
     </script>
   </body>
   ```

   Now if this is not a DOM node then what is it? If we `console.log(element)` that out, we have a `$$typeof: Symbol(react.element)` property. That's a `Symbol` type so that React knows that this object is a legitimate React element. We know that the `type: "div"` and there are a couple other properties that are used by React internally but then we get to the `props` property that has reference to an object that is what we passed as our second argument to `createElement()`.

   There's something interesting about `props.children` also known as children prop. You can write this same thing as a third argument to `React.createElement` by simply providing the value for the children prop. Here we can provide "Hello World". Those are functionally equivalent.

   ```jsx
   const element = React.createElement(
     "div",
     {
       className: "container",
     },
     "Hello World",
     "Another child"
   );
   ```

   Or we could take those values and use the children prop directly like this, specifying it as an array ourselves.

   ```jsx
   const element = React.createElement("div", {
     children: ["Hello World", ", Another child"],
     className: "container",
   });
   ```

   This also gives us the flexibility of creating additional React elements to be children.

   ```jsx
   const element = React.createElement(
     "div",
     {
       className: "container",
     },
     "Hello World",
     ", Another child",
     React.createElement("span", null, "Hi, I span!")
   );
   ```

   In review, to create React elements and render them to the page, you need to include `React` for creating the elements and `ReactDOM` for rendering those elements to the page.

   **[⬆ Back to Top](#table-of-contents)**

3. ### jsx syntax

   Using the `React.createElement` method to define your elements to render is not the most ergonomic API to write our UI code in. This is why the React team came up with JSX. It’s an extension to the JavaScript language to support syntax that looks similar to the HTML that you would write to create these DOM elements [there are a handful of differences](https://reactjs.org/docs/dom-elements.html). JSX gives us an expressive syntax for representing our UI, without losing the benefits and powers of writing our UI in JavaScript. The best way to take advantage of this is to learn how JSX is compiled to regular JavaScript calls. Below we refactor our element as the following.

   ```jsx
   const element = <div className="container"> Hello World</div>;
   ```

   However this would produce an error ❌. That's because we have a syntax error in our JavaScript, as `element = <div>` is not JavaScript code. This is JSX. The browser does not understand this natively. It needs to be compiled from to something that the browser can understand. That's where **Babel** comes in. Try the repl for yourself. Babel is a JavaScript compiler supporting the next generation of JavaScript as well as non-standard features like JSX. Spend some time playing around in this tool [Try It Out](https://babeljs.io/repl).

   Understanding how JSX is compiled will make you more effective at using JSX. In typical application, you're going to use Babel to compile JSX to JavaScript for you. For our purposes, we're going to use Babel in the browser to get compiling without having installing any tools. Update your `<script>` tag type to `'text/babel'`. That will ensure Babel compiles any script tag that has the type of `text/babel`. Then it will create a new script tag with the compiled code with the type as `text/javascript` so that the browser can evaluate it.

   ```html
   <body>
     <div id="root"></div>
     <script src="https:/unpkg.com/react@16.12.0/umd/react.development.js"></script>
     <script src="https://unpkg.com/react-dom@16.12.0/umd/react-dom.development.js"></script>
     <script src="https://unpkg.com/@babel/standalone@7.8.3/babel.js"></script>
     <script type="text/babel">
       const rootElement = document.getElementById("root");
       const element = <div className="container"> Hello World</div>;
       ReactDOM.render(element, rootElement);
     </script>
   </body>
   ```

   Babel will download, it will compile our JavaScript and allow the browser to evaluate it so we can use JSX in the browser. We'll also get this warning that we're using the in-browser Babel transformer, which is not something that you'd want to do in production. If we take a look at the elements in the DevTools, you going to see the `text/babel` script in the `<body>` but in the `<head>`, we'll see a new `<script>` tag which is the compiled version of our code for the browser in `text/javascript`.

   In a typical application, you will not be using Babel standalone. Instead, you'll be using another tool which probably is using Babel to compile your code. That way, you get a much more friendly syntax for authoring your UI with React.

   **[⬆ Back to Top](#table-of-contents)**

4. ### jsx tricks

   JSX is not an entirely different language, but it is a bit of an extension to the language, so knowing how you would express certain JavaScript things within the JSX syntax is important to using JSX effectively. Like interpolation, composition, and spreading props. And we’ll compare these syntaxes with what is generated by babel so we have a good understanding of how this translates to regular JavaScript calls into `React.createElement`.

   To interpolate we're going to use `{}` curly braces and put our props like `props.children` or `props.className` in there. Anything you put between these `{}` curly braces can be a JavaScript expression. Whatever this expression evaluates to is the value that gets placed into position before the `React.createElement` method is invoked.

   We can do the same thing for our `className`. Now instead of the quotes here, we'll put curly braces to suggest to the Babel compiler that we want this value to be evaluated as an expression.

   ```html
   <script type="text/babel">
     const rootElement = document.getElementById("root");
     const children = <h1>Hello World</h1>;
     const className = "container";
     const element = <div className={className}>{children}</div>;
     ReactDOM.render(element, rootElement);
   </script>
   ```

   You can see the compiled version of the code in your DevTools `<script>` tag.

   ```javascript
   const rootElement = document.getElementById("root");
   const children = React.createElement("h1", null, "Hello World");
   const className = "container";
   const element = React.createElement(
     "div",
     {
       className: className,
     },
     children
   );
   ReactDOM.render(element, rootElement);
   ```

   This allows us to be expressive with the way that we're building our UI. Babel will manage, compiling the code down to JavaScript so that the browser can execute using React APIs.

   One important thing about `{children}` is that its a special prop "property" of your props object property. We can exactly instead of compiling as additional arguments when we Babel, rather pass it into the children JSX attribute and because we dealing with JSX and not HTML, we can use self closing tags.

   ```jsx
   const rootElement = document.getElementById("root");
   const children = <h1>Hello World</h1>;
   const className = "container";
   const element = <div className={className} children={children} />;
   ReactDOM.render(element, rootElement);
   ```

   Another thing we can do with JSX attributes is (`...`) spread properties. Define a object `props: { children, className}` where we're going to make those variables part of that props object. Then we can remove all attributes and say "Hey, Babel, I want you to take all of these props, and interpolate into this div's prop's position a (`...`) spread of that prop's object".

   ```jsx
   // ...
   const props = { children, className };
   const element = <div {...props} />;
   ReactDOM.render(element, rootElement);
   ```

   In review, we can interpolate values with these `{}` curly braces by putting any expression between the curly braces and have that expression passed along to the `React.createElement` API. We can (`...props`) spread in the props position of a JSX Element and those props will be combined with other props provided to that element, in a declarative and deterministic way.

   **[⬆ Back to Top](#table-of-contents)**

5. ### fragments

   YIn React, you can’t render two React elements side-by-side (`<span>Hello</span><span>World</span>`). They have to be wrapped in another element (like a `<div>`). This may seem like an odd limitation, but when you think about the fact that JSX is compiled to `React.createElement` calls, it makes sense. Without JSX syntax, you will notice that our `ReactDOM.render()` takes only two arguments, not three `(helloElement, worldElement, rootElement)`.

   ```html
   <script type="text/babel">
     const rootElement = document.getElementById("root");
     const helloElement = React.createElement('span', null, 'Hello');
     const worldElement = React.createElement('span', null, 'World');
     ReactDOM.render( /* problem here */, rootElement);
   </script>
   ```

   This is straightforward HTML, but it's not possible to do with React, which is why the React team created a special type of element called a `React.Fragment`.

   ```html
   <script type="text/babel">
     const rootElement = document.getElementById("root");
     const element = <React.Fragment></React.Fr>
     ReactDOM.render(element, rootElement);
   </script>
   ```

   Again nobody wants to use the `React.createElement` API directly so rather use JSX.

   ```jsx
   const element = (
     <>
       <span>Hello</span> <span>World</span>
     </>
   );
   ReactDOM.render(element, document.getElementById("root"));
   ```

   Because this is so common to do, JSX has a special syntax for `React.Fragment`. That is to simply remove the React fragment and have an open and closing angle bracket `<></>` that is functionally equivalent to what we had before.

   **[⬆ Back to Top](#table-of-contents)**

6. ### custom component

   A big paradigm shifts that React offered to the UI ecosystem was the component model. It allows you to package up all the logic, styling, and layout of a unit of UI into a box that you can easily move around and reuse without exposing any of the implementation details of the component. You don’t have to understand how a component works internally to use it effectively.

   ```jsx
   const message = <div className="message">Hello World</div>;
   const element = (
     <div className="container">
       {message}
       {message}
     </div>
   );
   ReactDOM.render(element, document.getElementById("root"));
   ```

   We can make it dynamic and parameterize our React elements with JavaScript functions. Here we define an arrow function that accepts and returns a object literal called `props`. Whatever that `props.msg` value is then interpolated into the children prop. Remember, that being the `props.children` property for this React element `message`.

   ```jsx
   const rootElement = document.getElementById("root");
   const message = (props) => <div className="message">{props.msg}</div>; // look here!
   const element = (
     <div className="container">
       {message({ msg: "Hello World" })}
       {message({ msg: "Bye World" })}
     </div>
   );
   ReactDOM.render(element, rootElement);
   ```

   However the above is not ergonomic. It doesn't look very good, and one of the benefits to using JSX is the ability for our UI to resemble the declarative nature of HTML. With JSXm we can invoke this React component/element.

   ```jsx
   const element = (
     <div className="container">
       <message>Ciao World</message>
     </div>
   );
   ```

   But the above will produce a Warning: The tag `<message>` is unrecognized in this browser. If you meant to render a React component, start its name with an **uppercase letter**. Navigate to your DevTools and open the compiled Babel version of your code under the `<head>` tag. Notice our message function that's returning a React element, it's not invoked its a string.

   See `React.createElement('message', null, Cio World)` the first argument is a string not a function call to our message function, that in turn return's a React element.

   ```html
   <head>
     <scrip>
       "use strict";
       var rootElement = document.getElementById("root");
       var message = function message(props) {
         return React.createElement(
           "div",
           {
             className: "message",
           },
           props.msg
         );
       };
       var element = React.createElement(
         "div",
         {
           className: "container",
         },
         // here is the problem!
         React.createElement("message", null, "Ciao World")
       );
       ReactDOM.render(element, rootElement);
     </script>
   </head>
   ```

   That's problematic because we don't want to have the 'message' string as that would advise Babel to create a native HTML DOM element. We want to use the `message()` function, so that it creates an additional React element. Below, by following the capitalization of the React component and function call, we clear the error and render our components. And we can demonstrate the difference between native HTML and React elements by console logging them.

   ```jsx
   const rootElement = document.getElementById("root");
   const Message = (props) => <div className="message">{props.msg}</div>;
   const element = (
     <div className="container">
       <Message>Ciao World</Message>
     </div>
   );
   console.log(<div>Hello World</div>);
   console.log(<Message>Hello World</Message>);
   ReactDOM.render(element, rootElement);
   ```

   You will notice they both react.element when compiled but one is `type: 'div'` and the other is our function call `type: ƒ Message(props)`. So, when you give a capital letter in JSX, that's the same as calling `React.createElement` with the function we referencing. This allows you to create a custom components in a more reusable way over and over again.

   ```jsx
   const Message = (props) => <div className="message">{props.msg}</div>;=
   const element = (
     <div className="container">
       <Message msg={"Ciao World"} />
       <Message msg={"Hello World"} />
       <Message msg={"By World"} />
     </div>
   );
   ```

   Below we more declarative and we show two approaches. The one uses the `children={element}` attribute and the other encloses over, basically wraps over the text elements. Just ensure that the passing children prop is within your `{props.children}` expression. And those two functionally equivalent. Its more common to see the wrapped children.

   ```jsx
   const Message = (props) => <div className="message">{props.children}</div>;
   const element = (
     <div className="container">
       <Message children="Ciao World" />
       <Message>"Hello World"</Message>
       <Message>"Bye World"</Message>
     </div>
   );
   ```

   In review we wanted to reuse code in multiple places. So, we created our own custom functional component (FC) which is a function that accepts a props `{}` object and returns more React elements. We had to make sure that our function component started with a capital letter so that Babel compiles and passes the function itself to `React.createElement` rather than the string message. That way when React renders/invokes our element/component, it knows what function to call.

   **[⬆ Back to Top](#table-of-contents)**

7. ### prop types

   When you create reusable React components, you want to make sure that people use them correctly. Otherwise you can get strange experiences when people use your codebase, example below.

   ```jsx
   function SayHello({ firstName, lastName, isLoading }) {
     return (
       <div>
         Hello {firstName} {lastName} is {isLoading}!
       </div>
     );
   }
   const element = <SayHello firstName={false} />;
   ```

   The best way to solve this is with TypeScript in your codebase, so that you give compile-time checking to your code. But if you’re not using TypeScript, you can still use custom or React built runtime validation.

   The React team developed a package called [prop-types](https://www.npmjs.com/package/prop-types) that allows you to add this run time validation of the props that are passed to your components. This is why React supports a feature called `prop-types` that allows you to validate the types of props that are being passed to your components when they're rendered.

   But before React built it, developers append logic to their components when invoked. To add support for that, we're going to have `SayHello.propTypes` equals this `{}` object. Here you include key for the props you want to validate that are going to be functions that takes props the name and component name. We could add a bunch more validators but lets add two.

   ```javascript
   const PropTypes = {
     string(props, propName, componentName) {
       if (typeof props[propName] !== "string") {
         return new Error(
           `${componentName} prop ${propName} needs a string, but you passed ${typeof props[
             propName
           ]}.`
         );
       }
     },
     boolean(props, propName, componentName) {
       if (typeof props[propName] !== "boolean") {
         return new Error(
           `${componentName} prop ${propName} needs a boolean, but you passed ${typeof props[
             propName
           ]}.`
         );
       }
     },
   };

   SayHello.propTypes = {
     firstName: PropTypes.string,
     lastName: PropTypes.string,
     isLoading: PropTypes.boolean,
   };

   const element = <SayHello firstName={false} />; // remember, this is a function call when Babel compiles!
   ```

   Now anytime this component is rendered/invoked!
   Warning: Failed prop type: SayHello prop firstName needs a string, but you passed boolean.
   Warning: Failed prop type: SayHello prop lastName needs a string, but you passed undefined.
   Warning: Failed prop type: SayHello prop isLoading needs a boolean, but you passed undefined.

   This is so common that the React team created a package on [npm](https://www.npmjs.com) called `prop-types`. In our case we use [unpkg](https://unpkg.com/prop-types@15.6.1/prop-types.js). This package defines a global variable for us called `PropTypes`. So you can remove the custom type validation checking code seen above.

   Your `React.PropTypes`, is a developer-friendly tool for declaring and checking types. Sure, it handles all the primitives (array, bool, func, number, object, string, symbol) easily enough.

   Remember, `PropTypes` by default are not required so you can attach `isRequired` to any declaration.

   ```html
   <script src="https://unpkg.com/prop-types@15.6.1/prop-types.js"></script>
   <script type="text/babel">
     function SayHello({ firstName, lastName, isLoading }) {
       return (
         <div>
           Hello {firstName} {lastName} is {isLoading}!
         </div>
       );
     }

     SayHello.propTypes = {
       firstName: PropTypes.string.isRequired,
       lastName: PropTypes.string.isRequired,
       isLoading: PropTypes.bool.isRequired,
     };

     const element = <SayHello firstName={false} />;
     ReactDOM.render(element, document.getElementById("root"));
   </script>
   ```

   There are a lot of different types you can use for your components to validate that people use them properly. See [Working With Types Using React.PropType](https://www.digitalocean.com/community/tutorials/react-react-proptypes).

   **[⬆ Back to Top](#table-of-contents)**

8. ### jsx interpolation

   Now that we have a good foundation on React elements, JSX, custom elements, and props, let’s write a React component that has some conditional logic in it to explore interpolation characteristics of JSX syntax.

   Here we have a React element that is a React fragment and its children are two CharacterCount, and thanks to curly braces we are allowed interpolation within JSX. Let's follow the flow of this syntax.

   ```jsx
   function CharacterCount({ text }) {
     /* jsx land */
     return (
       /* jsx land */
       <div>
         /* jsx land */
         {/* js land expressions only */ `The text "${text}" has `}
         {
           /* js land expressions only */
           text.length ? <strong>{text.length}</strong> : "No"
         }
         characters
       </div>
     );
     /* jsx land */
   }
   const element = () => (
     <>
       <CharacterCount text="Hello World" />
       <CharacterCount text="" />
     </>
   );
   ```

   Above demonstrates switching between JSX and JavaScript sections of the component. When we start in the function, this is JavaScript land. We can handle functions, if statements, iterations etc. From the return statement and the open parentheses, that's still JavaScript. We enter JSX land under the open-angle brackets, basically the tag. Within our JSX we can still handle JavaScript logic, but they can only be expressions.

   You can't write statements inside of the `{}` curly braces of JSX because the braces basically are saying, "Hey, Babel, as you get to this part of my code, take everything between these `{}` two curly braces and stick that expression return value into your 3rd argument of the `createElement("div", null, here)` call.

   Having a good understanding of how Babel is compiling your JSX will help you use it more effectively. Having a strong understanding of JSX and interpolating JavaScript expressions is key to using JSX well.

   **[⬆ Back to Top](#table-of-contents)**

9. ### re-render

   Applications aren’t really applications if they don’t change over time to represent changes.

   Normally in React you’ll use state to manage this, but before we get to that, let's call `ReactDOM.render` on the same element so you get an understanding of what React is doing for us. Here we cover how React deals with new elements you give it, how it compares it to the previous element, and then makes surgical updates to the DOM to give you the fastest and best UI possible (because updating the DOM is typically the slowest part of the whole process).

   Here we demonstrate the problem with traditional HTML element and document manipulation. It's updating the entire contents of our application every time, starting from our root element. That's not optimal!

   ```html
   <div id="root"></div>
   <script type="text/babel">
     const rootElement = document.getElementById("root");
     function tick() {
       const time = new Date().toLocaleTimeString();
       const element = `
          <div>
            <div>Hello</div>
            <div>${time}</div>
          </div>
        `;
       rootElement.innerHTML = element;
     }
     setInterval(tick, 1000);
   </script>
   ```

   And that is not the only problem. If we make them `<input>` and set the value to `${time}`, now if you click in them, the focus moves away. That's because the older `<input>` elements are getting totally removed from the DOM, and the newer elements are painted/rendered in their place. React doesn't have this problem.

   ```html
   <div id="root"></div>
   <script type="text/babel">
     const rootElement = document.getElementById("root");
     function tick() {
       const time = new Date().toLocaleTimeString();
       // You will lose focus of the inputs!
       const element = `
        <div>
          <input value=${time} />
          <input value=${time} />
        </div>
      `;
       rootElement.innerHTML = element;
     }
     setInterval(tick, 1000);
   </script>
   ```

   Let's go ahead and turn this back into JSX. Now we're getting an update to the values that actually matter, not the whole page is painted for our application. This has great implications for the performance of our applications, as well as the accessibility, because React is keeping track of our focus for us.

   ```jsx
   const rootElement = document.getElementById("root");
   function tick() {
     const time = new Date().toLocaleTimeString();
     const element = (
       <>
         <input value={time} />
         <input value={time} />
       </>
     );
     ReactDOM.render(element, rootElement);
   }
   setInterval(tick, 1000);
   ```

   In review, this isn't how you normally re-render new application. Typically, whenever state changes, you don't have to re-render your entire application, but we forcing this with `setInterval` to understand what React is doing.

   But generally when you create React elements and pass them to `ReactDOM.render` or you trigger a re-render of a component, React is going to compare the elements returned, with the previous returned ones.

   It's going to do a (diff) of those two elements, and then it will update the DOM surgically to only update the things that were different between the last time, and this time you returned JSX.

   **[⬆ Back to Top](#table-of-contents)**

10. ### styling

    Here `className` and `style` props are for styling components. Keep in mind `className` is not class (like it is in HTML) because that would be a keyword in JavaScript. The `style` prop accepts an object of camelCase styles rather than a string of css (like it does in HTML). We’ll take it even further by creating a reusable component that encapsulates these styles and composes the given `className` and `style` prop together.

    ```jsx
    const element = (
      <>
        <div
          className="box box--small"
          style={{ fontStyle: "italic", backgroundColor: "lightblue" }}
        >
          small lightblue box
        </div>
        <div
          className="box box--medium"
          style={{ fontStyle: "italic", backgroundColor: "pink" }}
        >
          medium lightblue box
        </div>
        <div
          className="box box--large"
          style={{ fontStyle: "italic", backgroundColor: "orange" }}
        >
          large lightblue box
        </div>
      </>
    );
    ReactDOM.render(element, document.getElementById("root"));
    ```

    There's a fair amount of duplication above that we can clear up by defining a new functional component called `<Box>`. This is going to take some props, and then will return a div, and we'll (`...`) spread all the props.

    ```jsx
    function Box({ size, style, ...rest }) {
      return (
        <div
          className={`box box--${size}`}
          style={{ fontStyle: "italic", ...style }}
          {...rest}
        />
      );
    }
    const element = (
      <>
        <Box size="small" style={{ backgroundColor: "lightblue" }}>
          small lightblue box
        </Box>
        <Box size="medium" style={{ backgroundColor: "pink" }}>
          medium lightblue box
        </Box>
        <Box size="large" style={{ backgroundColor: "orange" }}>
          large lightblue box
        </Box>
      </>
    );
    ReactDOM.render(element, document.getElementById("root"));
    ```

    We reduce duplication with a component called `<Box>`, which combines the passing size and style props in the className attribute. You can take the rest of the props, and (`...`) spread them into the underlying div.

    This also handles any additional props not destructured yet. We can even spread the children prop elements (`props.children`), that is content each `<Box> here </Box`> call, encloses and wraps over.

    **[⬆ Back to Top](#table-of-contents)**

11. ### event handlers

    There many supported events [available](https://reactjs.org/docs/events.html#supported-events). Before we cover state, let's rather implemented our own custom management so we can focus on event handlers.

    React events are very similar to working with regular DOM events. React does have an optimization implementation on top of the event system called `SyntheticEvents`, but most of the time you won’t observe any difference.

    In example our function call to setState, which again is a customized function to update state variables and then renderApp well renders `<App>`. This is **not** how we re-render an application or manage state in a React usually.

    ```jsx
    const state = { eventCount: 0, user: "" };

    function setState(newState) {
      Object.assign(state, newState);
      renderApp();
    }

    function renderApp() {
      ReactDOM.render(<App />, document.getElementById("root"));
    }
    renderApp();
    ```

    Our `<button>` triggers a `onClick` event that invokes our handler function. With `<input>` we can get the value of the input via an `onChange` event that takes a function with one argument, an event object. You can move that logic out to a handler function or you can pass an anonymous arrow function `() => {}`. Both would use this event input argument to retrieve the target value, which will be your inputs.

    ```jsx
    function App() {
      function handleClick() {
        setState({ eventCount: state.eventCount + 1 });
      }
      function handleChange(event) {
        console.log(event);
        setState({ user: event.target.value });
      }
      return (
        <div>
          <p>There have been {state.eventCount} events.</p>
          <button onClick={handleClick}>Click Me</button>
          <p>You typed: {state.user}</p>
          // option: 1
          <input onChange={(event) => setState({ user: event.target.value })} />
          // option: 2
          <input onChange={handleChange} />
        </div>
      );
    }
    ```

    If you console out your `event`, your see the synthetic object by React for events. Notice, that's not the native event. The native event is this property, `nativeEvent: inputEvent`. You could use the `event.nativeEvent` instead, but React does a lot of performance optimizations for our HTML events.

    ```javascript
    { SyntheticEvent {dispatchConfig: {…}, _targetInst: FiberNode, nativeEvent: InputEvent, type: 'change', ... }
    ```

    The React event system is straightforward as you pass event handlers directly to your HTML elements like `<button>` or `<input>` that you want to attach the event to, that makes the flow of events and state updates ideal.

    **[⬆ Back to Top](#table-of-contents)**

12. ### state

    We need a place to put data that can change in our application, and we need to let React know when that state changes so it can update (re-render) our `<App>`. In React, state is associated to components and when the state changes, your component needs to update. To access state and update it, we can use a “React Hook” which allows us to call into React from our component, and let it know that we need to manage this state.

    We demonstrate this with a form component called Greeting. Let's add an `id='name'` to our `<input>` that links up name with `htmlFor` within our `<label>`. Your `htmlFor` is like the `for` attribute in HTML but in JSX, you need to use its converted attributes. That's one of the few differences between JSX and regular HTML.

    However below is not going to work because we not going trigger any re-render. Unless a rerender is triggered and your function is called, the DOM isn't going to update. Even if we had logic that were to trigger a re-render, this whole function would be recalled when it mounts, and the name variable we trying to setup as state is going to be garbage collected, and we'd end up creating a new variable again.

    ```jsx
    function Greeting() {
      const name = "";
      const handleChange = (event = name = event.target.value);
      return (
        <div>
          <form>
            <label htmlFor="name">Name: </label>
            <input id="name" onChange={handleChange} />
          </form>
          {name ? <strong>Hello {name}!</strong> : "Please provide your name"}
        </div>
      );
    }
    ReactDOM.render(<Greeting />, document.getElementById("root"));
    ```

    Instead, React has what's called a React hook (`React.useState`) for maintaining state for a component. We pass it an initial/default value `useState('')` and it returns an array. Instead of using the common destructing of return values, lets access the current value `stateArray[0]` and state updater function `stateArray[1]` with constants.

    Apart from the demonstration, always destructure your React hook's returned array, instead of using the index. Your code will be far more readable `[state, setState] = useState('')`.

    Now instead of trying to reassign that name variable, we'll call the state updater with the event value.

    ```jsx
    function Greeting() {
      const stateArray = React.useState(""); // initial state as argument
      const name = stateArray[0]; // current state
      const setName = stateArray[1]; // state updater function
      const handleChange = (event) => setName(event.target.value);
      return ( //...
      );
    }
    ```

    The hook accepts the initial value `useState(here)`, so when the component does a initial render (mount), that is going to be the value of our variable. Anytime we call this second element of the array, our state updater function, we trigger a re-render (update) of this entire function component. When the hook is called again, it will ignore the initial value, and instead give us the current state of the name.

    Your state is managed independently of one another as React keeps track of the order in which they are going to be called, allowing you to use and add state as much as you need for your component.

    They do not conflict with each other.

    **[⬆ Back to Top](#table-of-contents)**

13. ### side-effect

    Let's demonstrate the managing of side-effect functions. Here we’ll be interacting with the browser’s `localStorage` API, but this same thing would apply if we’re interacting with a backend servers, or the geo-location API, or anything that needs to happen to state changes asynchronously.

    We want to be able to type into our `<input>` field some value and have that saved in `localStorage` so that when a page refresh occurs, those values are retrieved from `localStorage` back into the `<input>`. This activity is known as side-effect and is an impure function. In React we have a hook called `useEffect()`. The hook takes a function as the first argument known as the side-effect function, that's called at every component render.

    ```jsx
    function Greeting() {
      const [name, setName] = React.useState(
        window.localStorage.getItem("name") || ""
      );
      React.useEffect(() => window.localStorage.setItem("name", name));

      const handleChange = (event) => setName(event.target.value);
      return (
        <div>
          <form>
            <label htmlFor="name">Name: </label>
            <input id="name" onChange={handleChange} />
          </form>
          {name ? <strong>Hello {name}!</strong> : "Please provide your name"}
        </div>
      );
    }
    ```

    A _side-effect_ is anything that affects something outside the scope of the function being executed. These can be, say, a network request, which has your code communicating with a third party (and thus making the request, causing logs to be recorded, caches to be saved or updated, all sorts of **effects** that are outside the function.

    In review, we use `useEffect` the name value in our state memory to `setItem(key, value)` into our localStorage. Then for our state in memory to be initialized from localStorage we use `getItem(name)`. If there is nothing in state, then we'll initialize it to an empty default string. To make sure `<input>` is showing the same value from state we specified a value prop `value={here}`, changing input from an uncontrolled, to a controlled input.

    **[⬆ Back to Top](#table-of-contents)**

14. ### 14-lazy initialization

    It's important to recognize that every time you call the state updater function, that will trigger a re-render (**update**) lifecycle of the component that manages that state (the Greeting component in our above example). This is exactly what we want to have happen, but it can be a problem in some situations and there are some optimizations we can apply for `useState()` specifically in the event that it is a problem.

    ```jsx
    function Greeting() {
      const [name, setName] = React.useState(
        console.log("getItem for state"),
        window.localStorage.getItem("name") || 'default'
      );
      console.log("render component");
      React.useEffect(() => window.localStorage.setItem("name", name));

      const handleChange = (event) => setName(event.target.value);
      return ( // ...
      );
    }
    ```

    In our case, we’re reading into localStorage to initialize our state value for the first render (**mount**) of our component. But after that first render, we don’t need to read into localStorage anymore because we’re managing that state in memory now. So reading into localStorage on every render after the first, is unnecessary.

    This isn't a huge deal here because we reading into local storage that is fast and we're not parsing anything. But what if we're parsing a big JSON object. To assist uis React `useState` has a lazy initialization feature.

    ```jsx
    const [name, setName] = React.useState(
      () =>
        console.log("getItem for state") ||
        window.localStorage.getItem("name") ||
        "default"
    );
    ```

    It allows us to specify a function instead of an actual initial value. That ensures we only call that lazy function when it needs to-on the one single initial render (**mount**) only, not for re-renderings (**update**). We save ourselves the expense of reading into local storage on every render.

    **[⬆ Back to Top](#table-of-contents)**

15. ### effect dependency array

    Another optimization we can make is passing a `[]` dependency array to our effect as the second argument. The `seEffect` hook eagerly attempts to synchronize your “state of the world”, being the state of the application. So that means that your effect callback will run every time your component is rendered (updates).

    This normally won’t lead to bugs (in fact, it does a great job at preventing bugs), but it can definitely be sub-optimal, in cases resulting in infinite loops or unnecessary execution. Here we introduce that with an `<App>` function that holds state. When its state gets modified and triggers its own re-render (update), that in turn re-render (update) the child component `<Greeting>`.

    ```jsx
    function Greeting() {
      const [name, setName] = React.useState(
        () => window.localStorage.getItem("name") | ""
      );
      // unnecessarily this will re-run on each re-render:
      React.useEffect(() => {
        console.log("greeting useEffect");
        window.localStorage.setItem("name", name);
      });

      return ( // ...
      )
    }

    function App() {
      const [count, setCount] = React.useState(0)
      return (
        <>
          <button onClick={() => setCount(c => c + 1)}>{count}</button>
          <Greeting>
        </>
      )
    }
    ```

    This is triggering our effect twice, when state changes in either component. And its updating local storage from within the child unnecessarily. It doesn't need to be run, only when our state changes. Keep your `[]` dependency array accurate or else you may miss out on synchronizing state of the world, with the state of your app.

    ```jsx
    // ...
    React.useEffect(() => {
      console.log("greeting useEffect");
      window.localStorage.setItem("name", name);
    }, [name]);
    ```

    In review, the problem we solving here is our effect callback was being called more than it needed to. Just keep in mind that because it was being called more than it needed, that does'nt mean we actually had a bug in our app. This is just an optimization to make our application run a little faster. A `[]` dependency array may not be necessary in all cases. In our case, we could simply add this dependency array with the one dependency that our effect callback relied on, ensuring the callback is only called when necessary.

    **[⬆ Back to Top](#table-of-contents)**

16. ### custom-hooks

    A great ability we have with programming is taking code and placing it in a function, and reusing it in other places in our software. Let’s imagine a scenario where we want to share our localStorage code with other components so other components can synchronize state with localStorage. Take a step back from React specifically and considering how code reuse works in JavaScript in general, we can simply make a function, put our relevant code in that function and then call it from the original location. That process works exactly the same with React hooks code.

    ```jsx
    function useLocalStorage(key, defaultValue = "") {
      const [state, setState] = React.useState(
        () => window.localStorage.getItem(key) || defaultValue
      );
      React.useEffect(() => {
        window.localStorage.setItem(key, state);
      }, [key, state]);
      return [state, setState];
    }
    ```

    The logic we used for storing state into local storage and keeping it synchronized could be really useful in other areas of our application. Thankfully, React hooks are pretty vanilla JavaScript, so its straightforward.

    What we're going to do is make a function called useLocalStorageState reusable, and then we move from the state and effect hooks from `<Greeting>` into this reuseable function, and now we can just perform a single function call from our components.

    ```jsx
    function Greeting() {
      const [name, setName] = useLocalStorage("name");
      // ...
    }
    ```

    Now when we call our custom hook we're going to need access to the state updater function and the current state value, so let's return `[state, setState]`. Now our hook has a similar API to useState hook. When our consuming components use this custom hook, they can destructure those return values the same way, as seen before.

    We can name custom hooks whatever we want, but the reason that it's a convention to preface their name with `use` is so that eslint plugins can recognize our custom hooks.

    **[⬆ Back to Top](#table-of-contents)**

17. ### dom refs

    React is really good at creating and updating DOM elements, but sometimes you need to work with them yourself. A common use case for this is when you’re using a third party library like [vanilla-tilt](https://www.npmjs.com/package/vanilla-tilt), that wasn’t built for or with React specifically. To do this, we need to have some value that’s associated with our component (like state) to store a reference to the DOM element, but doesn’t trigger re-renders when it’s updated (unlike state).

    React has something specific for this and it’s called a `ref` object, that we create with the `useRef` hook. That object has a `current` property that is the current value of the reference. Now this object can reference anything, and we can do that by passing it it to a component with the `ref={}` props attribute, then React will set the `current` property to the DOM element it creates, so you can reference it and manipulate it with hooks like useEffect.

    Here we define a functional component called `<Tilt>` that makes use of global classNames to produce a fancy box. We want `vanilla-tilt` to take a DOM node we reference (`ref`) and make it react when the user mouses over it. The DOM node we want to give it, is the one created for this `<div>` called `tilt-root`.

    ```html
    <!-- function Tilt({ children }) { return (  -->
    <div className="tilt-root">
      <!-- here -->
      <div className="tilt-child">{children}</div>
    </div>
    ); }
    ```

    However, remember that section is JSX land and a React element, not a Dom node. React takes that React element and renders it to the DOM, so we need React to give us the actual DOM node/element that it creates for this particular React element so we can wire-up vanilla-tilt to it. That DOM node is really in the outside world of our React application.

    ```html
    <script src="https://unpkg.com/vanilla-tilt@1.7.0/dist/vanilla-tilt.min.js"></script>
    <style>
      /* see coding exercises */
      .tilt-root {
        ...;
      }
      .tilt-child {
        ...;
      }
      .totally-centered {
        ...;
      }
    </style>
    <script type="text/babel">
      function Tilt({ children }) {
        return (
          <div className="tilt-root">
            <div className="tilt-child">{children}</div>
          </div>
        );
      }

      function App() {
        const [showTilt, setShowTilt] = React.useState(true);
        return (
          <div>
            {showTilt ? (
              <Tilt>
                <div className="totally-centered">vanilla-tilt.js</div>
              </Tilt>
            ) : null}
          </div>
        );
      }
      ReactDOM.render(<App />, document.getElementById("root"));
    </script>
    ```

    Lets get started! We use `ref={}` prop and as mentioned we pass the reference (`ref`) value returned from the `useRef` hook.
    This `ref` object has a mutable property we can access called `current`. Let's go ahead use the hook's return value `tiltRef`. Then we can copy/paste that reference into our `ref={here}` prop/attribute, within our JSX.

    ```jsx
    function Tilt({ children }) {
      const tiltRef = React.useRef();
      console.log(tiltRef.current); // why do we see undefined?
      return (
        <div ref={tiltRef} className="tilt-root">
          <div className="tilt-child">{children}</div>
        </div>
      );
    }
    ```

    In our case, because we're passing this _ref_ to a `<div>` using the `ref={here}` prop, and the `current` property will be the DOM node that React will actually create for this `<div>`. Let's console the element, but why do we see undefined?

    The reason we see that is because, at the time this functional component runs/calls, React has not created the DOM node for the `<div>` yet, and so `tiltRef.current` is `undefined`. In fact you could initialize that `current` value by passing an argument to the `useRef(here)` hook like an empty `''` string and console would just display that.

    So then how do we get this DOM node? so that we can start initializing `vanilla-tilt` actions on it. Well we need to run our code after React has re-rendered (updated) the DOM and set our `tiltRef.current` property. Important, interacting with the DOM directly, is a side-effect, so the logical place is in a effect callback. You should see the consoled DOM node now :).

    ```jsx
    function Tilt({ children }) {
      const tiltRef = React.useRef();
      React.useEffect(() => console.log(tiltRef.current)); // use a effect callback
      return (
        <div ref={tiltRef} className="tilt-root">
          <div className="tilt-child">{children}</div>
        </div>
      );
    }
    ```

    From our effect let's constant the current `<div>` our referenced (DOM node) and call it `tiltNode`. Next our `vanilla-tilt` package requires a configuration object so `vanillaTiltOptions: {}` here will specify how we want `vanilla-tilt` to treat this DOM node. With that, we can say `VanillaTilt.init` on that `tiltNode`, with the options object to instantiate it.

    ```jsx
    React.useEffect(() => {
      const tiltNode = tiltRef.current;
      const vanillaTiltOptions = {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
      };
      VanillaTilt.init(tiltNode, vanillaTiltOptions);
    });
    ```

    Optionally its good practice when adding big libraries to our pages to perform clean-up code. If we (unmount) `<Tilt>` from the `<App>` removing the DOM node, that would still leave a bunch of event handlers and several references to that now removed DOM node from within the `vanilla-tilt` library. That means that the DOM node itself may not exist on the page, but it does still exist in memory because there are references to it within our imported `vanilla-tilt` package.

    To resolve this we can execute the second argument from within our `useEffect` hook. That can be another effect function that is a callback used only for clean-up code. This will remove all references of our Dom node from `vanilla-tilt` and remove all event handlers so that we can avoid memory leaks with our `<Tilt>` component. What you can't see is that that Dom node has been now garbage-collected properly, so we don't need to worry about memory leaks anymore.

    Another thing to recognize here is that `useEffect` is going to be called on every render of our `<Tilt>` component. That's not going to lead to any bugs, but it is suboptimal. Meaning we call `VanillaTilt.init()` and `vanillaTilt.destroy()` methods between every render (mount), re-render (update) and unmount process/lifecycle of our functional component. We don't need to do that because none of these things within our effect changes, nor state of our `<Tilt>` component.

    We solve this by adding that third argument to our effect, an empty `[]` dependency array. With no variables to trigger the callback effect, we don't list any dependencies. We effectively saying we want to run our callback effect only when the component is initially renders (mounts) to the page, and trigger our callback cleanup when the component (unmounts) from the page.

    ```jsx
    React.useEffect(() => {
      const tiltNode = tiltRef.current;
      const vanillaTiltOptions = {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
      };
      VanillaTilt.init(tiltNode, vanillaTiltOptions);
      return () => {
        tiltNode.vanillaTilt.destroy();
      };
    }, []);
    ```

    In review, the main takeaway here is that we get access to the actual outer DOM node so we can initialize vanilla-tilt on it. We do this by using the `ref={}` prop/attribute on our component's `div` element. We then pass the return value from our React `useRef` function call. That value is the reference (`ref`) with a `current` property we use to access the "current value" of the DOM node object. The `useRef` returning an object with a `current` property allows you to mutate the property to be whatever you need without triggering a component re-render (updates), as that object is seen as outside world state.

    We can use `refs` for more than just DOM nodes. We can use it for any value we want to keep track of, and mutate over time, without triggering a re-render (updates) of our component.

    **[⬆ Back to Top](#table-of-contents)**

18. ### hook flow

    Understanding the order in which React hooks are called (legacy was known as lifecycle) can be really helpful in using React hooks effectively. This [chart](https://github.com/donavon/hook-flow) can be really helpful in understanding this. Here we’ll explore the flow/lifecycle of a functional component with hooks with colorful console log statements so we know when one phase starts and when that process will ends. Understanding all of this is not critical to your success with using React, and most of the time you won’t need to think about this at all, but understanding it can helpful.

    Here we demonstrate the flow and execution between our hooks of two components. What happens when we initially load this script/page is that the first function call is toward `App`, see coding exercise for detail. The first thing that we see is this console `App: render start`. That's the first thing that happens when we call `ReactDOM.render` our App, that being the first function call. What happens next is all the execution within that (function) React component.

    ```jsx
    function App() {
      console.log("%cApp: render - start 🟢", "color: MediumSpringGreen");

      const [showChild, setShowChild] = React.useState(() => { ... });

      React.useEffect(() => { ...
        return () => { ...
      });

      React.useEffect(() => { ...
        return () => { ...
      }, []);

      React.useEffect(() => { ...
        return () => { ...
      }, [showChild]);

      const handleChange = (event) => { ... };

      const element = ( ... );

      console.log("%cApp: render - end 🔴", "color: MediumSpringGreen");

      return element;
    }
    ```

    Firstly in the component a call is made to `React.useState`. Immediately, React is going to call this function to retrieve the (initial state) of the component. Now you'll notice in the console logs below, that those `React.useEffect` callbacks are not triggered next. Instead, execution runs down the script to the defined element, and then `App: render end` is logged. That being the end, our `<App />` function call's return value is the element, that gets rendered to the DOM.

    ```
    App: render - start 🟢
    App: useState - state 🗄️ [showChild, setShowChild]
    App: render - end 🔴
      Child: useEffect(() => , no deps) - setup 🌐 (componentDidMount && componentDidUpdate)
      Child: useEffect(() => ,[empty deps]) - setup 🌐 (componentDidMount/mount-only)
      Child: useEffect(() => ,[with dep]) - setup 🌐 (componentDidUpdate/updates)
    ```

    So that is telling us, near all synchronous activity occurs before the effect callbacks trigger. Only once that happens and React initial renders (mounts) to the DOM, does it asynchronously later call our `React.useEffect` callbacks in our `<App>`, one at a time, how they written in the script, and in the order in which they were called.

    ```jsx
    function Child() {
      console.log("%c    Child: render - start 🟢", "color: MediumSpringGreen");

      const [count, setCount] = React.useState(() => { ... });

      React.useEffect(() => { ...
        return () => { ...
      });

      React.useEffect(() => { ...
        return () => { ...
      }, []);

      React.useEffect(() => { ...
        return () => { ...
      }, [count]);

      const handleClick = () => { ... };

      const element = ( ... );

      console.log("%c    Child: render - end 🔴", "color: MediumSpringGreen");

      return element;
    }
    ```

    Great, now what happens when we `onClick`? well that changes state from within `App` and re-renders (updates) the component. This time our `App` conditional renders truthy calling the function/component `<Child>`. Keep in mind, React will only call a function when the component is actually rendered. That meaning it has to be within the `return` value of that functional component.

    As you can see it follows the same process within the `Child` functional call, including the creation of the defined element and only after the entire DOM is updated to the values of the returned element does React start calling `useEffect` callbacks. It calls them in the order in which they called but starting within scope, from the `<Child>` function/component.

    ```
    App: handleChange - event 🔥
    App: render - start 🟢
    App: render - end 🔴
      Child: render - start 🟢
      Child: useState - state 🗄️ [count, setCount]
      Child: render - end 🔴
      Child: useEffect(() => , no deps) - setup 🌐 (componentDidMount&componentDidUpdate)
      Child: useEffect(() => ,[empty deps]) - setup 🌐 (componentDidMount/mount-only)
      Child: useEffect(() => ,[with dep]) - setup 🌐 (componentDidUpdate/updates)
    App: useEffect(() => , no deps) - cleanup 🧹 (componentWillUnmount/remove)
    App: useEffect(() => ,[with dep]) - cleanup 🧹 (componentWillUnmount/remove)
    App: useEffect(() => , no deps) - setup 🌐 (componentDidMount&componentDidUpdate)
    App: useEffect(() => ,[with dep]) - setup 🌐 (componentDidUpdate/updates)
    ```

    Then we're going to start calling the `App` effect callbacks. You'll notice that we called the clean-up callbacks first, and then we call the setup effects next. So both clean-up callbacks are called before the setup effects. And both are in the order in which they appear. You'll also notice the `useEffect` (mount-only) setup and clean-up callbacks, is not called again.

    That's because `useEffect` callbacks are only called if they have no dependencies listed so (mount/update) or if they have a dependency listed (), and one of those dependencies changed. We have a dependency list, but it's empty.

    Because your `useEffect` hooks are only called when there are no dependencies listed being (mount and update), or when a dependency changes and re-render (updates) are component.

    ```
    App: handleChange - event 🔥
    App: render - start 🟢
    App: render - end 🔴
      Child: useEffect(() => , no deps) - cleanup 🧹 (componentWillUnmount/remove)
      Child: useEffect(() => ,[empty deps]) - cleanup 🧹 (componentWillUnmount/remove)
      Child: useEffect(() => ,[with dep]) cleanup 🧹 (componentWillUnmount/remove)
    App: useEffect(() => , no deps) - cleanup 🧹 (componentWillUnmount/remove)
    App: useEffect(() => ,[with dep]) - cleanup 🧹 (componentWillUnmount/remove)
    App: useEffect(() => , no deps) - setup 🌐 (componentDidMount&componentDidUpdate)
    App: useEffect(() => ,[with dep]) - setup 🌐 (componentDidUpdate/updates)
    ```

    This works as expected if you (unmount) a component from the page like `Child`. React will notice the difference from a previous JS condition `{ state ? component : null }` that includes JSX of a component, that was functionally called to render. That if that same condition now excludes that JSX, that it will (unmount/remove/destroy) the component from the page. So as expected, the unmounting component will then call all clean-up callbacks in all defined `useEffect` hooks, of that component.

    **[⬆ Back to Top](#table-of-contents)**

19. ### basic forms

    Forms are a basic building block of the web. Every web application uses form elements as a way to accept input from the user. There are a few things to keep in mind with how forms work on the web and what other elements they associated with. Here are a couple ways you can setup `<form>` components and their needed associated elements.

    The reason you would not `querySelector` as it's not modern code and it breaks encapsulation of our components. That's one of the things that we really love about React, is that we can encapsulate logic within our components. We don't recommend the `event.target[0].value` or `event.target.elements[0].value` either because those implicitly rely on the order in which your elements are rendered and could easily break if you change that order. The recommended is `event.target.elements.usernameInput.value`.

    You don't need to (`ref`) your HTML directly as it's just easier to retrieve the input from the event target elements. It's recommended that you use `for` (in JSX land it's `htmlFor`) and `id` to associate labels with their inputs.

    ```jsx
    const UsernameForm = () => {
      const inputRef = React.useRef();
      const handleSubmit = (event) => {
        event.preventDefault();
        console.dir(event.target);
        const username_opt1 = document.querySelector("input").value;
        const username_opt2 = event.target[0].value;
        const username_opt3 = inputRef.current.value;
        const username_opt4 = event.target.elements.userInput.value;
        alert(`You entered: ${username_opt4}`);
      };
      return (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userInput">Username: </label>
              <input ref={inputRef} id="userInput" type="text" />
            </div>
            <button type="submit">Submit</button>
          </form>
        </>
      );
    };
    ```

    In review, what we had to do here was we create a `<form>` that has a single input and label associated to that input and a `<button>` with the `type={submit}` of submit. It's really important that any button you put inside of a form has a `type={here}` because implicitly it will have a type of submit but it's not entirely clear. With no specified `type={}` the compile will provide one automatically, and that can get confusing as it determines that but its text content it wraps. If you do want to have a cancel button or a reset button, then you want to specify that `type={}` of button. If you don't specify a type, then React will implicitly `submit`, which would really confuse you when clicking say a cancel `<button>`.

    Instead of putting an `onClick` handler within the button as a anonymous arrow function, we put an `onSubmit={}` handler on the form, and it will call our submit handler function (`handleSubmit`) when triggered.

    To avoid a default full page refresh, we use `event.preventDefault`. Then we retrieve the user's input using `target` property of the inbound `event` and then we choose `elements` of the form and matching of `id` and `htmlFor` value we provided, to ensure we retrieve it via the input. Then we alert that, but generally you could submit this to a backend service.

    **[⬆ Back to Top](#table-of-contents)**

20. ### dynamic forms

    A better experience would be to display an error message as changes are entered in our fields, rather than submitting them with incorrect conditions. This can be good for dynamic searching, filtering input, triggering changes when a user checks a checkbox, or a myriad of other use cases. Here, we’re going to dynamically show an error message if the user types something invalid with an `onChange` so they don’t have to wait until they `onSubmit` the whole `<form>` to know they did something wrong.

    To handle this we need state to derive conditions from, like an error message if there is an error. Then we can also make the `<button>` disable if there's an error with the `disabled={}` prop that accepts a boolean value. We can conditionally render this section by just calling `Boolean(error)`. If error is truthy, then we'll pass a true value for disabled. If there is no error or it's falsy, then we'll pass a false value for disabled.

    ```jsx
    function UsernameForm() {
      const [username, setUsername] = React.useState("");
      const isLowerCase = username === username.toLowerCase();
      const error = isLowerCase ? null : "Your input must be lower case. ";

      const handleSubmit = (event) => {
        event.preventDefault();
        alert(`You entered: ${username}`);
      };
      const handleChange = (event) => setUsername(event.target.value);

      return (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userInput">Username: </label>
            <input id="userInput" type="text" onChange={handleChange} />
          </div>
          <span style={{ color: "red" }}>{error}</span>
          <button disabled={Boolean(error)} type="submit">
            Submit
          </button>
        </form>
      );
    }
    ```

    If you ever need to know exactly what is happening in the element you can use the `onChange` event to get access to the `event` value of our input in this case, and update state of our component. As seen before, state change will trigger re-rendering (updates) of a component. That state value will be whatever the user has typed, allowing us to define logic regarding our error message that we can display `<div>{here}</div>` in red and `disable={}` our submit button if there is an error message.

    **[⬆ Back to Top](#table-of-contents)**

21. ### controlled forms

    There are many situations where you want to programmatically control the value of a form field. Maybe you want to set the value of one field based on the user’s interactions with another element. Or maybe you want to change the user’s input as they’re typing it. In this example, we’ll be preventing the user from typing upper case characters.

    In HTML, our associated `<form>` elements such as `<input>`, `<textarea>`, `<select>` typically maintain their own state and update it based on user inputs. However with React, mutable state is typically kept in the state property of our functional components, and only updated via the `setState()` state updater function. We simply add a `value={}` prop here.

    ```jsx
    const UsernameForm = () => {
      const [username, setUsername] = React.useState("");

      const handleSubmit = (event) => {
        event.preventDefault();
        alert(`You entered: ${username}`);
      };
      const handleChange = (event) =>
        setUsername(event.target.value.toLowerCase());

      return (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userInput">Username: </label>
            <input
              id="userInput"
              type="text"
              onChange={handleChange}
              value={username}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      );
    };
    ```

    We can combine the two by ensuring React state is the “single source of truth”. Now when our React component renders a `<form>` we are also controlling what happens in that form's subsequent user `value={}` prop.

    An input form element whose **value** is controlled by React is called a “controlled component”. So again, instead of programmatically changing the value stored in are state, we can control the input's value and keep those two in sync.

    **[⬆ Back to Top](#table-of-contents)**

22. ### error boundaries

    No matter how hard you try, eventually your `App` code just isn’t going to behave how you expect and you’ll need to handle those exceptions because if render is thrown and unhandled, your application will be removed from the page.

    What is visible, is only a blank screen. Luckily for us, there’s a simple way to handle errors in your application using a special kind of component called an `ErrorBoundary`. There is currently no way to create the component with a function and you have to use a class component instead, but luckily there’s a terrific open source library called `react-error-boundary`.

    Let's cover how to write our own error boundary and then use the library instead. Here we simulate an error in our functional component. Click 💣 and notice our entire application goes blank page.

    ```jsx
    function Bomb() {
      throw new Error("💥 KABOOM 💥");
    }

    function App() {
      const [explode, setExplode] = React.useState(false);
      return (
        // #2
        <div>
          // #3
          <div>
            <button onClick={() => setExplode(true)}>💣</button>
          </div>
          // #4
          <div>{explode ? <Bomb /> : "Push the button Max!"}</div>
        </div>
      );
    }
    ReactDOM.render(<App />, document.getElementById("root")); // #1
    ```

    If you navigate to the console a `Uncaught Error: 💥 KABOOM 💥` will be logged out. React actually provides a component call stack we can trace and track down which component "function" calls threw the `Error(💥 KABOOM 💥)`. Remember, because React elements (JSX components) are basically functions, these calls (stack) just like JavaScript function calls.

    ```
    The above error occurred in the <Bomb> component:
      in Bomb (created by App) // #4
      in div (created by App) // #3
      in div (created by App) // #2
      in App // #1
    Consider adding an error boundary to your tree to customize error handling behavior.
    ```

    We have our `App` is rendered/called by ReactDOM.render(here, rootElement). Then we have a two `div` elements in our JSX, which are rendered. Lastly our main App conditionally calls `<Bomb/ >`, which gets rendered/called throwing are simulated error. The tip React provides is consider adding an error boundary to your tree to customize error-handling behavior.

    This kind of stack is also known as an execution stack, program stack, control stack, run-time stack, or machine stack, and is often shortened to just "the stack".

    For more information see [JavaScript Call Stack](https://www.javascripttutorial.net/javascript-call-stack/).

    - When a script calls a function, the interpreter adds it to the call stack and then starts carrying out the function.
    - Any functions that are called by that function are added to the call stack further up, and run where their calls are reached.
    - When the current function is finished, the interpreter takes it off the stack and resumes execution where it left off.
    - If the stack takes up more space than it had assigned to it, it results in a "stack overflow" error.

    A call stack is used for several related purposes, but the main reason for having one is to keep track of the point to which each active subroutine (function called) should return control when it finishes executing. An active subroutine is one that has been called, but is yet to complete execution, after which control should be handed back to the point of (function) call. Such activations of subroutines may be nested to any level (recursively), hence the stack structure.

    LIFO (Last In, First Out): When we say that the call stack, operates by the data structure principle of Last In, First Out, it means that the last function that gets pushed into the stack is the first to be pop out, when the function returns.

    When you execute a script, the JavaScript (JS) engine creates a **Global Execution Context** and pushes it on top of the call stack. Whenever a function is called, the JS engine creates a function execution context for that function also and pushes it on top of the call stack, and starts executing the function. If a function calls another function, the JS engine creates a new function execution context for the function again and pushes it on top of the call stack. When the current function completes, the JS engine pops it off the call stack and resumes/returns execution from where it left off.

    Ok getting back to defining our custom Error boundaries that have to be `class` components. In the body of our React class component, we're going to need a `render()` method we get from extending this class with `React.Component`. It's basically the same thing as the body of our regular functional components, it requires a `return` statement. We're simply going to return `this.props.children`. The React elements we return from this error boundary are going to be the same React elements that are provided as its children props. This way we can wrap other components with it.

    ```jsx
    class ErrorBoundary extends React.Component {
      render() {
        return this.props.children;
      }
    }
    ...
    function App() {
      const [explode, setExplode] = React.useState(false);
      return ( ...
            <ErrorBoundary>
              {explode ? <Bomb /> : "Push the button Max!"}
            </ErrorBoundary>
          </div>
        </div>
      );
    }
    ```

    Now let's make our `ErrorBoundary` handle that error instead. First define `state.error { error: null }`. Then we'll use a static method that'll accept an error argument `getDerivedStateFromError(here)` that returns state changes we want to make based on the passed error argument. So we return an `{}` object literal that's going to be assigned the passing error passed into our static method. When that completes, we're going to get a re-render. So grab that updated state and conditionally render it.

    ```jsx
    class ErrorBoundary extends React.Component {
      state = { error: null };
      static getDerivedStateFromError(error) {
        return { error };
      }
      render() {
        const { error } = this.state;
        if (error) return <div>Oh no!</div>;
        return this.props.children;
      }
    }
    ```

    We can improve this by creating a generic `ErrorFallback` component that excepts a prop called `error` and renders/returns JSX using that error to display the problem in a more friendlier UI. We then modify our `ErrorBoundary` to render this component rather when a error occurs in its state and by providing this prop `FallbackComponent={here}` from where we are calling our boundary for assistance with errors. This will render out our backup/fallback component incase there is an error.

    ```jsx
    class ErrorBoundary extends React.Component {
      ...
      render() {
        const { error } = this.state;
        if (error) {
          return <this.props.FallbackComponent error={error} />;
        }
        return this.props.children;
      }
    }

    function ErrorFallback(props) {
      return (
        <div>
          <p>Something went wrong:</p>
          <pre>{props.error.message}</pre>
        </div>
      );
    }

    function App() {
      ...
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {explode ? <Bomb /> : "Push the button Max!"}
      </ErrorBoundary>
    }
    ```

    Now the preferred approach you will find mostly is a third-party library like [react-error-boundary](https://www.npmjs.com/package/react-error-boundary). That is called React Error Boundary. With the React Error Boundary UMD export, it exposes a global variable called `ReactErrorBoundary`. It has a property on there called `ErrorBoundary`.

    ```html
    <script src="https://unpkg.com/react-error-boundary@1.2.5/dist/umd/react-error-boundary.js"></script>
    ```

    It'll continue to work because we basically built a simple version of the error boundary from this library. The library is doing a fair bit more than our custom error handling, but the API is exactly the same. Here the `<ErrorBoundary>` can be rendered anywhere in the component tree, but the location of the error boundary has a special significance.

    ```jsx
    const ErrorBoundary = ReactErrorBoundary.ErrorBoundary;
    //...
    function App() {
      ...
      return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div>
            <div>
              <button onClick={() => setExplode(true)}>💣</button>
            </div>
            <div>{explode ? <Bomb /> : "Push the button Max!"}</div>
          </div>
        </ErrorBoundary>
      );
    }
    ```

    The `ReactErrorBoundary` can handle any errors that are thrown by its descendants, but it's also important to note that the boundary is going to render something in place of all of its descendants also, when there is an error. If we were to move this error boundary up to encompass our entire app and save that, when we click this button, then the entire app is replaced by our `ErrorFallback` component. This may or may not be desirable, but it could be useful to have one error boundary rendered at the top-level and then other boundaries rendered throughout your application with more specific fallbacks.

    Important to note is that our boundary can only handle certain errors, specifically errors that are happening within the React call stack. It won't handle errors occurring in event handlers or error in a individual asynchronous callback, like a promise. It will only handle errors within a React call stack, like the `render` method or a React `useEffect` callback etc.

    **[⬆ Back to Top](#table-of-contents)**

23. ### rendering lists

    It doesn’t take long working with React before you want to render a list of items and when you do, you’ll inevitably encounter this console warning: “Warning: Each child in a list should have a unique `key={}` prop.”

    This warning is pretty simple to silence by providing the bespoken `key={}` prop, but it is really useful to understand what that warning is about and the bugs that can happen if you do not address the warning properly.

    What we're doing is we're taking an array of strings. We're mapping over that array of strings and turning that array of strings into an array of React elements (`react-element`). Specifically, in our case, these are `li` elements. That's the case where you need to have a `key={}` prop for every React element in the array.

    ```jsx
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      {items.map((item) => (
        <li>
          <button onClick={() => removeItem(item)}>remove</button>{" "}
          <label htmlFor={`${item.value}-input`}>{item.value}</label>{" "}
          <input id={`${item.value}-input`} defaultValue={item.value} />
        </li>
      ))}
    </ul>
    ```

    Looking at the items state that we're iterating over. Each one of those items has an `id` that uniquely identifies the item. We're going to use that id as the `key={here}` prop for each `li` we define.

    ```jsx
    const allItems = [
      { id: "a", value: "apple" },
      { id: "o", value: "orange" },
      { id: "g", value: "grape" },
      { id: "p", value: "pear" },
    ];
    ```

    Without this `key={}` prop, if we trigger our handler function to remove from the middle of are list, the order will not align between the two label and input elements we aligning with. This is the bug that the `key={}` prop helps to avoid.

    If you consider what happens when you trigger the `onClick={() => handleRemove(item)}` this remove button or even the add button, then this strange behavior will make sense. When we click on remove item, for example, it will call our state updater function setItems and that array `filter(i => i !== item)`. That sets the items state to the same list of items that we had before, except we're filtering out the item we're attempting to remove.

    ```jsx
    function App() {
      const [items, setItems] = React.useState(allItems);
      const handleAdd = () =>
        setItems([...items, allItems.find((i) => !items.includes(i))]);
      const handleRemove = (item) => setItems(items.filter((i) => i !== item));

      return (
        <div>
          <button onClick={handleAdd}>add item</button>
          <ul>
            {items.map((item) => (
              <li>
                <button onClick={() => handleRemove(item)}>remove</button>{" "}
                <label htmlFor={`${item.value}-input`}>{item.value}</label>{" "}
                <input id={`${item.value}-input`} defaultValue={item.value} />
              </li>
            ))}
          </ul>
        </div>
      );
    }
    ```

    This call to setItems being the state updater function, is going to trigger a re-render (update) of our `App` as we're going to create a new list of items, that we `map()` new `li` JSX elements. We're going to iterate over (`map`) this list of items, which now has one less item than it had before. We're going to hand that off to React so that it can update the DOM appropriately. The way React updates the DOM is it has a _reference_ to the JSX `react-element` you gave it, the last time it rendered your component. It compares those React elements with the new React elements returned. Then it updates the DOM accordingly.

    Now when we give it an array of React elements, unless React has some sort of identifier to know which element is which, it doesn't know whether you removed an element or added etc.

    **Important:** So just keep in mind, anytime you render an array of React elements, you need to give it a `key={here}` prop so that it can determine whether elements were removed, added, or modified. Keys need to be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted. Lastly, do not hardcode your `key={here}` as that would duplicate across your elements, leading to unexpected behavior.

    In review, it's really common in React to take an array and `map()` that array to an array of elements and render that directly in our JSX. When we do this, it's important that you add a `key={}` prop to the root React element of each element in the array so React can track changes over time and make sure that it preserves the state of each element in the array and its descendants.

    **[⬆ Back to Top](#table-of-contents)**

24. ### lifting and co-locating

    How to share state between two sibling components? The answer is to "lift" the state which basically amounts to finding the lowest common parent shared between the two components and placing the state management there, and then passing the state and a mechanism for updating that state down where needed.

    ```jsx
    function App() {
      const [name, setName] = React.useState();
      return (
        <form>
          <YourName
            name={name}
            onNameChange={(event) => setName(event.target.value)}
          />
          <YourAnimal />
          <Results name={name} /> /* needs state managed in sibling */
        </form>
      );
    }

    const YourAnimal = () => {
      /* "lift" to common parent */
      const [animal, setAnimal] = React.useState("");
      return (
        <div>
          <label>Favorite Pet: </label>
          /* "lift" to common parent */
          <input
            value={animal}
            onChange={(event) => setAnimal(event.target.value)}
          />
        </div>
      );
    };

    const Results = ({ name, here }) => (
      <h4>{`${name}, favorite animal is a ${here}!`}</h4>
    );
    ```

    If you need to share state that is currently living in one component, between two components like a sibling, you can "lift" that state to the closest shared parent component.

    **Important:** to pass a function through as `({ props })` would allows those child components to update the derived state, that is living in the parent component, which is basically a higher order function (HOF).

    Remember, `props` is short for properties and they are used to pass data between React components. React’s data flow between components is uni-directional (from parent to child only). Firstly, we need to define/get some data from the parent component and assign it to a child component’s “prop” attribute. And finally, we use dot notation to access the prop data and render it.

    Now if you need to share state that is currently living in one component horizontally between two other components, "lift" that state to the closest shared parent component. Remember to pass a function through the `({ props })` that allows child components to update state now residing in a parent.

    ```jsx function App() {
      const [name, setName] = React.useState();
      const [animal, setAnimal] = React.useState();
      return (
        <form>
          <YourName
            name={name}
            onNameChange={(event) => setName(event.target.value)}
          />
          <YourAnimal
            animal={animal}
            onAnimalChange={(event) => setAnimal(event.target.value)}
          />
          <Results name={name} animal={animal} />
        </form>
      );
    }

    const YourName = ({ name, onNameChange }) => (
      <div>
        <label>Name: </label>
        <input value={name} onChange={onNameChange} />
      </div>
    );

    const YourAnimal = ({ animal, onAnimalChange }) => {
      return (
        <div>
          <label>Favorite Pet: </label>
          <input value={animal} onChange={onAnimalChange} />
        </div>
      );
    };

    const Results = ({ name, animal }) => (
      <h4>{`${name}, favorite animal is a ${animal}!`}</h4>
    );
    ```

    In review, in lifting state, make sure it resides as close to the code that needs it as possible. Generally the use case for lifting is when a sibling component needs access to those state values, we had to lift that state to the least common parent (`App`). We passed that state and the mechanism for updating state as `({ props })`, which is our state updater function as a callback prop to event handlers, to sibling components that need it.

    Now one thing developers find harder is "pulling" that state back down known as co-locating state. When we pull "co-locate" down we move are state closer to where it is being used in the component tree. That is the opposite of "lifting" up that is sharing that state and deriving props to sibling components.

    ```jsx
    function App() {
      return (
        <form>
          /* pull "co-locate" state back down */
          <YourName />
          <YourAnimal />
          /* no requirement for sharing "lifting" state */
        </form>
      );
    }

    const YourName = () => {
      const [name, setName] = React.useState();
      return (
        <div>
          <label>Name: {name}</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
      );
    };

    const YourAnimal = () => {
      const [animal, setAnimal] = React.useState();
      return (
        <div>
          <label>Favorite Pet: {animal}</label>
          <input
            value={animal}
            onChange={(event) => setAnimal(event.target.value)}
          />
        </div>
      );
    };
    ```

    You will know when this needs to occur when state is only being used by a single component. That means we can actually pull that state back down into that component and get it co-located. And that enhances both the performance and state management maintainability of your application.

    **[⬆ Back to Top](#table-of-contents)**

25. ### html

    React applications tend to involve interacting with a server to load and persist data. Here we use _HTTP requests_ with the browser’s built-in `fetch` API. HTTP requests are inherently asynchronous in nature and they’re also side-effect so we’ll need to manage not only starting the request, but also what we should show the user while the request has that “in flight” effect.

    We have this "helper" function here called `fetchPokémon` that creates a GraphQL query that will return the window `fetch` method that it returns a Promise. The second argument `fetch(url, { here })` is a object literal that takes the following keys `method`, `headers` and `body`. Here being a posting with the needed headers and content type regarding JSON, that we serialize by `body: JSON.stringify(here)` a version of our `query` and `variables` need by GraphQL for our query, which is the name of the Pokémon.

    ```javascript
    function fetchPokémon(name) {
      const pokemonQuery = `
        query PokemonInfo($name: String) {
          pokemon(name: $name) {
            id
            number
            name
            attacks {
              special {
                name
                type
                damage
              }
            }
          }
        }
      `;
      return window
        .fetch("https://graphql-pokemon.now.sh", {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            query: pokemonQuery,
            variables: { name },
          }),
        })
        .then((response) => response.json())
        .then((response) => response.data.pokemon);
    }
    ```

    When that promise resolves we `then()` call that takes the response parses the JSON with `json()` and when that's done, we'll get that response object and pluck the data needed in the response.

    ```jsx
    function App() {
      const [pokemonName, setPokemonName] = React.useState("");
      const handleSubmit = (event) => {
        event.preventDefault();
        setPokemonName(event.target.elements.pokemonName.value);
      };
      return (
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="pokemonName">Pokemon Name</label>
            <div>
              <input id="pokemonName" />
              <button type="submit">Submit</button>
            </div>
          </form>
          <hr />
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      );
    }

    function PokemonInfo({ pokemonName }) {
      return <div>Need to request info for: {pokemonName}</div>;
    }
    ```

    We can call the "helper" function to get information requested by the `pokemonName={}` prop from `App`. But within our child component's render/return method, it has to be synchronous. However fetching data is asynchronous, the "helper" returns a promise which is asynchronous. So that means the HTTP request is a side-effect, and that means the `PokemonInfo` component will require a effect callback.

    ```jsx
    function PokemonInfo({ pokemonName }) {
      const [pokemon, setPokemon] = React.useState(null);
      React.useEffect(() => {
        if (!pokemonName) return;
        fetchPokémon(pokemonName).then((response) => setPokemon(response));
      }, [pokemonName]);

      if (!pokemonName) return "Submit a pokemon";
      if (!pokemon) return "...";

      return <pre>{JSON.stringify(pokemon, null, 2)}</pre>;
    }
    ```

    In review, to do anything asynchronous, that is a side effect that needs to happen inside a `useEffect` callback. For our `PokemonInfo`, we get passed a `pokemonName` prop and direct that into our callback, if there's no pokemonName specified, then we'll simply return out, leaving that block of execution. Otherwise, we'll fetch the response, regarding that prop that has derived from state in the parent.

    Then when we get that data back, we'll update local state to have that data, that will trigger re-rendering of the child `PokemonInfo` component. We return a stringified version of that state.

    We could apply an optimization to make sure that this `useEffect` only runs when we want it to, by placing the prop in the dependency array. Now this effect callback will only call when the derived state changes.

    **[⬆ Back to Top](#table-of-contents)**

26. ### html errors

    Unfortunately, sometimes a server request fails and we need to display a helpful error message to the user. Here we cover how best to display manage the state of our requests, so we have a deterministic render/return method to ensure we always show the user information based on the current state of our React component.

    A common mistake people make is to create a state variable called `isLoading` is setting them to true or false. Instead, use "status variable" that we update with `setStatus` which can be idle, pending, resolved, or rejected. Lets also use a `setError`, initialized to `null`, we'll say if there's an error, conditionally return 'Oh no 😔'. Let's be more helpful, add an error handler as a second argument to our `then()` call or chain a `catch()`.

    ```jsx
    function PokemonInfo({ pokemonName }) {
      const [status, setStatus] = React.useState("idle"); // status state variable
      const [pokemon, setPokemon] = React.useState(null);
      const [error, setError] = React.useState(null);

      React.useEffect(() => {
        if (!pokemonName) return;
        setStatus("pending");
        fetchPokemon(pokemonName)
          .then((response) => {
            setStatus("resolved");
            setPokemon(response);
          })
          .catch((errorData) => {
            setStatus("rejected");
            setError(errorData);
          });
      }, [pokemonName]);
      // conditional rendering:
      if (status === "idle") return <p>Submit a pokemon, like pikachu!</p>;
      if (status === "rejected") return <p>Oh no 😔! {error}</p>;
      if (status === "pending") return <p>Loading... ⏱️</p>;
      if (status === "resolved") {
        return (
          <div>
            <p>graphql query:</p>
            <pre>{JSON.stringify(pokemon, null, 2)}</pre>
          </div>
        );
      }
    }
    ```

    We added some error handling by creating `error` state management, and added an error handler to our promise chain. If we get some error data, then we're going to set that error data so that we can render something useful to the user indicating that there's been a problem.

    Then, to avoid some state bugs, we added a `status` state so that we could start out with idle and depending on the progress of the function, we setStatus(here) to conditionally render based on that section of the execution.

    **[⬆ Back to Top](#table-of-contents)**
