import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useState } from "react";
import { toast } from "react-toastify";
import Alert from "@codegouvfr/react-dsfr/Alert";

interface SignalementTableProps {
  signalementCount: {
    pending: number;
    processed: number;
    ignored: number;
    expired: number;
  };
  codeCommune: string;
  isCommuneSignalementDisabled: boolean;
}

export function SignalementTable({
  signalementCount,
  isCommuneSignalementDisabled,
  codeCommune,
}: SignalementTableProps) {
  const [isCommuneDisabled, setIsCommuneDisabled] = useState(
    isCommuneSignalementDisabled
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await fetch(
        `/api/proxy-api-signalement/settings/communes-disabled/${codeCommune}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newState = !isCommuneDisabled;
      setIsCommuneDisabled(newState);
      toast(
        newState
          ? "La commune ne peut plus recevoir de signalements"
          : "La commune peut désormais recevoir des signalements",
        { type: "success" }
      );
    } catch (error) {
      console.error(error);
      toast("Une erreur est survenue", {
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="fr-table">
        <h5>Signalements</h5>
        <br />
        <table>
          <thead>
            <tr>
              <th scope="col">En attente</th>
              <th scope="col">Traités</th>
              <th scope="col">Ignorés</th>
              <th scope="col">Expirés</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{signalementCount.pending}</td>
              <td>{signalementCount.processed}</td>
              <td>{signalementCount.ignored}</td>
              <td>{signalementCount.expired}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <Checkbox
          options={[
            {
              label: "Désactiver le dépôt de signalement",
              nativeInputProps: {
                checked: isCommuneDisabled,
                onChange: handleToggle,
                disabled: isUpdating,
              },
            },
          ]}
        />
        {isCommuneDisabled && (
          <Alert
            severity="error"
            title="Dépôt de signalement désactivé"
            description="La commune ne peut plus recevoir de signalements."
          />
        )}
      </div>
    </div>
  );
}
