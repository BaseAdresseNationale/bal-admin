import React, { useEffect, useState } from "react";
import { SignalementEnabledListKeys } from "types/signalement.types";
import {
  getIsInSignalementEnabledList,
  putIsInSignalementEnabledList,
} from "@/lib/api-signalement";
import { toast } from "react-toastify";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import Alert from "@codegouvfr/react-dsfr/Alert";

type ToggleSignalementEnabledListProps = {
  listKey: SignalementEnabledListKeys;
  id: string;
};

export const ToggleSignalementEnabledList = ({
  listKey,
  id,
}: ToggleSignalementEnabledListProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isInEnabledList, setIsInEnabledList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getIsInSignalementEnabledList(listKey, id);
        setIsInEnabledList(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [listKey, id]);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await putIsInSignalementEnabledList(listKey, id, !isInEnabledList);

      const newState = !isInEnabledList;
      setIsInEnabledList(newState);
      toast(
        newState
          ? `Les communes publiées par ${
              listKey === SignalementEnabledListKeys.API_DEPOT_CLIENTS_ENABLED
                ? "ce client"
                : "cette source"
            } peuvent désormais recevoir des signalements`
          : `Les communes publiées par ${
              listKey === SignalementEnabledListKeys.API_DEPOT_CLIENTS_ENABLED
                ? "ce client"
                : "cette source"
            } ne peuvent plus recevoir de signalements`,
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
      <Checkbox
        options={[
          {
            label: "Activer le dépôt de signalement",
            nativeInputProps: {
              checked: isInEnabledList,
              onChange: handleToggle,
              disabled: isUpdating,
            },
          },
        ]}
      />
      {isInEnabledList && (
        <Alert
          severity="success"
          title="Dépôt de signalement activé"
          description={`Les communes publiées par ${
            listKey === SignalementEnabledListKeys.API_DEPOT_CLIENTS_ENABLED
              ? "ce client"
              : "cette source"
          } peuvent recevoir des signalements.`}
        />
      )}
    </div>
  );
};
