# Beginners Guide to React

> Click :star:if you like the project. Pull Request are highly appreciated.
> Follow me [@hastytoro](https://twitter.com/hastytoro) for updates.

### Table of Contents

| No. | Questions                                           |
| --- | --------------------------------------------------- |
|     | **Core React**                                      |
| 1   | [document create element](#document-create-element) |
| 2   | [react create element](#react-create-element)       |

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

   To use React to create this user interface, we're going to need to have React on the page. We can get React from npm, but there's a service called [unpackage](https:/unpkg.com) that you can use that has any file that distributed on npm also available in a minified version. Add the following `<script>` tags to your html page so that React packages are accessible on the page.

   ```html
   <script src="https:/unpkg.com/react@16.12.0/umd/react.development.js"></script>
   <script src="https://unpkg.com/react-dom@16.12.0/umd/react-dom.development.js"></script>
   ```

   With `react` we create React elements and then use `react-dom` to render those elements to the page. Now the element that we provide is not going to be a `document` instanced object. Instead, it's going to be a `React.createElement()` instantiated by React. The API is not exactly the same. We do get to specify the type of element as the first argument below being `div`, but instead of getting the element via `document.getElementById("root")` and attaching properties to it, we specify those properties on instantiation of the object instance. We then can render this element with `ReactDOM.render()` method to the root element.

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

   Now if this is not a DOM Node then what is it? If we `console.log(element)` that out, we have a `$$typeof: Symbol(react.element)` property. That's a `Symbol` type so that React knows that this object is a legitimate React element. We know that the `type: "div"` and there are a couple other properties that are used by React internally but then we get to the `props` property that has reference to an object that is what we passed as our second argument to `createElement()`.

   There's something interesting about `props.children` also known as children prop. You can write this same thing as a third argument to `React.createElement()` by simply providing the value for the children prop. Here we can provide "Hello World". Those are functionally equivalent.

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

   **[⬆ Back to Top](#table-of-contents)**
