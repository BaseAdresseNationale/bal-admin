import {keyBy} from 'lodash'
import epcis from '@etalab/decoupage-administratif/data/epci.json'
import departements from '@etalab/decoupage-administratif/data/departements.json'
import allCommunes from '@etalab/decoupage-administratif/data/communes.json'

const communes = allCommunes.filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))

const EPCIsIndex = keyBy(epcis, 'code')
const departementsIndex = keyBy(departements, 'code')
const communesIndex = keyBy(communes, 'code')

const codesCommunesActuelles = new Set(communes.map(c => c.code))

const codesCommunes = new Set()
for (const commune of communes) {
  codesCommunes.add(commune.code)
  const anciensCodes = commune.anciensCodes || []
  for (const ancienCode of anciensCodes) {
    codesCommunes.add(ancienCode)
  }
}

export function isCommune(codeCommune) {
  return codesCommunes.has(codeCommune)
}

export function isCommuneActuelle(codeCommune) {
  return codesCommunesActuelles.has(codeCommune)
}

export function getEPCI(codeEPCI) {
  return EPCIsIndex[codeEPCI]
}

export function getDepartement(codeDepartement) {
  return departementsIndex[codeDepartement]
}

export function getCommune(codeCommune) {
  return communesIndex[codeCommune]
}
