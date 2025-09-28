# Reservation-API

Created a Reservation API using node js &amp; typescript

## Installation

```bash
git clone https://github.com/Jay200123/Reservation-API.git

cd Reservation-API

npm install

npm run dev
```

---

### Authorization

All requests requires an `Authorization` header.

- **Basic Authentication**
  Provide a base64-encoded username:password in the `Authorization` header.

- **JWT Authentication**
  Use a valid jwt `access_token` & `refresh_token` obtained after successful login.

- **Role based Authentication**
  Some API's are restricted to specific users (e.g. `admin`, `user`)

---

## 🐳 Docker Setup

This project uses **Docker Compose** for containerization.

### Build & Start Services

```bash
docker compose up -d --build

docker compose logs -f

docker compose down

```

**docker compose up -d --build**  
Builds fresh images (using the Dockerfile) and starts new containers in **detached mode** (running in the background).

**docker compose logs -f**

- Shows the logs from all running containers.
- `-f` (follow) keeps streaming new log output in real time (similar to `tail -f`).
- Useful for debugging, especially if you want to watch your app or database logs as they happen.

**docker compose down**

- Stops and removes all containers, networks, and volumes created by `docker compose up`.
- Use this when you want to **cleanly shut down** your application.
- Unlike `docker compose stop`, it also removes the default network, so the environment resets fully.

---

## AUTH API

### Register User API

**Method:** `POST`

**Endpoint:**
`/api/v1/register`

**Headers**

- **Authorization:** `Basic`
- **Content-type:** `application/json`

**body**

```json
{
  "username": "johndoe",
  "password": "j0hnDo3123",
  "fullname": "John Doe",
  "email": "johndoe@gmail.com",
  "contact_number": "09123456789",
  "address": "Test Address",
  "city": "Test City"
}
```

**response**

```json
{
  "status": 201,
  "details": {
    "0": {
      "username": "johndoe",
      "password": "$2b$10$DupMmHPWD7Gczmux5LU1vO58xhvf7Cd93cEXOp6Jh4z.CvpTgR7NC",
      "status": "PENDING",
      "role": "USER",
      "_id": "68d8cbbd83295b3feb2c77d6",
      "createdAt": "2025-09-28T05:46:37.266Z",
      "updatedAt": "2025-09-28T05:46:37.266Z",
      "__v": 0
    },
    "details": {
      "0": {
        "user": "68d8cbbd83295b3feb2c77d6",
        "fullname": "John Doe",
        "email": "johndoe@gmail.com",
        "contact_number": "0923456789",
        "address": "Test Address",
        "city": "Test City",
        "_id": "68d8cbbd83295b3feb2c77d8",
        "createdAt": "2025-09-28T05:46:37.307Z",
        "updatedAt": "2025-09-28T05:46:37.307Z",
        "__v": 0
      }
    }
  },
  "message": "User registered successfully"
}
```

### Errors

- 400 - "Username already exists".
- 422 - "missing required fields"/ "Unknown fields".

---

### Login API

**Method:** `POST`

**Endpoint:**
`/api/v1/login`

**Headers**

- **Authorization:** `Basic`
- **Content-type:** `application/json`

**body**

```json
{
  "username": "johndoe",
  "password": "j0hnDo3123"
}
```

**response**

```json
{
  "status": 200,
  "details": {
    "user": {
      "_id": "68d8cbbd83295b3feb2c77d6",
      "username": "johndoe",
      "password": "$2b$10$DupMmHPWD7Gczmux5LU1vO58xhvf7Cd93cEXOp6Jh4z.CvpTgR7NC",
      "status": "PENDING",
      "role": "USER",
      "createdAt": "2025-09-28T05:46:37.266Z",
      "updatedAt": "2025-09-28T05:46:37.266Z",
      "__v": 0
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4ZDhjYmJkODMyOTViM2ZlYjJjNzdkNiIsInVzZXJuYW1lIjoiam9obmRvZSIsInBhc3N3b3JkIjoiJDJiJDEwJER1cE1tSFBXRDdHY3ptdXg1TFUxdk81OHhodmY3Q2Q5M2NFWE9wNkpoNHouQ3ZwVGdSN05DIiwic3RhdHVzIjoiUEVORElORyIsInJvbGUiOiJVU0VSIiwiY3JlYXRlZEF0IjoiMjAyNS0wOS0yOFQwNTo0NjozNy4yNjZaIiwidXBkYXRlZEF0IjoiMjAyNS0wOS0yOFQwNTo0NjozNy4yNjZaIn0sImlhdCI6MTc1OTAzODQ0OSwiZXhwIjoxNzU5MDQyMDQ5fQ.dufgiFqpx05Xrfd1OXBFtaVJHR6f2PrNgXqpzHlzokY",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4ZDhjYmJkODMyOTViM2ZlYjJjNzdkNiIsInVzZXJuYW1lIjoiam9obmRvZSIsInBhc3N3b3JkIjoiJDJiJDEwJER1cE1tSFBXRDdHY3ptdXg1TFUxdk81OHhodmY3Q2Q5M2NFWE9wNkpoNHouQ3ZwVGdSN05DIiwic3RhdHVzIjoiUEVORElORyIsInJvbGUiOiJVU0VSIiwiY3JlYXRlZEF0IjoiMjAyNS0wOS0yOFQwNTo0NjozNy4yNjZaIiwidXBkYXRlZEF0IjoiMjAyNS0wOS0yOFQwNTo0NjozNy4yNjZaIn0sImlhdCI6MTc1OTAzODQ0OSwiZXhwIjoxNzYxNjMwNDQ5fQ.9Oja14MhBRcotZeDvQbgDl0INaf3aGjusESHVHHBpn0"
  },
  "message": "User logged in Successfully."
}
```

