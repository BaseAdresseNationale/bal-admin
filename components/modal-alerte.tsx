import React, {useEffect} from 'react'
import {createModal} from '@codegouvfr/react-dsfr/Modal'
import {useIsModalOpen} from '@codegouvfr/react-dsfr/Modal/useIsModalOpen'

const modal = createModal({
  id: 'modal-alert',
  isOpenedByDefault: false,
})

type ModalAlertProps<T> = {
  item: T;
  setItem: (item: T | null) => void;
  onAction: () => Promise<void>;
  title: string;
}

export const ModalAlert = <T extends unknown>({item, setItem, onAction, title}: ModalAlertProps<T>) => {
  const isOpen = useIsModalOpen(modal)

  useEffect(() => {
    if (modal && item) {
      modal.open()
    }
  }, [item])

  useEffect(() => {
    if (!isOpen) {
      setItem(null)
    }
  }, [isOpen, setItem])

  return (
    <modal.Component
      title={title}
      buttons={
        [
          {
            doClosesModal: true,
            children: 'Annuler',
          },
          {
            doClosesModal: false,
            async onClick() {
              await onAction()
              modal.close()
            },
            children: 'Supprimer',
          },
        ]
      }
    >
      Attention, cette action est irréversible.
    </modal.Component>
  )
}
