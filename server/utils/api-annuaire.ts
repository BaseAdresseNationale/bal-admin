import { isEmail } from "class-validator";
import got from "got";
import { deburr } from "lodash";

const API_ANNUAIRE =
  process.env.API_ANNUAIRE ||
  "https://api-lannuaire.service-public.fr/api/explore/v2.1";

export async function getCommuneEmail(codeCommune: string) {
  try {
    const url = `${API_ANNUAIRE}/catalog/datasets/api-lannuaire-administration/records?where=pivot%20LIKE%20"mairie"%20AND%20code_insee_commune="${codeCommune}"`;
    const response: any = await got(url, { responseType: "json" });

    // RECUPERE LA MAIRIE PRINCIPAL
    const mairie = response.body.results.find(
      ({ nom }) => !normalize(nom).includes("deleguee")
    );

    if (!mairie.adresse_courriel || mairie.adresse_courriel === "") {
      throw new Error("L’adresse email n’est pas trouvé");
    }

    const emails = mairie.adresse_courriel.split(";");
    const email = emails.shift();

    if (isEmail(email)) {
      return email;
    }

    throw new Error(`L’adresse email " ${email} " ne peut pas être utilisée`);
  } catch (error) {
    console.log(
      `Une erreur s’est produite lors de la récupération de l’adresse email de la mairie (Code commune: ${codeCommune}).`,
      error
    );
  }
}

function normalize(str: string): string {
  return deburr(str).toLowerCase();
}