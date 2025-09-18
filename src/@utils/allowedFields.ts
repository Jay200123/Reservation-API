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

export {
  createUserFields,
  updateUserFields,
  createServiceFields,
  createTimeslotFields,
};
