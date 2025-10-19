const createUserFields = [
  "username",
  "password",
  "fullname",
  "email",
  "contact_number",
  "address",
  "city",
  "image",
];

const updateUserFields = ["contact_number", "address", "city", "image"];

const createServiceFields = [
  "service_name",
  "service_price",
  "description",
  "duration",
  "image",
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

const rescheduleFields = ["timeslot", "reservation_date", "reason"];

export {
  createUserFields,
  updateUserFields,
  createServiceFields,
  createTimeslotFields,
  createReservationFields,
  rescheduleFields,
};
