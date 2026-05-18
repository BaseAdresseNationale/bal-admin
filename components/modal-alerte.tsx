import React, { useEffect, useMemo, useState } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import Loader from "./loader";

type ModalAlertProps<T> = {
  id: string;
  item: T;
  setItem: (item: T | null) => void;
  onAction: () => Promise<void>;
  title: string;
};

export const ModalAlert = <T extends unknown>({
  id,
  item,
  setItem,
  onAction,
  title,
}: ModalAlertProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const modal = useMemo(
    () => createModal({ id, isOpenedByDefault: false }),
    [id],
  );
  const isOpen = useIsModalOpen(modal);

  useEffect(() => {
    if (modal && item) {
      modal.open();
    }
  }, [item, modal]);

  useEffect(() => {
    if (!isOpen) {
      setItem(null);
    }
  }, [isOpen, setItem]);

  return (
    <modal.Component
      title={title}
      buttons={[
        {
          doClosesModal: true,
          children: "Non",
          disabled: isLoading,
        },
        {
          doClosesModal: false,
          async onClick() {
            setIsLoading(true);
            await onAction();
            setIsLoading(false);
            modal.close();
          },
          children: "Oui",
          disabled: isLoading,
        },
      ]}
    >
      <Loader isLoading={isLoading}>
        Attention, cette action est irréversible.
      </Loader>
    </modal.Component>
  );
};
