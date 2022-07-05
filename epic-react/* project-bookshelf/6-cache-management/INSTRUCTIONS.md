# Cache Management

## 📝 Your Notes

## Background

App state management is arguably one of the hardest problems in development.
This is evidenced by the myriad of libraries available to accomplish it. In my
experience, the issue is made even more challenging by over-engineering,
pre-mature abstraction, and lack of proper categorizing of state.

State can be lumped into two buckets:

1. UI state: isModal open, isItem selected, etc.
2. Server cache: User data, tweets, contacts, etc.

A great deal of complexity comes when people attempt to lump these two distinct
types of state together. Your `[ui]` state shouldn't be global but local. If not
and you bundle it along with `[server-cache]` state (that's typically global),
you making everything global 👎. And its further complicated by the fact that
caching is one of the hardest problems in software development, in general.

We can drastically simplify our `[ui]` state management if we split out the
`[server-cache]` state stiff into something separate. A fantastic solution for
managing it is [`react-query`](https://react-query-v2.tanstack.com/).

It is a set of React hooks that allow you to query, cache, and mutate data on
your server in a way that's flexible to support many use cases and optimizations
but opinionated enough to provide a huge amount of value. And thanks to the
power of hooks, we can build your own custom hooks.

Here we demonstrate react-query:

```javascript
function App({ tweetId }) {
  const result = useQuery({
    queryKey: ["tweet", { tweetId }],
    queryFn: (key, { tweetId }) =>
      client(`tweet/${tweetId}`).then((data) => data.tweet),
  });
  // result has several properties, here are a few relevant ones:
  //   - status
  //   - data
  //   - error
  //   - isLoading
  const [removeTweet, state] = useMutation(() => tweetClient.remove(tweetId));
  // call removeTweet when you want to execute the mutation callback
  // state has several properties, here are a few relevant ones:
  //   - status
  //   - data
  //   - error
}
```

Here are the docs:

- `useQuery`: https://react-query-v2.tanstack.com/docs/guides/queries
- `useMutation`: https://react-query-v2.tanstack.com/docs/guides/mutations

## Exercise

Here we need to wire up our UI with those APIs. Here are a few new client
endpoints you'll need to know about:

- GET: `list-items` - get the user's list items
- POST: `list-items` with data - create user list items
- PUT: `list-items/${listItemId}` with data - update a list item
- DELETE: `list-items/${listItemId}` - delete a list item
- GET: `books/${bookId}` - get data on a specific book

Keep in mind, if you have two of the same resources (used in two different
components) make sure to use the same `queryKey`. Otherwise you'll have two
entries for that resource in the cache. And make sure their `queryFn` do the
same thing or you'll have some pretty odd behavior!

- #1 Create "data" with useMutation

What we doing here is creating a mutation with react-query's `useMutation` hook.
The first argument is a mutation callback we can trigger. Here we accepting the
bookId and calling into the express `client`, at the `list-items` endpoint so we
can create a list item for a particular book.

We passing a user's `token` along so this can be an authenticated request, and
the backend will know which user to associate this book list item to.

```jsx
function StatusButtons({ user, book }) {
  const listItem = null;
  const [create] = useMutation(({ bookId }) => {
    client("list-items", { data: { bookId: bookId }, token: user.token });
  });
  return (
    <React.Fragment>
      ...
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          // Add an onClick here that calls remove
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => create({ bookId: book.id })}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  );
}
```

Returned from `useMutation` array and we destructure out the `create` function,
which we pass along as part of an onClick to a button in the UI, which is called
to create with the book ID, the book that we want to create a list item for.

- #2 View "data" with useQuery

Let's update our submit buttons component, so it will also query the backend for
a endpoint called `list-items` that a user has created. For this we're going to
need `useQuery` from react-query.

To query data from the backend you're going to use the `useQuery` hook, which
can take a configuration object with a `queryKey`. React query then identifies
data returning back from a particular query, and uses a `queryFn` callback to
work on that data, for that particular query.

In the function call we trigger a client API request against the `list-items`
endpoint. We'll pass the `user.token` along so the backend knows the user is
allowed to make that request. Followed by a promise chain, we return `data`.

The data we return from `useQuery`, we'll alias that to listItems, and then when
that query finally resolves, we have listItems. We'll look for the `li` in our
listItem with the `find()` method, associated to the book. We take one `li` at a
time and we compare its id if ts equal to the `book.id`, passed in as a prop.

```jsx
function StatusButtons({user, book}) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItem),
  })
  // We're going to add the `?` elvis operator so that if listItems isn't defined
  // yet (because the above is a async task), we'll not execute the `find`.
  const listItem = listItems?.find(li => li.bookId === book.id) ?? null
  // For all the mutations below, if you want to get the list-items cache
  // updated after this query finishes, use the `onSettled` config option
  // to queryCache.invalidateQueries('list-items')
  const [create] = useMutation(
    ({bookId}) =>
      client('list-items', {data: {bookId: bookId}, token: user.token}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )
  ...
}
```

How can we make sure that the `useMutation` updates to our list triggers another
query using the `queryFn`? because we have made a modification now, a updated
list of items is needed now. React Query isn't going to re-request the listItems
for us automatically. We need to tell it that, "Hey we just did a mutation here
modifying the backend that affects the query used to populate listItem."

So we invalidate that query, within our useMutation call we add a `onSettled`
option. Whether this succeeds or fails, we're going to call this function
anonymous function which will invalidate the query for listItems.

Using `queryCache` we invalidate the `queryFn` again based on our `queryKey`,
which triggers another call to go get updated data, and refresh our cache.

- #3 Remove with useMutation

Our mutate function should call the endpoint `list-items/${id}` with a DELETE.
Triggering a removal from the backend.

When finished, if its successful or it fails, we're going to invalidate the
`listItemsQuery` via the onSettled configuration option. That will trigger a
useQuery `queryFn` callback to update "removal" when complete. That's using the
same `queryKey` and same `queryFn` that we're using elsewhere. So React Query
will reuse the query if this data is already in the cache.

```jsx
function StatusButtons({user, book}) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItem),
  })
  const listItem = listItems?.find(li => li.bookId === book.id) ?? null
  ...

  // Call useMutation here and assign the mutate function to "remove"
  // The mutate function should call the endpoint with a DELETE method
  const [remove] = useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )
  ...
  return (
    <React.Fragment>
      ...
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => remove({id: listItem.id})}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => create({bookId: book.id})}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}
```

For removal, we accept the `id` of the listItem and invoke remove in the tooltip
button via a `onClick` inline handler, that removes a listItem by id.

- #4 Update with useMutation

For the update portion of this we use a `useMutation` again. For our mutation
function we accept all of the updates that need to be made, and then we call
into our client API to make those updates with a PUT method.

```jsx
// Call useMutation here and assign the mutate function to "update".
// Mutate function should call `list-items/${id}` endpoint with PUT method.
// The mutate function will be called with the updates, can pass as data.
const [update] = useMutation(
  ({ updates }) =>
    client(`list-items/${updates.id}`, {
      method: "PUT",
      data: updates,
      token: user.token,
    }),
  { onSettled: () => queryCache.invalidateQueries("list-items") }
);
```

We pass those updates as data. We pass along the user's token to make it an
authenticated request. Then when it's finished, whether it rejects or resolves
we're going to invalidate queries again to our endpoint with `queryCache`, and
that makes sure we have the very latest of all of the listItems by useQuery. We
use our imported `useQuery` and our client.

Ensure you use the same `queryKey` for both queries. That being the client API
and react-query so they can associate them together. Additionally, the `queryFn`
needs to be exactly the same, as well. Otherwise you could load different data
into the same spot of React Query's cache, which is a very bad outcome.

That's using the same `queryKey` and same `queryFn` that we're using elsewhere.
So React Query will reuse the query if this data is already in the cache. The
point is we can use the same logic across components:

```jsx
function ListItemList({
  user,
  filterListItems,
  noListItems,
  noFilteredListItems,
}) {
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      client(`list-items`, { token: user.token }).then(
        (data) => data.listItems
      ),
  });
  const filteredListItems = listItems?.filter(filterListItems);

  if (!listItems?.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>{noListItems}</div>
    );
  }
  if (!filteredListItems.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>
        {noFilteredListItems}
      </div>
    );
  }
  return (
    <BookListUL>
      {filteredListItems.map((listItem) => (
        <li key={listItem.id}>
          <BookRow user={user} book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  );
}
```

If we have listItems, then we'll array `filter()` based on the filterListItem
prop, producing a filtered list items. All we needed to do above is bring in
`useQuery` and our client API. We copied that (same query) to get all of our
list items, and then used that for each of these book lists.

- #5 Replacing useAsync with useQuery

What we did here is we had taken that useAsync custom hook that's specific to
our application and swapped it out for `useQuery`.

Allowing us to give it a `queryKey`, data that can be cached across pages. We
can see the benefit of this by going to different application pages, and when
return to the page/component with the `queryKey`, that data is cached already.

```jsx
function DiscoverBooksScreen({user}) {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)
  // Replace this useAsync call with a useQuery call to handle the book search.
  // The queryKey should be ['bookSearch', {query}].
  // The queryFn should be the same thing we have in the run function.
  // You'll get back the same logic (except the run function).
  const {data, error, isLoading, isError, isSuccess} = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books),
  })

  const books = data ?? loadingBooks
  ...
}
```

The result comes back instantaneously, because it's already in the cache. The
cool thing about `useQuery` react-query is it gives us all of the right knobs to
twist to make the cache operate exactly as we want it to.

- #6 Clearing out cache with queryCache

```jsx
import {queryCache} from 'react-query'
...

async function getUser() { ...
}

function App() {
  const { ...
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    queryCache.clear() // here we clear out our useQuery caching!
    setData(null)
  }
```

When the user clicks out that Log out button, we not only log them out with the
AuthProvider, but we also clear the `queryCache` so data isn't shared between
users and then in our API client, when we boot them, if they make a request
they're not allowed to, we will also clear that queryCache as well.

### Files

- `src/components/status-buttons.js`
- `src/components/book-row.js`
- `src/components/rating.js`
- `src/screens/discover.js`
- `src/screens/book.js`
- `src/components/list-item-list.js`,
- `src/app.js`
- `src/utils/api-client.js`

## Extra Credit

### 1. 💯 Make hooks

How are you enjoying all this repetition?

No? Yeah, I'm not a big fan either. Here's where React hooks come in really
handy! Let's make a few custom hooks. Here are a few ideas:

- `useBook(bookId, user)`
- `useBookSearch(query, user)`
- `useListItem(user, bookId)`
- `useListItems(user)`
- `useUpdateListItem(user)`
- `useRemoveListItem(user)`
- `useCreateListItem(user)`

This really helps simplify all components in app that requires the same data.
Example, for getting all `listItems`, and another for a specific item by bookID,
gives us a nice API to use in components via a custom hook.

```jsx
function useListItems(user) {
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      client(`list-items`, { token: user.token }).then(
        (data) => data.listItems
      ),
  });
  return listItems ?? [];
}

function useListItem(user, bookId) {
  const listItems = useListItems(user);
  return listItems.find((li) => li.bookId === bookId) ?? null;
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries("list-items"),
};

function useUpdateListItem(user) {
  return useMutation(
    (updates) =>
      client(`list-items/${updates.id}`, {
        method: "PUT",
        data: updates,
        token: user.token,
      }),
    defaultMutationOptions
  );
}

function useRemoveListItem(user) {
  return useMutation(
    ({ id }) =>
      client(`list-items/${id}`, { method: "DELETE", token: user.token }),
    defaultMutationOptions
  );
}

function useCreateListItem(user) {
  return useMutation(
    ({ bookId }) =>
      client(`list-items`, { data: { bookId }, token: user.token }),
    defaultMutationOptions
  );
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
};
```

Being able to compose custom hooks out of hooks from React Query is powerful.
Not only do we remove duplicated code and typo mistakes, we avoiding the risk of
different `queryKey` or a different `queryFn` for the data in question.

Also we can hide away implementation details for the specific data. On top of
that, we can alter the API to make it more convenient for our use cases.

In review, we took code we had in our StatusButtons, we moved it over to our
custom hook, and now our StatusButtons looks super nice and clean. Our custom
hooks help us take advantage of additional abstraction anytime we make queries
or mutation, and the default behavior is to invalidate the listItems query.

**Files:**

- `src/utils/books.js`
- `src/utils/list-items.js`
- `src/components/status-buttons.js`
- `src/components/rating.js`
- `src/components/book-row.js`
- `src/screens/discover.js`
- `src/screens/book.js`
- `src/components/list-item-list.js`,

### 2. 💯 Wrap the `<App />` in a `<ReactQueryConfigProvider />`

Currently, we're not doing any error handling for our queries. If there's an
error, we don't show the user at all. You'll just sit there with a loading book
forever while react-query continues to retry forever.

For example, try to go to `/book/not-a-book-id`:
http://localhost:3000/book/not-a-book-id

We already have error boundaries set up for this app to handle runtime errors.
Let's reuse boundaries to handle errors in querying for data!

Another thing you might notice is react-query is pretty eager to update its
cache which results in lots of requests in our network tab. This is actually
great because it means our app's data won't have as many stale data issues.
However it's more eager than you might want.

Luckily, react-query gives us all the options to tweak how frequently to update
the cache and how many times to retry.

In `src/index.js`, create a queryConfig object and enable `useErrorBoundary` and
disable `refetchOnWindowFocus` for queries (not for mutations though).

You may also consider customizing the `retry` option as well. See if you can
figure out how to make it not retry if the error status is 404.

Learn more about error boundaries:
https://reactjs.org/docs/error-boundaries.html

Learn more about query config:
https://react-query-v2.tanstack.com/docs/api#reactqueryconfigprovider

```jsx
const queryConfig = {
  queries: {
    /* your global query config */
    useErrorBoundary: true,
    retry(failureCount, error) {
      if (error.status === 404) return false;
      else if (failureCount < 2) return true;
      else return false;
    },
  },
};

