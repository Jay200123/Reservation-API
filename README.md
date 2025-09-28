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
