import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

import { Alert } from "@codegouvfr/react-dsfr/Alert";
import type { BaseLocaleType } from "types/mes-adresses";
import { createHabilitation, getBaseLocale } from "@/lib/api-mes-adresses";
import { StatusInterface, computeStatus } from "@/lib/bal-status";
import { formatDate } from "@/lib/util/date";
import { getBaseLocaleIsHabilitationValid } from "@/lib/api-mes-adresses";

import CopyToClipBoard from "@/components/copy-to-clipboard";
import Button from "@codegouvfr/react-dsfr/Button";
import { validateHabilitation } from "@/lib/api-depot";

const deleteEventModale = createModal({
  id: "delete-event-modale",
  isOpenedByDefault: false,
});

const NEXT_PUBLIC_MES_ADRESSES_URL =
  process.env.NEXT_PUBLIC_MES_ADRESSES_URL ||
  "http://mes-adresses.data.gouv.fr";

const BaseLocale = () => {
  const router = useRouter();
  const { baseLocaleId } = router.query;
  const [baseLocale, setBaseLocale] = useState<BaseLocaleType>(null);
  const [isHabilitationValid, setisHabilitationValid] = useState<boolean>(null);
  const [computedStatus, setComputedStatus] = useState<StatusInterface | null>(
    null
  );

  async function calcStatus(baseLocale) {
    const habilitationValid = await getBaseLocaleIsHabilitationValid(
      baseLocale._id
    );
    const status = computeStatus(
      baseLocale.status,
      baseLocale.sync,
      habilitationValid
    );
    setComputedStatus(status);
    setisHabilitationValid(habilitationValid);
  }

  useEffect(() => {
    async function fetchBaseLocale() {
      const baseLocale = await getBaseLocale(String(baseLocaleId));
      setBaseLocale(baseLocale);
      await calcStatus(baseLocale);
    }

    void fetchBaseLocale();
  }, [baseLocaleId]);

  const createBalHabilitation = async function () {
    const habilitation = await createHabilitation(
      baseLocale.id,
      baseLocale.token
    );
    await validateHabilitation(habilitation._id);
    await calcStatus(baseLocale);
    deleteEventModale.close();
  };

  return baseLocale ? (
    <div className="fr-container">
      {baseLocale.deletedAt && (
        <Alert
          className="fr-mt-4v"
          title="Cette Base Adresse Locale a été supprimée"
          severity="error"
          description={`La Base Adresse Locale a été supprimée le ${formatDate(
            baseLocale.deletedAt
          )}`}
        />
      )}

      <div className="fr-container fr-py-12v">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-10">
            <h1>
              {baseLocale.nom} ({baseLocale.commune})
            </h1>
            <CopyToClipBoard text={baseLocale.id} title="Id" />
            {baseLocale.token && (
              <CopyToClipBoard text={baseLocale.token} title="Token" />
            )}
            <ul className="fr-tags-group">
              <li>
                <h3>Emails</h3>
              </li>

              {baseLocale.emails ? (
                baseLocale.emails.map((email) => (
                  <li key="email">
                    <p className="fr-tag">{email}</p>
                  </li>
                ))
              ) : (
                <li>
                  <p className="fr-tag">inconnu</p>
                </li>
              )}
            </ul>
            <div className="fr-my-4v">
              <Badge
                severity={computedStatus?.intent}
                noIcon
                style={{ marginRight: 5 }}
              >
                {computedStatus?.label}
              </Badge>
              {isHabilitationValid ? (
                <Badge severity="success" noIcon>
                  Habilitation Valide
                </Badge>
              ) : (
                <>
                  <Badge severity="warning" noIcon>
                    Pas d&apos;habilitation
                  </Badge>
                </>
              )}
            </div>

            <div className="fr-my-4v">
              {!isHabilitationValid && (
                <Button
                  onClick={() => {
                    deleteEventModale.open();
                  }}
                >
                  Habiliter
                </Button>
              )}
            </div>

            <ul className="fr-tags-group">
              <li>
                <p className="fr-tag">
                  Création :{" "}
                  <b className="fr-mx-1v">
                    {formatDate(baseLocale.createdAt, "PPP")}
                  </b>
                </p>
              </li>
              <li>
                <p className="fr-tag">
                  Mise à jour :{" "}
                  <b className="fr-mx-1v">
                    {formatDate(baseLocale.updatedAt, "PPP")}
                  </b>
                </p>
              </li>
              <li>
                <p className="fr-tag">
                  {baseLocale.nbNumerosCertifies} / {baseLocale.nbNumeros}{" "}
                  numéros certifiés
                </p>
              </li>
            </ul>
          </div>

          <div className="fr-col-2">
            <div className="fr-container">
              <Link
                legacyBehavior
                href={`${NEXT_PUBLIC_MES_ADRESSES_URL}/bal/${baseLocale.id}/${baseLocale.token}`}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fr-link fr-fi-arrow-right-line fr-link--icon-right"
                >
                  Consulter
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <deleteEventModale.Component title="Suppression">
        <p>Êtes-vous sûr de vouloir habilité cette BAL?</p>
        <div>
          <Button onClick={createBalHabilitation}>Habiliter</Button>
          <Button
            style={{ marginLeft: "1rem" }}
            priority="tertiary"
            onClick={() => {
              deleteEventModale.close();
            }}
          >
            Annuler
          </Button>
        </div>
      </deleteEventModale.Component>
    </div>
  ) : null;
};

export default BaseLocale;
