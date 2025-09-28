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

- **Authorization:** `access_token`
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
  "details": [
    {
      "_id": "6514e09c8a5b72c7ac8f9a11",

      "username": "johndoe",
      "password": "j0hnDo3123",
      "fullname": "John Doe",
      "email": "johndoe@gmail.com",
      "contact_number": "09123456789",
      "address": "Test Address",
      "city": "Test City",
      "createdAt": "2025-09-28T09:30:00.123Z",
      "updatedAt": "2025-09-28T09:30:00.123Z",
      "__v": 0
    }
  ],
  "message": "User registered successfully"
}
```

### Errors

- 400 - "Username already exists".
- 422 - "missing required fields"/ "Unknown fields".

---
