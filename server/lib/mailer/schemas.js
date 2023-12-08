const { validEmail } = require("../../utils/payload");

const mailSchema = {
  firstName: { isRequired: false, type: "string" },
  lastName: { isRequired: false, type: "string" },
  email: { valid: validEmail, isRequired: true, type: "string" },
  message: { isRequired: true, type: "string" },
  subject: { isRequired: true, type: "string" },
  reCaptchaToken: { isRequired: true, type: "string" },
};

module.exports = {
  mailSchema,
};
