import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useState } from "react";
import { toast } from "react-toastify";
import Alert from "@codegouvfr/react-dsfr/Alert";
import {
  SignalementCommuneSettings,
  SignalementSource,
  SignalementSubmissionMode,
} from "types/signalement.types";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import SelectInput from "@/components/select-input";
import { MultiSelectInput } from "../multi-select-input";

interface SignalementTableProps {
  signalementCount: {
    pending: number;
    processed: number;
    ignored: number;
    expired: number;
  };
  codeCommune: string;
  signalementCommuneSettings?: SignalementCommuneSettings;
  signalementSources: SignalementSource[];
}

const modeOptions = Object.values(SignalementSubmissionMode).map((mode) => ({
  label: mode,
  value: mode,
}));

export function SignalementTable({
  signalementCount,
  signalementCommuneSettings,
  codeCommune,
  signalementSources,
}: SignalementTableProps) {
  const [communeSettings, setCommuneSettings] =
    useState<SignalementCommuneSettings>(
      signalementCommuneSettings || {
        disabled: false,
        mode: SignalementSubmissionMode.FULL,
        filteredSources: [],
        message: "",
      }
    );
  const [isUpdating, setIsUpdating] = useState(false);

  const sourceOptions = signalementSources.map((source) => ({
    label: source.nom,
    value: source.id,
  }));

  const handleEdit = (key: keyof SignalementCommuneSettings) => (value) => {
    setCommuneSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/proxy-api-signalement/settings/commune-settings/${codeCommune}`,
        {
          method: "POST",
          body: JSON.stringify(communeSettings),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error updating commune settings: ${response.statusText}`
        );
      }
      toast(
        "Les paramètres de dépôt de signalement ont été mis à jour avec succès",
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
      <form onSubmit={handleSubmit}>
        <h5>Paramètres de dépôt de signalement</h5>
        <Checkbox
          options={[
            {
              label: "Désactiver le dépôt de signalement",
              nativeInputProps: {
                checked: communeSettings.disabled,
                onChange: (e) => handleEdit("disabled")(e.target.checked),
                disabled: isUpdating,
              },
            },
          ]}
        />
        {communeSettings.disabled ? (
          <>
            <Alert
              severity="error"
              title="Dépôt de signalement désactivé"
              description="La commune ne peut plus recevoir de signalements."
            />
            <Input
              label="Message de désactivation"
              style={{ marginTop: "1rem" }}
              nativeInputProps={{
                required: false,
                value: communeSettings.message,
                onChange: (e) => handleEdit("message")(e.target.value),
                disabled: isUpdating,
              }}
            />
          </>
        ) : (
          <>
            <SelectInput
              label="Mode de dépôt"
              value={communeSettings.mode}
              options={modeOptions}
              isMultiple={false}
              handleChange={handleEdit("mode")}
            />

            <MultiSelectInput
              label="Sources filtrées"
              options={sourceOptions}
              value={communeSettings.filteredSources}
              onChange={handleEdit("filteredSources")}
              isDisabled={isUpdating}
            />
          </>
        )}
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </form>
    </div>
  );
}
