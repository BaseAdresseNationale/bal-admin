import { useState, useEffect } from "react";
import { getPartenairesDeLaCharte } from "../lib/partenaires-de-la-charte";
import { PartenaireDeLaCharte } from "../server/lib/partenaire-de-la-charte/entity";

export function usePartenairesDeLaCharteData() {
  const [isLoading, setIsLoading] = useState(false);
  const [partenairesDeLaCharteData, setPartenairesDeLaCharteData] = useState<
    PartenaireDeLaCharte[]
  >([]);
  const [candidaturesEnAttenteData, setCandidaturesEnAttenteData] = useState<
    PartenaireDeLaCharte[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const partenairesDeLaCharte = await getPartenairesDeLaCharte();
        setPartenairesDeLaCharteData(
          partenairesDeLaCharte.filter(
            (partenaireDeLaCharte) => partenaireDeLaCharte.signatureDate
          )
        );
        setCandidaturesEnAttenteData(
          partenairesDeLaCharte.filter(
            (partenaireDeLaCharte) => !partenaireDeLaCharte.signatureDate
          )
        );
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchData();
  }, []);

  return { isLoading, partenairesDeLaCharteData, candidaturesEnAttenteData };
}
