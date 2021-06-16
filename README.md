
The main features are:

- Complete guidance on the UI for the ordering process.
- 2 different roles (Role Based Access Control):
  - `Manager`: Can process the orders received in Real time, view a history, add new restaurants and new meals. Can change the order status.
  - `User`: Can order from the restaurants. Also view a orders history.
- Use of `state-machine` to validate transitions of order status.
- Follow React and Node.js best practices.

## Quick Start

```javascript
// Install dependencies for server & client
npm install && npm run client-install

// Run client & server with concurrently
npm run dev

// Server runs on http://localhost:5000 and client on http://localhost:3000
```

## MERNJS stack

- [React](https://reactjs.org) and [React Router](https://reacttraining.com/react-router/) for frontend.
- [Express](http://expressjs.com/) and [Node](https://nodejs.org/en/) for the backend.
- [MongoDB](https://www.mongodb.com/) for the database.
- [Redux](https://redux.js.org/basics/usagewithreact) for state management between React components.

## Configuration

Make sure to add your own `MONGOURI` from your database in `config/keys.js`.

```javascript
module.exports = {
  mongoURI: "YOUR_MONGO_URI_HERE",
  secretOrKey: "secret"
};
```
