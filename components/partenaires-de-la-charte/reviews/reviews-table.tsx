import ReviewItem from "./review-item";
import { PartenaireDeLaCharte } from "../../../server/lib/partenaire-de-la-charte/entity";
import { Review } from "server/lib/partenaire-de-la-charte/reviews/entity";

interface ReviewsTableProps {
  partenaireDeLaCharte: PartenaireDeLaCharte;
  onShowReview: (review: Review) => void;
}

const ReviewsTable = ({
  partenaireDeLaCharte,
  onShowReview,
}: ReviewsTableProps) => {
  return (
    <div className="fr-table">
      <table>
        <caption>Liste des avis</caption>
        <thead>
          <tr>
            <th scope="col">Nom et prénom</th>
            <th scope="col">Email</th>
            <th scope="col">Commune/Collectivité</th>
            <th scope="col">Note</th>
            <th scope="col">Statut</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {partenaireDeLaCharte.reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onShowReview={onShowReview}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsTable;
