# Reservation-API

Created a Reservation API using node js &amp; typescript

## Installation

```bash
git clone https://github.com/Jay200123/Reservation-API.git

cd Reservation-API

npm install

npm run dev
```

### Authorization

All requests requires an `Authorization` header.

- **Basic Authentication**
  Provide a base64-encoded username:password in the `Authorization` header.

- **JWT Authentication**
  Use a valid jwt `access_token` & `refresh_token` obtained after successful login.

- **Role based Authentication**
  Some API's are restricted to specific users (e.g. `admin`, `user`)
