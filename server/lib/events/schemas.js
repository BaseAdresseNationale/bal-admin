const {validDate, validTime} = require('../../utils/payload')

const createSchema = {
  title: {isRequired: true, type: 'string'},
  subtitle: {isRequired: false, type: 'string'},
  description: {isRequired: true, type: 'string'},
  type: {isRequired: true, type: 'string'},
  target: {isRequired: true, type: 'string'},
  date: {valid: validDate, isRequired: true, type: 'string'},
  tags: {isRequired: true, type: 'array'},
  isOnlineOnly: {isRequired: true, type: 'boolean'},
  address: {isRequired: true, type: 'object'},
  href: {isRequired: false, type: 'string'},
  isSubscriptionClosed: {isRequired: true, type: 'boolean'},
  instructions: {isRequired: false, type: 'string'},
  startHour: {valid: validTime, isRequired: true, type: 'string'},
  endHour: {valid: validTime, isRequired: true, type: 'string'},
}

module.exports = {
  createSchema
}
