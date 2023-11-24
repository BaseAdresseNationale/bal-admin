const fs = require('fs')
const path = require('path')
const mongoClient = require('../utils/mongo-client')
const PartenaireDeLaCharteService = require('../lib/partenaire-de-la-charte/service')
const communes = require('./data/communes.json')
const epcis = require('./data/epci.json')
const companies = require('./data/companies.json')

function base64Encode(file) {
  const bitmap = fs.readFileSync(file)
  return require('buffer').Buffer.from(bitmap).toString('base64')
}

async function createPartenaireDeLaCharte({height, width, ...partenaireDeLaCharte}, type) {
  const imagePath = path.join(BASE_IMAGE_PATH, partenaireDeLaCharte.picture)
  const imageExt = imagePath.split('.').pop()
  const base64Image = base64Encode(imagePath)
  const signatureDate = new Date(partenaireDeLaCharte.signatureDate)

  await PartenaireDeLaCharteService.createOne({
    ...partenaireDeLaCharte,
    type,
    organismeType: type === 'organisme' ? 'epci' : undefined,
    picture: `data:image/${imageExt};base64,${base64Image}`,
    signatureDate
  }, {noValidation: true})
}

const BASE_IMAGE_PATH = path.join(__dirname, 'data')

async function main() {
  await mongoClient.connect()
  for await (const commune of communes) {
    await createPartenaireDeLaCharte(commune, 'commune')
  }

  for await (const epci of epcis) {
    await createPartenaireDeLaCharte(epci, 'organisme')
  }

  for await (const company of companies) {
    await createPartenaireDeLaCharte(company, 'entreprise')
  }

  await mongoClient.disconnect()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
}).then(() => {
  process.exit(0)
})
