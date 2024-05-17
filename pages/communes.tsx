import { useRouter } from "next/router";
import { CommuneInput, CommuneType } from "@/components/commune-input";

const Communes = () => {
  const router = useRouter();

  return (
    <div className="fr-container fr-py-12v">
      <h3>Recherche</h3>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col">
          <CommuneInput
            onChange={(commune: CommuneType) =>
              router.push({ pathname: `/communes/${commune.code as string}` })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Communes;
