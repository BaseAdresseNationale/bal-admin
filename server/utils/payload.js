const {pick} = require('lodash')
const {ObjectId} = require('mongodb')

class ValidationError extends Error {
  constructor(validationDetails) {
    super('Invalid payload')
    this.validation = validationDetails
  }
}

function addError(errors, name, label) {
  if (errors[name]) {
    return errors[name].push(label)
  }

  errors[name] = [label]
  return errors
}

function isValidValueType(value, type) {
  if (Array.isArray(value)) {
    return type === 'array'
  }

  return typeof value === type
}

function getFilteredPayload(payload, schema) {
  const acceptableKeys = Object.keys(schema)
  return pick(payload, acceptableKeys)
}

function validSchema(payload, schema) {
  const error = {}

  const filteredPayload = pick(payload, Object.keys(schema))

  Object.keys(schema).forEach(key => {
    if (schema[key].isRequired && filteredPayload[key] === undefined) {
      addError(error, key, `Le champ ${key} est obligatoire`)
    } else if (filteredPayload[key] && !isValidValueType(filteredPayload[key], schema[key].type)) {
      addError(error, key, `Le champ ${key} doit être de type "${schema[key].type}"`)
    } else if (filteredPayload[key] && schema[key].valid) {
      schema[key].valid(filteredPayload[key], error)
    }
  })

  return {value: filteredPayload, error}
}

function validPayload(payload, schema) {
  const {error, value} = validSchema(payload, schema)

  if (Object.keys(error).length > 0) {
    throw new ValidationError(error)
  }

  return value
}

function validNom(nom, error) {
  if (nom.length === 0) {
    addError(error, 'nom', 'Le nom est trop court (1 caractère minimum)')
  } else if (nom.length >= 200) {
    addError(error, 'nom', 'Le nom est trop long (200 caractères maximum)')
  }
}

function checkValidEmail(email) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email)
}

function validEmail(email, error) {
  if (!checkValidEmail(email)) {
    addError(error, 'email', `L’adresse email ${email} est invalide`)
  }
}

function validDate(date, error) {
  const regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

  if (!regex.test(date)) {
    addError(error, 'date', 'La date doit être au format YYYY-MM-DD')
  }
}

function validTime(time, error) {
  const regex = /^[0-9]{2}:[0-9]{2}$/

  if (!regex.test(time)) {
    addError(error, 'time', 'L’heure doit être au format HH:MM')
  }
}

function validateObjectId(id) {
  const isValid = ObjectId.isValid(id)

  if (!isValid) {
    throw new ValidationError({id: ['L’identifiant est invalide']})
  }

  return id
}

module.exports = {
  addError,
  validSchema,
  getFilteredPayload,
  validPayload,
  validNom,
  validEmail,
  ValidationError,
  validDate,
  validTime,
  validateObjectId
}
