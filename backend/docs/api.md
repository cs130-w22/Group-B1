# API Documentation

## Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | OK                    |
| 400         | Bad Request           |
| 500         | Internal Server Error |

## Roommate

Endpoints

```
GET  /roommate
POST /roommate
PUT  /roommate
```

Retrieve roommate(s)

```
GET /roommate
```

Optionally include an `username` query parameter to retrieve a single roommate.

Create a roommate

```
POST /roommate
```

Include a `Roommate` object inside the request body.

Update a roommate

```
PUT /roommate
```

Include a `Roommate` object inside the request body.
