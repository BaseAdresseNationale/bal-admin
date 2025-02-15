import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { Review } from "server/lib/partenaire-de-la-charte/reviews/entity";

interface ReviewItemProps {
  review: Review;
  onShowReview: (review: Review) => void;
}

const ReviewItem = ({ review, onShowReview }: ReviewItemProps) => (
  <tr>
    <td className="fr-col fr-my-1v">{review.email}</td>
    <td className="fr-col fr-my-1v">{review.community}</td>
    <td className="fr-col fr-my-1v">{review.rating} / 5</td>
    <td className="fr-col fr-my-1v">
      {review.isPublished ? (
        <Badge severity="success">Publié</Badge>
      ) : (
        <Badge severity="warning">En attente de validation</Badge>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      <Button
        onClick={() => onShowReview(review)}
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
      >
        Afficher
      </Button>
    </td>
  </tr>
);

export default ReviewItem;