### Errors

- 400 - "Invalid email or password".
- 422 - "missing required fields"/ "Unknown fields".
- 401 - "Invalid Request".

---

### Refresh Token API

**Method:** `GET`

**Endpoint:**
`/api/v1/refresh`

**Headers**

- **Authorization:** `refresh_token`
- **Content-type:** `application/json`

**response**

```json
{
  "status": 200,
  "details": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4ZDhjYmJkODMyOTViM2ZlYjJjNzdkNiIsInVzZXJuYW1lIjoiam9obmRvZSIsInBhc3N3b3JkIjoiJDJiJDEwJER1cE1tSFBXRDdHY3ptdXg1TFUxdk81OHhodmY3Q2Q5M2NFWE9wNkpoNHouQ3ZwVGdSN05DIiwic3RhdHVzIjoiUEVORElORyIsInJvbGUiOiJVU0VSIiwiY3JlYXRlZEF0IjoiMjAyNS0wOS0yOFQwNTo0NjozNy4yNjZaIiwidXBkYXRlZEF0IjoiMjAyNS0wOS0yOFQwNTo0NjozNy4yNjZaIn0sImlhdCI6MTc1OTAzODc4NCwiZXhwIjoxNzU5MDQyMzg0fQ.75GnXZPTlGMyU3mQGNU0LJPeW8r_nlmAdYw7u-WjbUg",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4ZDhjYmJkODMyOTViM2ZlYjJjNzdkNiIsInVzZXJuYW1lIjoiam9obmRvZSIsInBhc3N3b3JkIjoiJDJiJDEwJER1cE1tSFBXRDdHY3ptdXg1TFUxdk81OHhodmY3Q2Q5M2NFWE9wNkpoNHouQ3ZwVGdSN05DIiwic3RhdHVzIjoiUEVORElORyIsInJvbGUiOiJVU0VSIiwiY3JlYXRlZEF0IjoiMjAyNS0wOS0yOFQwNTo0NjozNy4yNjZaIiwidXBkYXRlZEF0IjoiMjAyNS0wOS0yOFQwNTo0NjozNy4yNjZaIn0sImlhdCI6MTc1OTAzODc4NCwiZXhwIjoxNzYxNjMwNzg0fQ.6DnIZ3pk4_1vaBR6QRkTDyrvJIc5JR_Tf_8r1224hzI"
  },
  "message": "Success"
}
```

### Errors

- 400 - "Invalid Request".
- 401 - "Unauthorized".
- 403 - "Forbidden"

---

### Logout API

**Method:** `POST`

**Endpoint:**
`/api/v1/logout`

**Headers**

- **Authorization:** `access_token`
- **Content-type:** `application/json`

**response**

```json
{
  "status": 200,
  "details": [],
  "message": "Logout successfully"
}
```

### Errors

- 400 - "Invalid Request".
- 401 - "Unauthorized".
- 403 - "Forbidden"

---

## USERS API

### GET ALL USERS API

**Method:** `GET`

**Endpoint:**
`/api/v1/users`

**Headers**

- **Authorization:** `access_token`
- **Content-type:** `application/json`

**response**

