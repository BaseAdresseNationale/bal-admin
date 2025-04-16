import { PartenaireDeLaCharte } from "../entity";

export const mapPartenairePublicReviews = (
  partenaire: PartenaireDeLaCharte,
  isAdmin: boolean
): PartenaireDeLaCharte => {
  return isAdmin
    ? {
        ...partenaire,
        reviews: (partenaire.reviews || []).filter(
          (review) => review.isEmailVerified
        ),
      }
    : {
        ...partenaire,
        reviews: (partenaire.reviews || [])
          .filter((review) => review.isPublished)
          .map((review) => {
            const {
              isAnonymous,
              community,
              email,
              isEmailVerified,
              verificationToken,
              ...rest
            } = review;
            return isAnonymous
              ? { ...rest }
              : {
                  ...rest,
                  community,
                };
          }),
      };
};