ReactDOM.render(
  <ReactQueryConfigProvider config={queryConfig}>
    <App />
  </ReactQueryConfigProvider>,
  document.getElementById("root")
);
```

Once finished, try going to http://localhost:3000/book/not-a-book-id again and
it should give you an error message and not retry network requests.

**Files:**

- `src/index.js`

### 3. 💯 Handle mutation errors properly

Currently, if there's an error during a mutation, we don't show the user
anything. Instead, we should show the error message to the user. We'll need to
do a few things to make this work everywhere.

You can test this behavior by using the app DevTools (hover over the bottom of
the page) and add a request failure config for `PUT` requests to
`/api/list-items/:listItemId`, or type "FAIL" in the notes.

Let's start with showing an error message for the notes and rating. For those,
we simply need to access the error state and display it.

The `<NotesTextarea />` component in `src/screens/book.js` will need to
destructure the `error` and `isError` properties
(`const [mutate, {error, isError}] = useUpdateListItem(user)`) and use those to
display the error inline. You can use this UI:

```javascript
import { ErrorMessage } from "components/lib";

// ... then in the component next to the label:
{
  isError ? (
    <ErrorMessage
      error={error}
      variant="inline"
      css={{ marginLeft: 6, fontSize: "0.7em" }}
    />
  ) : null;
}
```

For the Rating component in `src/components/rating.js`, you'll do basically the
same thing. Put the UI next to the stars.

Next, let's handle those status buttons (the create/update/delete buttons). For
those, you'll notice that each is a `TooltipButton` in
`src/components/status-buttons.js`. The `TooltipButton` is using `useAsync` and
passing the return value of `onClick` to `run`. We need the promise `onClick`
returns, to reject so we can show the error.

To make this work, we need to update the `useMutation` functions in the
`src/utils/list-items.js` to accept options (so I should be able to call
`useUpdateListItem(user, {throwOnError: true})`).

Next, we'll need to enable `throwOnError` in `src/components/status-buttons.js`.
Here's what the `throwOnError` does:

```javascript
const [mutate] = useMutation(
  () => {
    throw new Error("oh no, mutation failed!");
  },
  { throwOnError: true }
);

