import React, { useState } from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

import { PartenaireForm } from "@/components/partenaires-de-la-charte/partenaire-form";
import {
  deletePartenaireDeLaCharte,
  deleteReview,
  getPartenaireDeLaCharte,
  updatePartenaireDeLaCharte,
  updateReview,
} from "@/lib/partenaires-de-la-charte";
import { PartenaireDeLaCharte } from "../../server/lib/partenaire-de-la-charte/entity";
import ReviewsTable from "@/components/partenaires-de-la-charte/reviews/reviews-table";
import { Review } from "server/lib/partenaire-de-la-charte/reviews/entity";

type PartenaireDeLaChartePageProps = {
  partenaireDeLaCharte: PartenaireDeLaCharte;
};

const deletePartenaireModale = createModal({
  id: "delete-partenaire-modale",
  isOpenedByDefault: false,
});

const reviewModale = createModal({
  id: "review-modale",
  isOpenedByDefault: false,
});

const PartenaireDeLaChartePage = ({
  partenaireDeLaCharte: initialPartenaireDeLaCharte,
}: PartenaireDeLaChartePageProps) => {
  const [partenaireDeLaCharte, setPartenaireDeLaCharte] =
    useState<PartenaireDeLaCharte>(initialPartenaireDeLaCharte);
  const [selectedReview, setSelectedReview] = useState<Review>();
  const isCandidate = !partenaireDeLaCharte.signatureDate;

  const router = useRouter();

  const handleShowReview = (review: Review) => {
    setSelectedReview(review);
    reviewModale.open();
  };

  const handleCloseReview = () => {
    setSelectedReview(undefined);
    reviewModale.close();
  };

  const onUpdateReview = async () => {
    if (!selectedReview) {
      return;
    }

    try {
      await updateReview(selectedReview.id, {
        isPublished: !selectedReview.isPublished,
      });
      const successMessage = selectedReview.isPublished
        ? "Avis dé-publié"
        : "Avis publié";
      const updatedPartenaireDeLaCharte = await getPartenaireDeLaCharte(
        partenaireDeLaCharte.id
      );
      setPartenaireDeLaCharte(updatedPartenaireDeLaCharte);
      toast(successMessage, { type: "success" });
      handleCloseReview();
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = selectedReview.isPublished
        ? "Erreur lors de la dé-publication de l’avis"
        : "Erreur lors de la publication de l’avis";
      toast(errorMessage, { type: "error" });
    }
  };

  const onDeleteReview = async () => {
    if (!selectedReview) {
      return;
    }

    try {
      await deleteReview(selectedReview.id);
      const updatedPartenaireDeLaCharte = await getPartenaireDeLaCharte(
        partenaireDeLaCharte.id
      );
      setPartenaireDeLaCharte(updatedPartenaireDeLaCharte);
      toast("Avis supprimé", { type: "success" });
      handleCloseReview();
    } catch (error: unknown) {
      console.error(error);
      toast("Erreur lors de la suppression de l’avis", { type: "error" });
    }
  };

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
      console.error(error);
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
      console.error(error);
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
      {partenaireDeLaCharte.reviews.length > 0 && (
        <ReviewsTable
          partenaireDeLaCharte={partenaireDeLaCharte}
          onShowReview={handleShowReview}
        />
      )}
      <reviewModale.Component title={`Avis de ${selectedReview?.fullname}`}>
        {selectedReview && (
          <>
            <p>
              Avis déposé le{" "}
              <b>
                {new Date(selectedReview.createdAt).toLocaleDateString("fr")}
              </b>
            </p>
            <p>
              Par{" "}
              <b>
                {selectedReview.fullname} ({selectedReview.email}){" "}
                {selectedReview.community
                  ? `de ${selectedReview.community} `
                  : ""}
                {selectedReview.isAnonymous && "(anonyme)"}
              </b>
            </p>
            <p>
              Note : <b>{selectedReview.rating} / 5</b>
            </p>
            <p>
              {selectedReview.comment
                ? `Commentaire : ${selectedReview.comment}`
                : ""}
            </p>
            <div>
              <Button onClick={onUpdateReview}>
                {selectedReview.isPublished ? "Dé-publier" : "Publier"}
              </Button>
              <Button
                priority="secondary"
                onClick={onDeleteReview}
                style={{ marginLeft: "1rem" }}
              >
                Supprimer
              </Button>
              <Button
                style={{ marginLeft: "1rem" }}
                priority="tertiary"
                onClick={handleCloseReview}
              >
                Annuler
              </Button>
            </div>
          </>
        )}
      </reviewModale.Component>
    </div>
  );
};

export async function getServerSideProps({ params, ...context }) {
  const cookies = context.req.headers.cookie;
  const { id } = params;
  const partenaireDeLaCharte = await getPartenaireDeLaCharte(id, {
    cookie: cookies,
  });

  return {
    props: { partenaireDeLaCharte },
  };
}

export default PartenaireDeLaChartePage;
