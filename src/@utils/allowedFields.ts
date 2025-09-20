const createUserFields = [
  "username",
  "password",
  "fullname",
  "email",
  "contact_number",
  "address",
  "city",
];

const updateUserFields = ["contact_number", "address", "city"];

const createServiceFields = [
  "service_name",
  "service_price",
  "description",
  "duration",
];

const createTimeslotFields = ["start_time", "end_time"];

const createReservationFields = [
  "user",
  "services",
  "timeslot",
  "payment_type",
  "status",
  "amount",
  "reservation_date",
];
export {
  createUserFields,
  updateUserFields,
  createServiceFields,
  createTimeslotFields,
  createReservationFields,
};
