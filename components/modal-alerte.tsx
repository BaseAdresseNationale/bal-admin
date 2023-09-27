import {useState, useEffect, useMemo} from 'react'
import {useRouter} from 'next/router'
import {createModal} from '@codegouvfr/react-dsfr/Modal'
import {Alert} from '@codegouvfr/react-dsfr/Alert'

const modal = createModal({
  id: 'modal-alert',
  isOpenedByDefault: false,
})

type ModalAlertProps<T> = {
  item: T;
  onAction: () => Promise<void>;
  title: string;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ModalAlert = <T extends unknown>({item, onAction, title}: ModalAlertProps<T>) => {
  const [error, setError] = useState(null)
  useEffect(() => {
    if (modal && item) {
      modal.open()
    }
  }, [item])

  async function onClickAction() {
    try {
      await onAction()
      modal.close()
    } catch (e: unknown) {
      setError(e)
    }
  }

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
              await onClickAction()
            },
            children: 'Supprimer',
          },
        ]
      }
    >
      Attention, cette action est irréversible.
      {error && <Alert
        className='fr-my-2w'
        title='Erreur'
        description={error.message}
        severity='error'
        closable={false}
        small
      />}
    </modal.Component>
  )
}
