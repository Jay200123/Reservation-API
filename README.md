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

- **Authorization:** `Bearer access_token`
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

---
