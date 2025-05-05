import { keyBy } from "lodash";
import epcis from "@etalab/decoupage-administratif/data/epci.json";
import departements from "@etalab/decoupage-administratif/data/departements.json";
import allCommunes from "@etalab/decoupage-administratif/data/communes.json";
import {
  CommuneCOG,
  CommuneTypeEnum,
  DepartementCOG,
  EpciCOG,
} from "types/cog";

const communes = (allCommunes as CommuneCOG[]).filter((c) =>
  [
    CommuneTypeEnum.COMMUNE_ACTUELLE,
    CommuneTypeEnum.ARRONDISSEMENT_MUNICIPAL,
  ].includes(c.type)
);

const EPCIsIndex: Record<string, EpciCOG> = keyBy(epcis, "code");
const departementsIndex: Record<string, DepartementCOG> = keyBy(
  departements,
  "code"
);
const communesIndex: Record<string, CommuneCOG> = keyBy(communes, "code");

const codesCommunesActuelles = new Set(communes.map((c) => c.code));

const codesCommunes = new Set();
for (const commune of communes) {
  codesCommunes.add(commune.code);
  const anciensCodes = commune.anciensCodes || [];
  for (const ancienCode of anciensCodes) {
    codesCommunes.add(ancienCode);
  }
}

export function isCommune(codeCommune: string): boolean {
  return codesCommunes.has(codeCommune);
}

export function isCommuneActuelle(codeCommune: string): boolean {
  return codesCommunesActuelles.has(codeCommune);
}

export function getEPCI(codeEPCI: string): EpciCOG {
  return EPCIsIndex[codeEPCI];
}

export function getDepartement(codeDepartement: string): DepartementCOG {
  return departementsIndex[codeDepartement];
}

export function getCommune(codeCommune: string): CommuneCOG {
  return communesIndex[codeCommune];
}
