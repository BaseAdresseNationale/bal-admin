const { validEmail } = require("../../utils/payload");

const mailSchema = {
  firstName: { isRequired: false, type: "string" },
  lastName: { isRequired: false, type: "string" },
  email: { valid: validEmail, isRequired: true, type: "string" },
  message: { isRequired: true, type: "string" },
  subject: { isRequired: true, type: "string" },
  captchaToken: { isRequired: true, type: "string" },
};

const signalementOtherMailSchema = {
  ...mailSchema,
  city: { isRequired: true, type: "string" },
}

const signalementMissingNumberMailSchema = {
  ...mailSchema,
  city: { isRequired: true, type: "string" },
  number: { isRequired: true, type: "string" },
  street: { isRequired: true, type: "string" },
  message: { isRequired: false, type: "string" },
}

const signalementMissingStreetMailSchema = {
  ...mailSchema,
  city: { isRequired: true, type: "string" },
  street: { isRequired: true, type: "string" },
  message: { isRequired: false, type: "string" },
}

module.exports = {
  mailSchema,
  signalementOtherMailSchema,
  signalementMissingNumberMailSchema,
  signalementMissingStreetMailSchema
};