```json
{
  "status": 200,
  "details": [
    {
      "_id": "68bfbe00ec958d03b007fe13",
      "user": {
        "_id": "68bfbe00ec958d03b007fe11",
        "username": "john123",
        "password": "$2b$10$2lsL62zMfjGP1PwXw.oVF.l3AmnJjrR2QSyLSAN5wm2ZGraCfrP4y",
        "createdAt": "2025-09-09T05:41:20.681Z",
        "updatedAt": "2025-09-16T09:39:45.506Z",
        "__v": 0
      },
      "fullname": "John Doe",
      "email": "john.doe@gmail.com",
      "contact_number": "09123456789",
      "address": "New Orleans Washington",
      "city": "Chicago",
      "createdAt": "2025-09-09T05:41:20.733Z",
      "updatedAt": "2025-09-09T05:41:20.733Z",
      "__v": 0
    },
    {
      "_id": "68c92931b00d0f36a921e688",
      "user": {
        "_id": "68c92931b00d0f36a921e686",
        "username": "jay123",
        "password": "$2b$10$T.bmnz6s4MeBtXKIVy5U6u12V6WBKYriK9SxUSBMPVHJwQ7OGR5mO",
        "status": "PENDING",
        "role": "USER",
        "createdAt": "2025-09-16T09:09:05.451Z",
        "updatedAt": "2025-09-16T09:09:05.451Z",
        "__v": 0
      },
      "fullname": "Renyel Jay Sioc",
      "email": "renyeljay.sioc@yahoo.com",
      "contact_number": "09308650272",
      "address": "Block 156 Lot 17 Central Bicutan Arago Street",
      "city": "Taguig City",
      "createdAt": "2025-09-16T09:09:05.517Z",
      "updatedAt": "2025-09-16T09:09:05.517Z",
      "__v": 0
    },
    {
      "_id": "68d10ef0bd04042bdaee1031",
      "user": {
        "_id": "68d10ef0bd04042bdaee102f",
        "username": "admin",
        "password": "$2b$10$MnZmRCSDoZToBPCNvVzvQe3csHsqh5aLOBlPA07PU7/8mCpxfucpC",
        "status": "PENDING",
        "role": "ADMIN",
        "createdAt": "2025-09-22T08:55:12.007Z",
        "updatedAt": "2025-09-22T08:55:12.007Z",
        "__v": 0
      },
      "fullname": "Renyel Jay Sioc",
      "email": "jayAdmin@yahoo.com",
      "contact_number": "09505798533",
      "address": "Block 156 Lot 17 Central Bicutan Arago Street",
      "city": "Taguig City",
      "createdAt": "2025-09-22T08:55:12.050Z",
      "updatedAt": "2025-09-22T08:55:12.050Z",
      "__v": 0
    },
    {
      "_id": "68d8cbbd83295b3feb2c77d8",
      "user": {
        "_id": "68d8cbbd83295b3feb2c77d6",
        "username": "johndoe",
        "password": "$2b$10$DupMmHPWD7Gczmux5LU1vO58xhvf7Cd93cEXOp6Jh4z.CvpTgR7NC",
        "status": "PENDING",
        "role": "USER",
        "createdAt": "2025-09-28T05:46:37.266Z",
        "updatedAt": "2025-09-28T05:46:37.266Z",
        "__v": 0
      },
      "fullname": "John Doe",
      "email": "johndoe@gmail.com",
      "contact_number": "0923456789",
      "address": "Test Address",
      "city": "Test City",
      "createdAt": "2025-09-28T05:46:37.307Z",
      "updatedAt": "2025-09-28T05:46:37.307Z",
      "__v": 0
    }
  ],
  "message": "Success"
}
```

### Errors

- 404 - "Users not found".
- 401 - "Unauthorized".
- 403 - "Forbidden"

---

### GET USER BY ID API

**Method:** `GET`

**Endpoint:**
`/api/v1/user/:id`

**parameters**

- id - unique user ID.

**Headers**

- **Authorization:** `access_token`
- **Content-type:** `application/json`

**response**

```json
{
  "status": 200,
  "details": {
    "_id": "68bfbe00ec958d03b007fe13",
    "user": {
      "_id": "68bfbe00ec958d03b007fe11",
      "username": "john123",
      "password": "$2b$10$2lsL62zMfjGP1PwXw.oVF.l3AmnJjrR2QSyLSAN5wm2ZGraCfrP4y",
      "createdAt": "2025-09-09T05:41:20.681Z",
      "updatedAt": "2025-09-16T09:39:45.506Z",
      "__v": 0
    },
    "fullname": "John Doe",
    "email": "john.doe@gmail.com",
    "contact_number": "09123456789",
    "address": "New Orleans Washington",
    "city": "Chicago",
    "createdAt": "2025-09-09T05:41:20.733Z",
    "updatedAt": "2025-09-09T05:41:20.733Z",
    "__v": 0
  },
  "message": "Success"
}
```

### Errors

- 404 - "User not found".
- 401 - "Unauthorized".
- 403 - "Forbidden"

---

### UPDATE USER BY ID API

**Method:** `PATCH`

**Endpoint:**
`/api/v1/user/edit/:id`

**Parameters**

- id - unique user ID.

