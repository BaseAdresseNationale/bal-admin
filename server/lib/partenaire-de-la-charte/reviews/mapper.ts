import { PartenaireDeLaCharte } from "../entity";

export const mapPartenairePublicReviews = (
  partenaire: PartenaireDeLaCharte
): PartenaireDeLaCharte => {
  return {
    ...partenaire,
    reviews: (partenaire.reviews || [])
      .filter((review) => review.isPublished)
      .map((review) => {
        const { isAnonymous, fullname, community, email, ...rest } = review;
        return isAnonymous
          ? { ...rest }
          : {
              ...rest,
              fullname,
              community,
            };
      }),
  };
};
