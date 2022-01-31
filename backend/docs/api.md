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

Include the authorization header. Optionally include an `username` query parameter to retrieve a single roommate.

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

This is used to retrieve the access token, which is needed for protected routes.

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

Include a `Roommate` object inside the request body, along with the authorization header.

Example Request:

```
curl --location --request PUT 'http://localhost:3000/roommate/' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJldzEiLCJzYWx0IjoiaFRpajBPa3FENElXUDNPOU9ta2xTZz09IiwiaWF0IjoxNjQzNjYxNjA0LCJleHAiOjE2NDM2NjM0MDR9.r4tNmIe4fo9C9YTucto3Mab3gcJ9MGu5AevKUoPCzyk' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "Andrew1",
    "password": "Andrew1Password2",
    "profile": {
        "firstName": "AndrewNewName",
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
