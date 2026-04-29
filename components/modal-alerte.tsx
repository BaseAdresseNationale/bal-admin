import React, { useEffect, useMemo } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";

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
        },
        {
          doClosesModal: false,
          async onClick() {
            await onAction();
            modal.close();
          },
          children: "Oui",
        },
      ]}
    >
      Attention, cette action est irréversible.
    </modal.Component>
  );
};
