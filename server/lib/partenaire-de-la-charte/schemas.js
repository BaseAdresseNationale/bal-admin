const {validEmail, validNom} = require('../../utils/payload')

const createBaseSchema = {
  name: {valid: validNom, isRequired: true, type: 'string'},
  picture: {isRequired: true, type: 'string'},
  contactFirstName: {isRequired: true, type: 'string'},
  contactLastName: {isRequired: true, type: 'string'},
  contactEmail: {valid: validEmail, isRequired: true, type: 'string'},
  type: {isRequired: true, type: 'string'},
  charteURL: {isRequired: false, type: 'string'},
  link: {isRequired: false, type: 'string'},
  codeDepartement: {isRequired: false, type: 'array'},
  services: {isRequired: false, type: 'array'},
  dataGouvOrganizationId: {isRequired: false, type: 'string'},
}

const createCommuneSchema = {
  ...createBaseSchema,
  codeRegion: {isRequired: true, type: 'string'},
  codeCommune: {isRequired: true, type: 'string'},
  balURL: {isRequired: false, type: 'string'},
  testimonyURL: {isRequired: false, type: 'string'},
}

const createOrganismeSchema = {
  ...createBaseSchema,
  organismeType: {isRequired: true, type: 'string'},
  infos: {isRequired: false, type: 'string'},
  perimeter: {isRequired: false, type: 'string'},
  testimonyURL: {isRequired: false, type: 'string'},
}

const createEntrepriseSchema = {
  ...createBaseSchema,
  isPerimeterFrance: {isRequired: false, type: 'boolean'},
  infos: {isRequired: false, type: 'string'},
  perimeter: {isRequired: false, type: 'string'},
}

module.exports = {
  createCommuneSchema,
  createOrganismeSchema,
  createEntrepriseSchema
}
