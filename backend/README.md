# Backend

## Setup

If you haven't installed Node, download and install it from this link:
https://nodejs.org/en/download/. After installing Node, run

```
npm install
```

You will also need to install MongoDB. Please refer to the documentation here: https://docs.mongodb.com/manual/administration/install-community/.

You will need to include the following environment variables in your `.env` file (with the values replaced as needed):

```
DB_URL_DEV=mongodb://localhost:27017/ZoomieRoomies
DB_URL_TEST=mongodb://localhost:27017/ZoomieRoomiesTest
JWT_SECRET="secret"
TOKEN_EXPIRESIN=1800
```

## Running backend

You will need to run MongoDB before starting the server. On Mac, this command could look like:

```
brew services start mongodb-community@5.0
```

To start the server, run

```
npm run start
```

Go to http://localhost:3000/. You should see a "Hello World!" message popping up. To stop the app, type Ctrl+C in the terminal.

To confirm for certain that your setup is correct, you can run the test cases, which should all pass (see section on testing).

## Linting and Formatting

Lint

```
npm run lint
```

Format

```
npm run format
```

## Testing

```
npm run test
```

Note that this requires MongoDB to be running.
