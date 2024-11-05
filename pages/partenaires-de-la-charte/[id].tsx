import React from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

import { PartenaireForm } from "@/components/partenaires-de-la-charte/partenaire-form";
import {
  deletePartenaireDeLaCharte,
  getPartenaireDeLaCharte,
  updatePartenaireDeLaCharte,
} from "@/lib/partenaires-de-la-charte";
import { PartenaireDeLaCharte } from "../../server/lib/partenaire-de-la-charte/entity";

type PartenaireDeLaChartePageProps = {
  partenaireDeLaCharte: PartenaireDeLaCharte;
};

const deletePartenaireModale = createModal({
  id: "delete-partenaire-modale",
  isOpenedByDefault: false,
});

const PartenaireDeLaChartePage = ({
  partenaireDeLaCharte,
}: PartenaireDeLaChartePageProps) => {
  const isCandidate = !partenaireDeLaCharte.signatureDate;

  const router = useRouter();

  const onUpdate = async (formData) => {
    try {
      await updatePartenaireDeLaCharte(
        partenaireDeLaCharte.id,
        formData,
        isCandidate
      );
      const successMessage = isCandidate
        ? "Candidature enregistrée"
        : "Modifications enregistrées";
      toast(successMessage, { type: "success" });
      if (isCandidate) {
        await router.push("/partenaires-de-la-charte");
      }
    } catch (error: unknown) {
      console.log(error);
      const errorMessage = isCandidate
        ? "Erreur lors de l’enregistrement de la candidature"
        : "Erreur lors de l’enregistrement des modifications";
      toast(errorMessage, {
        type: "error",
      });
    }
  };

  const onDelete = async () => {
    try {
      await deletePartenaireDeLaCharte(partenaireDeLaCharte.id);
      const successMessage = isCandidate
        ? "Candidat supprimé"
        : "Partenaire supprimé";
      toast(successMessage, { type: "success" });
      await router.push("/partenaires-de-la-charte");
    } catch (error: unknown) {
      console.log(error);
      const errorMessage = isCandidate
        ? "Erreur lors de la suppression du candidat"
        : "Erreur lors de la suppression du partenaire";
      toast(errorMessage, { type: "error" });
    }
  };

  return (
    <div className="fr-container">
      <PartenaireForm
        title={
          <h3>
            {partenaireDeLaCharte.name} {isCandidate && "(candidat)"}
          </h3>
        }
        data={partenaireDeLaCharte}
        onSubmit={onUpdate}
        submitLabel={
          isCandidate
            ? "Enregistrer et accepter la candidature"
            : "Enregistrer les modifications"
        }
        controls={
          <Button
            type="button"
            priority="tertiary"
            onClick={() => {
              deletePartenaireModale.open();
            }}
          >
            Supprimer
          </Button>
        }
      />
      <deletePartenaireModale.Component title="Suppression">
        <p>
          Êtes-vous sûr de vouloir supprimer ce{" "}
          {isCandidate ? "candidat" : "partenaire"}?
        </p>
        <div>
          <Button onClick={onDelete}>Supprimer</Button>
          <Button
            style={{ marginLeft: "1rem" }}
            priority="tertiary"
            onClick={() => {
              deletePartenaireModale.close();
            }}
          >
            Annuler
          </Button>
        </div>
      </deletePartenaireModale.Component>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { id } = params;
  const partenaireDeLaCharte = await getPartenaireDeLaCharte(id);

  return {
    props: { partenaireDeLaCharte },
  };
}

export default PartenaireDeLaChartePage;