const success = () => console.log("success");
const failure = () => console.log("failure");

mutate().then(success, failure);

// {throwOnError: false} (which is the default) would log: "success"
// {throwOnError: true} logs: "failure"
```

In our `TooltipButton` component, we're handling the mutation errors with our
own `useAsync` hook, so we want the error to propagate rather than be handled by
react-query. This being the case, the hooks we're calling in the `StatusButtons`
component should configure `throwOnError` to `true`.

You might also see if you can figure out how to make it so we reset the error
state if the user clicks the tooltip button when it's in an error state. (You
can call `reset` from `useAsync`).

**Files:**

- `src/utils/list-items.js`
- `src/screens/book.js`
- `src/components/rating.js`
- `src/components/status-buttons.js`

### 4. 💯 Add a loading spinner for the notes

If you made it this far, then you're a real champ. I'm going to let you figure
this one out on your own. Try to add an inline loading spinner to the notes in
`src/screens/book.js`.

Tip: you can get `isLoading` from the mutation query.

**Files:**

- `src/screens/book.js`

### 5. 💯 Prefetch the book search query

Right now, open up the app and do this:

1. Go to the discover page.
2. Add the first book that comes back to your list (without typing in the
   search)
3. Click that book
4. Click the back button
5. Notice that the book you added is in the search results for a moment and then
   disappears.

The reason this happens is because react-query has cached our search for an
empty string and when the user returns to this page they're looking at cached
results. However, the server will respond with only books that are _not_ in the
user's reading list already. So while we're looking at the stale data,
react-query validates that stale data, finds that the data was wrong and we get
an update.

This isn't a great user experience. There are various things we can do to
side-step this. We could clear the react-query cache (something worth trying if
you want to give that a go, be my guest!). But instead, what we're going to do
is when the user leaves the discover page, we'll trigger a refetch of that query
so when they come back we have the search pre-cached and the response is
immediate.

To do this, you'll need a `refetchBookSearchQuery` function in the `books.js`
util and an effect cleanup that calls this utility in the `discover.js`
component.

📜 You'll want to use `react-query`'s `queryCache.prefetchQuery` and
`queryCache.removeQueries` functions:

- https://react-query-v2.tanstack.com/docs/api#querycacheremovequeries
- https://react-query-v2.tanstack.com/docs/api#querycacheprefetchquery

**Files:**

- `src/utils/books.js`
- `src/screens/discover.js`

### 6. 💯 Add books to the query cache

[Production deploy](https://exercises-06-cache-management.bookshelf.lol/extra-6)

Right now, open up the app and do this:

1. Go to the discover page.
2. Click any book.
3. Notice that there's a loading state while we're loading the book's
   information

One thing you might notice about this is that we actually have all the data we
need already from the search results page! There's no reason to load the book
data. The problem is that the discover page is caching book search results and
the book page is trying to get books from the cache by a different query key.

You'll notice this same problem if you add a book to your reading list, then
refresh and click on that list item. You should have everything you need
already, but the query cache wasn't populated properly.

There are a few ways we could solve this, but the easiest is to just leave our
queries as they are and pre-populate the query cache with the books as we get
them. So when the search for books is successful, we can take the array of books
we get back and push them into the query cache with the same query key we use to
retrieve them out of the cache for the book page.

To do this, we can add an `onSuccess` handler to our book search query config.
We'll want to do something similar for the list items (because the book data
comes back with the list item as well). So when either request is successful,
you'll want to set the book data in the query cache for that book by it's ID.
Try to figure that out.

💰 You may find it helpful to create a `setQueryDataForBook` function in
`src/utils/books.js` and export that so you can use that function in
`src/utils/list-items.js`.

Keep in mind, the query cache identifies a resource by it's key. The key for a
book is: `['book', {bookId}]`.

📜 Here are some docs you might find helpful:

- `queryCache.setQueryData`:
  https://react-query-v2.tanstack.com/docs/api#querycachesetquerydata
- `config.onSuccess`: https://react-query-v2.tanstack.com/docs/api#usequery

**Files:**

- `src/utils/books.js`
- `src/utils/list-items.js`

### 7. 💯 Add optimistic updates and recovery

[Production deploy](https://exercises-06-cache-management.bookshelf.lol/extra-7)

What percent of mutation requests (requests intended to make a change to data)
in your app are successful? 50%? 70%? 90%? 99%? I would argue that the vast
majority of requests users make in your apps are successful (if not, then you
have other problems to deal with... like annoyed users). With that in mind,
wouldn't it make sense to assume that the request is going to succeed and make
the UI appear as if it had? Successful until proven otherwise?

This pattern is called "Optimistic UI" and it's a great way to make users feel
like your app is lightning fast. Unfortunately it often comes with a lot of
challenges primarily due to race-conditions. Luckily for us, `react-query`
handles all of that and makes it really easy for us to change the cache directly
and then restore it in the event of an error.

Let's make our list items optimistically update when the user attempts to make
changes. You'll know you have it working when you mark a book as read and the
star rating shows up instantly. Or if you add a book to your reading list and
the notes textarea shows up instantly.

📜 To make the proper changes to the list item mutations, you'll need to know
about the following things:

- `onMutate`, `onError` and `onSettled`:
  https://react-query-v2.tanstack.com/docs/api#usemutation (use `onMutate` to
  make your optimistic update, use `onError` to restore the original value, and
  use `onSettled` to trigger a refetch of all the `list-items` to be sure you
  have the very latest data). NOTE: What you return from `onMutate` will be the
  third argument received by `onError`.
- `queryCache.invalidateQueries`:
  https://react-query-v2.tanstack.com/docs/api#querycacheinvalidatequeries
- `queryCache.getQueryData`:
  https://react-query-v2.tanstack.com/docs/api#querycachegetquerydata (to get
  the data you'll restore in the event of an error)
- `queryCache.setQueryData`:
  https://react-query-v2.tanstack.com/docs/api#querycachesetquerydata (to set it
  to the optimistic version of the data and to restore the original data if
  there's an error)

This one is definitely a challenge. It'll take you more than a few minutes to
figure it out. I suggest you take your time and try and work it out though.
You'll learn a lot!

A good way to test this one out in the app is the rating. Click one star and
move the mouse away and the stars should show your selection immediately.

**Files:**

- `src/utils/list-items.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=06%3A%20Cache%20Management&em=
