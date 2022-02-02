# API Documentation

## Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | OK                    |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 404         | Not Found             |
| 500         | Internal Server Error |

## Authorization

Some routes require an authorization header. The request header should be of the form:

```
{ authorization: "Bearer {accessToken}" }
```

These access tokens do expire. Their expiration times are determined by the value of `TOKEN_EXPIRESIN` set inside the `.env` file.

## Roommate

A roommate is of the form

```
{
  username: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    area: string;
    bio: string;
    hobbies: string[];
    personality: string[];
    additionalInfo: string;
  };
}
```

Please refer to the `shared` folder for more details on the `Roommate` interface.

### Endpoints

```
GET  /roommate
POST /roommate
POST /roommate/login
PUT  /roommate
```

### Retrieve roommate(s)

```
GET /roommate
```

Include the authorization header. Optionally include a `username` query parameter to retrieve a single roommate.

Example Request:

```
curl --location --request GET 'http://localhost:3000/roommate/' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJldzEiLCJzYWx0IjoiaFRpajBPa3FENElXUDNPOU9ta2xTZz09IiwiaWF0IjoxNjQzNjYxNjA0LCJleHAiOjE2NDM2NjM0MDR9.r4tNmIe4fo9C9YTucto3Mab3gcJ9MGu5AevKUoPCzyk'
```

Example Response:

```
{
    "data": [
        {
            "firstName": "AndrewNewName",
            "lastName": "Changy",
            "email": "andrewwww@gmail.com",
            "area": "Los Angeles",
            "bio": "UCLA grad",
            "hobbies": [],
            "personality": [],
            "additionalInfo": "Looking for 2 roommates"
        }
    ]
}
```

Example Request (querying for 1 roommate):

```
curl --location --request GET 'http://localhost:3000/roommate/?username=Andrew1' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJldzEiLCJzYWx0IjoiaFRpajBPa3FENElXUDNPOU9ta2xTZz09IiwiaWF0IjoxNjQzNjYxNjA0LCJleHAiOjE2NDM2NjM0MDR9.r4tNmIe4fo9C9YTucto3Mab3gcJ9MGu5AevKUoPCzyk'
```

Example Response:

```
{
    "firstName": "AndrewNewName",
    "lastName": "Changy",
    "email": "andrewwww@gmail.com",
    "area": "Los Angeles",
    "bio": "UCLA grad",
    "hobbies": [],
    "personality": [],
    "additionalInfo": "Looking for 2 roommates"
}
```

Notice that this endpoint is returning roommate _profiles_. (Usernames and passwords are not included.)

### Create a roommate

```
POST /roommate
```

Include a `Roommate` object inside the request body.

Example Request

```
curl --location --request POST 'http://localhost:3000/roommate/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "Andrew1",
    "password": "Andrew1Password2",
    "profile": {
        "firstName": "Andrew",
        "lastName": "Changy",
        "email": "andrewwww@gmail.com",
        "area": "Los Angeles",
        "bio": "UCLA grad",
        "hobbies": [],
        "personality": [],
        "additionalInfo": "Looking for 2 roommates"
    }
}'
```

Example Response

```
{
    "firstName": "Andrew",
    "lastName": "Changy",
    "email": "andrewwww@gmail.com",
    "area": "Los Angeles",
    "bio": "UCLA grad",
    "hobbies": [],
    "personality": [],
    "additionalInfo": "Looking for 2 roommates"
}
```

### Login a roommate

```
POST /roommate/login
```

This is used to retrieve the access token, which is needed for protected routes. This access token expires, so the user will need to be prompted to login again.

Include the `username` and `password` in the request body.

Example Request:

```
curl --location --request POST 'http://localhost:3000/roommate/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "Andrew1",
    "password": "Andrew1Password2"
}'
```

Example Response:

```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJldzEiLCJzYWx0IjoiaFRpajBPa3FENElXUDNPOU9ta2xTZz09IiwiaWF0IjoxNjQzNjYxNjA0LCJleHAiOjE2NDM2NjM0MDR9.r4tNmIe4fo9C9YTucto3Mab3gcJ9MGu5AevKUoPCzyk"
}
```

### Update a roommate

```
PUT /roommate
```

Include the `username` as a query parameter. Include a `RoommateProfile` object inside the request body, along with the authorization header. Note that that we are not allowing the username or password to be updated using this endpoint.

Example Request:

```
curl --location --request PUT 'http://localhost:3000/roommate/?username=Andrew1' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJldzEiLCJzYWx0IjoiMFE0SU84cWtoa0wyQUluZWU1OFJyZz09IiwiaWF0IjoxNjQzNzQwNjg2LCJleHAiOjE2NDM3NDI0ODZ9.V0PXNjRxe2Su-g7mzoddyYy-icVIPI0MfmWDvwYmVfY' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "AndrewName",
    "lastName": "Changy",
    "email": "andrewwww@gmail.com",
    "area": "Los Angeles",
    "bio": "UCLA graduate",
    "hobbies": [],
    "personality": [],
    "additionalInfo": "Looking for 2 roommates"
}'
```

Example Response:

```
{
    "firstName": "AndrewName",
    "lastName": "Changy",
    "email": "andrewwww@gmail.com",
    "area": "Los Angeles",
    "bio": "UCLA graduate",
    "hobbies": [],
    "personality": [],
    "additionalInfo": "Looking for 2 roommates"
}
```

## Example workflow

Please refer to `src/tests/e2e-tests/RoommatesApi.test.ts` to see a full workflow in which a roommate is created, logged in, and updated.