**Headers**

- **Authorization:** `access_token`
- **Content-type:** `application/json`

**body**

```json
{
  "contact_number": "091124671235"
}
```

**response**

```json
{
  "status": 200,
  "details": {
    "_id": "68bfbe00ec958d03b007fe13",
    "user": "68bfbe00ec958d03b007fe11",
    "fullname": "John Doe",
    "email": "john.doe@gmail.com",
    "contact_number": "091124671235",
    "address": "New Orleans Washington",
    "city": "Chicago",
    "createdAt": "2025-09-09T05:41:20.733Z",
    "updatedAt": "2025-09-28T06:17:14.470Z",
    "__v": 0
  },
  "message": "Success"
}
```

### Errors

- 404 - "User not found".
- 401 - "Unauthorized".
- 403 - "Forbidden"

---

## SERVICES API

### GET ALL SERVICES API

**Method:** `GET`

**Endpoint:**
`/api/v1/services`

**Headers**

- **Authorization:** `access_token`
- **Content-type:** `application/json`

**response**

```json
{
  "status": 200,
  "details": [
    {
      "_id": "68ca7274cd30a085301cac7f",
      "service_name": "Service 1",
      "service_price": 150,
      "description": "Lorem Ipsum",
      "duration": "1 hour",
      "createdAt": "2025-09-17T08:33:56.957Z",
      "updatedAt": "2025-09-17T08:33:56.957Z",
      "__v": 0
    },
    {
      "_id": "68ca72d177828cebe1a8ff00",
      "service_name": "Service updated 1",
      "service_price": 250,
      "description": "Lorem Ipsum",
      "duration": "1 hour",
      "createdAt": "2025-09-17T08:35:29.434Z",
      "updatedAt": "2025-09-17T08:35:29.434Z",
      "__v": 0
    }
  ],
  "message": "Success"
}
```

### Errors

- 404 - "Services not found".
- 401 - "Unauthorized".
- 403 - "Forbidden"

### GET SERVICE BY API

**Method:** `GET`

**Endpoint:**
`/api/v1/service/:id`

**Parameters:**

- id - unique service ID.

**Headers**

- **Authorization:** `access_token`
- **Content-type:** `application/json`

**response**

```json
{
  "status": 200,
  "details": {
    "_id": "68ca7274cd30a085301cac7f",
    "service_name": "Service 1",
    "service_price": 150,
    "description": "Lorem Ipsum",
    "duration": "1 hour",
    "createdAt": "2025-09-17T08:33:56.957Z",
    "updatedAt": "2025-09-17T08:33:56.957Z",
    "__v": 0
  },
  "message": "Success"
}
```

### Errors

- 404 - "Services not found".
- 401 - "Unauthorized".
- 403 - "Forbidden".
- 400 - "Invalid Request/Missing service ID".

### CREATE SERVICE API

**Method:** `POST`

**Endpoint:**
`/api/v1/services`

**Body**

```json
{
  "service_name": "Service 3",
  "service_price": 150.0,
  "duration": "1 hour",
  "description": "Lorem Ipsum"
}
```

**Response**

```json
{
  "status": 201,
  "details": {
    "service_name": "Service 3",
    "service_price": 150,
    "description": "Lorem Ipsum",
    "duration": "1 hour",
    "_id": "68d9576a1af5b6b59cda765e",
    "createdAt": "2025-09-28T15:42:34.810Z",
    "updatedAt": "2025-09-28T15:42:34.810Z",
    "__v": 0
  },
  "message": "New service created successfully."
}
```

### Errors

- 401 - "Unauthorized".
- 403 - "Forbidden".
- 422 - "Missing required fields/Unknown fields".

### EDIT SERVICE API

**Method:** `PATCH`

**Endpoint:**
`/api/v1/edit/service/:id`

**Parameters**

- id - unique service ID.

**Body**

```json
{
  "service_name": "Updated Service 3",
  "service_price": 150.0,
  "duration": "1 hour",
  "description": "Lorem Ipsum Dolor Es Qui"
}
```

**Response**

```json
{
  "status": 200,
  "details": {
    "_id": "68ca72d177828cebe1a8ff00",
    "service_name": "Updated Service 3",
    "service_price": 150,
    "description": "Lorem Ipsum Dolor Es Qui",
    "duration": "1 hour",
    "createdAt": "2025-09-17T08:35:29.434Z",
    "updatedAt": "2025-09-17T08:35:29.434Z",
    "__v": 0
  },
  "message": "Service updated successfully."
}
```

### Errors

- 401 - "Unauthorized".
- 403 - "Forbidden".
- 422 - "Missing required fields/Unknown fields".
- 400 - "Invalid Request/Missing service ID".

---
