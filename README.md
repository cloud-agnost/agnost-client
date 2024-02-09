# Agnost Client Side Library

Javascript front-end client for Agnost backend apps.

[Agnost](https://agnost.com) is an **open source Kubernetes based backend application development platform**, to design, deploy and manage scalable applications. It simplifies
application development by eliminating repetitive tasks, providing pre-integrated and ready-to-use
execution environments, and automating key stages in the application development process.

For the Client Library guide with quickstarts and examples please visit [Client API Guide](https://agnost.com/client-reference) and for detailed API documentation visit
[Client API reference](https://agnost.com/client-api/modules.html)

## Installation

In order to use the Agnost client library you need to <u>create an app version and a API key in your
Agnost cluster</u>. Additionally, if you will be using the Authentication module of this library, you might
need to do additional configuration in your app version settings.

### NPM

To install via [NPM](https://www.npmjs.com/)

```sh
npm install agnost
```

If you're using a bundler (like [webpack](https://webpack.js.org/)), you can import the Agnost and
create your Agnost client instance.

```js
import { createClient } from 'agnost';

//Create a client for interacting with backend app
//You need to provide envUrl and apiKey as input parameters
const agnost = createClient('http://my-cluster.com/env-myenvid', 'api-key');
```

### CDN

To install with a CDN (content delivery network) add the following script to import Agnost client
library.

```html
<script src="https://cdn.jsdelivr.net/npm/agnost"></script>
```

Then you can use it from a global `agnost` variable:

```html
<script>
   const { createClient } = agnost;
   //Create a client for interacting with backend app
   //You need to provide envUrl and apiKey as input parameters
   const client = createClient('http://my-cluster.com/env-myenvid', 'api-key');
</script>
```

As input to `createClient` you need to provide the base URL of your app version's API server and api-key. You can access your app `baseUrl` from the **Environments** view or your Version Settings and create a new
`apiKey` from **Version Settings/API Keys** view in Agnost Studio.

## Quick start

This guide will show you how to use the key modules of the client library to execute commands in
your backend app. For more in-depth coverage, see the
[Client API Reference](https://agnost.dev/client).

### Authentication

#### **Sign up new users with email:**

If the email confirmation is **enabled** and you have defined your SMTP server to send outgoing emails in your app version authentication settings then a confirm sign-up
email will be sent to the user with a link to click and this method will return the user data with a
`null` session. Until the user clicks this link, the email address will not be verified and a
session will not be created. After the user clicks on the link in the confirmation email, Agnost verifies
the verification token sent in the email, and if the email is verified successfully redirects the
user to the redirect URL specified when calling `signUpWithEmail` method with an `access_token` in the query
string parameter. You can use this `access_token` token to get authentication grants, namely the
user data and a new session object by calling the `getAuthGrant` method.

```js
//Sign up a new user with email and password
const { errors } = await agnost.auth.signUpWithEmail(email, password, 'https://mydomain/my-redirect');

//... after email address verified, you can get user and session data using the accessToken
const { user, session, errors } = await agnost.auth.getAuthGrant(accessToken);

//After the users are created and their email verified, the next time the users wants to sign in to their account, you can use the sign in method to authenticate them
const { user, session, errors } = await agnost.auth.signInWithEmail(email, password);
```

#### **Sign up new users with mobile phone number:**

If phone number confirmation is **enabled** in your app authentication settings then a confirmation
code SMS will be sent to the phone. Until the user validates this code by calling `verifyPhone`, the
phone number will not be verified.

```js
//Sign up a new user with mobile phonec number and password
const { errors } = await agnost.auth.signUpWithPhone(phone, password);

//Verify the phone number using code sent in SMS and and return the auth grants (e.g., session)
const { user, session, errors } = await agnost.auth.verifyPhone(phone, code);

//After the users are created and their phones numbers are verified, the next time the users wants to sign in to their account, you can use the sign in method to authenticate them
const { errors } = await agnost.auth.signInWithPhone(phone, password);
```

#### **Sign up/sign-in users with an oAuth provider:**

Signs in a user using the Oauth2 flow of the specified provider. Calling this method with the name
of the sign-in provider will redirect the user to the relevant login page of the provider. If the
provider sign-in completes successfully, Agnost directs the user to the redirect URL with an
`access_token` as a query string parameter that you can use to fetch the authentication grants (e.g.,
user and session data). Please note that you need to make a specific configuration at the provider to
retrieve the client id and client secret to use this method.

```js
//Sign in or sign up a user using Google as the oAuth provider
agnost.auth.signInWithProvider('google', 'https://mydomain/my-redirect');

//... after oAuth provider sign-in, you can get user and session data using the accessToken
const { user, session, errors } = await agnost.auth.getAuthGrant(accessToken);
```

### Realtime

The realtime module of Agnost client library allows realtime publish and subscribe (pub/sub) messaging through WebSockets. Realtime makes it possible to open a two-way interactive communication session between the user's device (e.g., browser, smartphone) and a server. With realtime, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

```js
//Join to a channel
agnost.realtime.join('chat_room');

//Leave from a channel
agnost.realtime.leave('chat_room');

//Listen to a message chat message
agnost.realtime.on('chat_message', (payload) => console.log(payload.channel, payload.message));

//Send a message to all subscribers of a chat_room channel
agnost.realtime.send('chat_room', 'chat_message', 'hello there');

//Update user data and broadcast to all subscribed channel members
agnost.realtime.update({username: 'yoda', profileImgURL: 'https://www.mycloudstorage.com/yoda.png'})

//Listen to new channel member notifications
agnost.realtime.onJoin((payload) => console.log(payload.channel, payload.message));
//Listen channel member leave notifications
agnost.realtime.onLeave((payload) => console.log(payload.channel, payload.message));
//Listen to user data updates
agnost.realtime.onUpdate((payload) => console.log(payload.channel, payload.message));

```

### RESTful Endpoints

In Agnost, you can define your app's RESTful endpoints and handler functions. Agnost uses the Node.js Express web framework [Express web framework](https://expressjs.com/) under the hood and provides your the flexibility to define your own middlewares and add them to your endpoints. When the
endpoint is called, the associated middlewares and eventuall the handler is executed. The client library
endpoints module provides the methods to make POST, PUT, GET and DELETE requests to your app
endpoints.

```js
//Make a GET request to /orders/{orderId} endpoint
//...
let orderId = '620949ee991edfba3ee644e7';
const { data, errors } = await agnost.endpoint.get(`/orders/${orderId}`);
```

```js
//Make a POST request to /wallposts/{postId}/comments endpoint
//...
let postId = '62094b43f7205e7d78082504';
const { data, errors } = await agnost.endpoint.post(`/wallposts/${postId}/comments`, {
   userId: '620949ee991edfba3ee644e7',
   comment: 'Awesome product. Would be better if you could add tagging people in comments.',
});
```

```js
//Make a DELETE request to /wallposts/{postId}/comments/{commentId} endpoint
//...
let postId = '62094b4dfcc106baba52c8ec';
let commentId = '62094b66fc475bdd5a2bfa48';
const { data, errors } = await agnost.endpoint.delete(`/wallpost/${postId}/comments/${commentId}`);
```

```js
//Make a PUT request to /users/{userId}/address
//...
let userId = '62094b734848b88ff50c2ab0';
const { data, errors } = await agnost.endpoint.put(`/users/${userId}/address`, {
   city: 'Chicago',
   street: '121 W Chestnut',
   zipcode: '60610',
   state: 'IL',
   country: 'US',
});
```

### Document storage

This module provides you a convenience method to upload files to your storage buckets.

#### **Upload a file:**

```js
//Uploads a file to the profiles-images bucket
const fileToUpload = event.target.files[0];
const result = await agnost.storage('mystorage')
   .bucket('profile-images')
   .upload(fileToUpload.name, fileToUpload);

//If you would like to have a progress indicator during file upload you can also provide a callback function
const result = await agnost.storage
   .bucket('profile-images')
   .upload(fileToUpload.name, fileToUpload, {
      onProgress: (uploaded, total, percent) =>
         console.log(`progress: ${uploaded}/${total} ${percent}`),
   });
```

## Learn more

You can use the following resources to learn more and get help

-  [Agnost Docs](https://agnost.dev/docs/intro)

## Bugs Report

Think you’ve found a bug? Please, open an issue on [GitHub repository](https://github.com/cloud-agnost/agnost-client/issues).

## Support / Feedback

For issues with, questions about, feedback for the client library, or want to see a new feature
please, reach out to our discussion forums [GitHub Discussions](https://github.com/orgs/cloud-agnost/discussions).
