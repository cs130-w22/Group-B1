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

Please refer to the `roommate` folder for more details on the `Roommate` interface.

### Endpoints

```
GET  /roommate
POST /roommate
POST /roommate/login
PUT  /roommate

GET /roommate/areas
GET /roommate/hobbies
GET /roommate/personalities

GET /roommate/recommendations
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
        "hobbies": ["hiking"],
        "personality": ["intuitive"],
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

### Get areas list

```
GET /roommate/areas
```

Example Request:

```
curl --location --request GET 'http://localhost:3000/roommate/areas'
```

Example Response:

```
[
    "Austin",
    "Los Angeles",
    "Miami",
    "New York",
    "San Francisco",
    "Seattle"
]
```

### Get hobbies list

```
GET /roommate/hobbies
```

Example Request:

```
curl --location --request GET 'http://localhost:3000/roommate/hobbies'
```

Example Response:

```
[
    "baseball",
    "basketball",
    "cooking",
    "gaming",
    "hiking",
    "knitting",
    "reading",
    "running",
    "soccer",
    "tennis"
]
```

### Get personalities list

```
GET /roommate/personalities
```

Example Request:

```
curl --location --request GET 'http://localhost:3000/roommate/personalities'
```

Example Response:

```
[
    "introvert",
    "extrovert",
    "sensor",
    "intuitive",
    "thinker",
    "feeler",
    "judger",
    "perceiver"
]
```

### Get recommendations list

```
GET /roommate/recommendations
```

Include the `username` as a query parameter. Returned will be a list of roommate profiles of up to the 10 most similar users. The list is sorted with the most similar profile first and the least similar profile last. The profile that belongs to the queried username will not be returned in the list.

Example Request:

```
curl --location --request GET 'http://localhost:3000/roommate/recommendations?username=Andrew' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFuZHJldyIsInNhbHQiOiJIM3UwakRsdUY3RFZBRmZoS2UvU0xnPT0iLCJpYXQiOjE2NDQ0MzU3OTYsImV4cCI6MTY0NDQzNzU5Nn0.8J5JSbNh1iJykAHbIEjqWyBx2Im6i5jbA8vyXZ7I2pY'
```

Example Response:

```
[
    {
        firstName: "Isabela",
        lastName: "Smith",
        email: "Isabela@gmail.com",
        area: "Los Angeles" as Area,
        bio: "",
        hobbies: ["reading", "hiking","soccer"],
        personality: ["introvert","intuitive","thinker"],
        additionalInfo: "Looking for someone to mountain bike with on weekends!",
    },

    ...

    {
        firstName: "Carly",
        lastName: "Williams",
        email: "Carly@gmail.com",
        area: "Austin" as Area,
        bio: "",
        hobbies: ["reading", "basketball", "soccer"],
        personality: ["judger"],
        additionalInfo: "",
  }
]
```

## Example workflow

Please refer to `src/tests/e2e-tests/RoommatesApi.test.ts` to see a full workflow in which a roommate is created, logged in, and updated.
