import {useCallback, useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'

import Card from '@codegouvfr/react-dsfr/Card'
import Button from '@codegouvfr/react-dsfr/Button'
import Alert from '@codegouvfr/react-dsfr/Alert'

import {getSource, udpateSource, getSourceHarvests, harvestSource, getSourceCurrentRevisions, publishRevision} from '@/lib/api-moissonneur-bal'

import {useUser} from '@/hooks/user'

import Main from '@/layouts/main'

import MongoId from '@/components/mongo-id'
import Loader from '@/components/loader'
import HarvestItem from '@/components/moissonneur-bal/harvest-item'
import RevisionItem from '@/components/moissonneur-bal/revision-item'

const MoissoneurBAL = ({initialSource, initialHarvests, initialRevisions}) => {
  const [isAdmin, isLoading] = useUser()

  const [source, setSource] = useState(initialSource)
  const [harvests, setHarvests] = useState(initialHarvests)
  const [revisions, setRevisions] = useState(initialRevisions)
  const [forcePublishRevisionStatus, setForcePublishRevisionStatus] = useState(null)

  const interval = useRef()

  const refresh = useCallback(async () => {
    async function update() {
      const freshSource = await getSource(source._id)
      setSource(freshSource)

      if (!freshSource.harvesting.asked) {
        const freshHarvests = await getSourceHarvests(source._id)
        clearInterval(interval.current)
        setHarvests(freshHarvests)
      }
    }

    await update()
    interval.current = setInterval(update, 5000)
  }, [source])

  const askHarvest = async () => {
    await harvestSource(source._id)
    await refresh()
  }

  const enabledSource = async () => {
    const updatedSource = await udpateSource(source._id, {enabled: !source.enabled})
    setSource(updatedSource)
  }

  const onForcePublishRevision = async id => {
    setForcePublishRevisionStatus('loading')
    try {
      await publishRevision(id, {force: true})
      const updateRevisions = await getRevisionsWithPublicationData(source._id)
      setRevisions(updateRevisions)
      setForcePublishRevisionStatus('success')
    } catch (err) {
      console.error(err)
      setForcePublishRevisionStatus('error')
    }
  }

  useEffect(() => {
    if (source.harvesting.asked && !interval.current) {
      refresh()
    }
  }, [source, refresh])

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <>
            <div className='fr-container fr-py-12v'>
              <div className='fr-grid-row fr-grid-row--gutters'>
                <div className='fr-col-10'>
                  <h1>{source.title}</h1>
                  <MongoId id={source._id} />
                  <ul className='fr-tags-group'>
                    <li>
                      <p className='fr-tag'>{source.license}</p>
                    </li>
                    <li>
                      <p className='fr-tag'>{source.type}</p>
                    </li>
                  </ul>
                </div>

                <div className='fr-col-2'>
                  <div className='fr-container'>
                    <div className='fr-toggle'>
                      <input type='checkbox' className='fr-toggle__input' aria-describedby='toggle-source-hint-text' id='toggle-source' checked={source.enabled} onChange={enabledSource} />
                      <label className='fr-toggle__label' htmlFor='toggle-source' data-fr-checked-label='Activé' data-fr-unchecked-label='Désactivé' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='fr-container'>
              <p>{source.description}</p>
            </div>

            <div className='fr-container'>
              <h2>Organisation</h2>
              {source.organization ? (
                <Card
                  desc=''
                  enlargeLink
                  horizontal
                  imageAlt={`Logo de l'organisation ${source.organization.name}`}
                  imageUrl={source.organization.logo}
                  linkProps={{
                    href: source.organization.page
                  }}
                  title={source.organization.name}
                />
              ) : (
                <div>Aucune information</div>
              )}
            </div>

            <div className='fr-container fr-my-12v'>
              <h2>Moissonnages</h2>

              <Button
                iconId={source.harvesting.asked || !source.enabled ? '' : 'fr-icon-flashlight-fill'}
                iconPosition='right'
                disabled={source.harvesting.asked || !source.enabled} onClick={askHarvest}
              >
                {source.harvesting.asked ? 'Moissonnage en cours…' : 'Lancer le moissonnage'}
              </Button>

              <div className='fr-table'>
                <table>
                  <thead>
                    <tr>
                      <th scope='col'>Début du moissonnage</th>
                      <th scope='col'>Fin du moissonnage</th>
                      <th scope='col'>État du moissonnage</th>
                      <th scope='col'>État de la mise à jour</th>
                      <th scope='col'>Fichier moissonné</th>
                    </tr>
                  </thead>

                  <tbody>
                    {harvests.map(harvest => (
                      <HarvestItem key={harvest._id} {...harvest} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='fr-container fr-my-12v'>
              <h2>Révisions par commune</h2>

              {revisions.length === 0 && (
                <div>Aucune révisions</div>
              )}

              {forcePublishRevisionStatus === 'error' && <Alert title='Erreur' description='La publication de la révision a échoué' severity='error' closable small />}
              {forcePublishRevisionStatus === 'success' && <Alert title='Succès' description='La révision a bien été publiée' severity='success' closable small />}

              <div className='fr-table'>
                <table>
                  <thead>
                    <tr>
                      <th scope='col'>Commune</th>
                      <th scope='col'>Nombre de ligne</th>
                      <th scope='col'>Nombre de ligne en erreur</th>
                      <th scope='col'>Publication</th>
                      <th scope='col'>Fichier</th>
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {revisions.map(revision => (
                      <RevisionItem
                        key={revision._id}
                        onForcePublishRevision={() => onForcePublishRevision(revision._id)}
                        isForcePublishRevisionLoading={forcePublishRevisionStatus === 'loading'}
                        {...revision}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Loader>
    </Main>
  )
}

MoissoneurBAL.propTypes = {
  initialSource: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    description: PropTypes.string,
    organization: PropTypes.object,
    license: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    harvesting: PropTypes.object.isRequired
  }).isRequired,
  initialHarvests: PropTypes.array.isRequired,
  initialRevisions: PropTypes.array.isRequired
}

async function getRevisionsWithPublicationData(sourceId) {
  const revisions = await getSourceCurrentRevisions(sourceId)
  const revisionsWithPublicationData = await Promise.all(revisions.map(async revision => {
    if (revision.publication) {
      if (revision.publication.status === 'provided-by-other-source') {
        const currentSource = await getSource(revision.publication.currentSourceId)
        revision.publication = {
          ...revision.publication,
          currentSourceName: currentSource.organization.name
        }
      } else if (revision.publication.status === 'provided-by-other-client') {
        revision.publication = {
          ...revision.publication,
          currentClientName: revision.publication.currentClientId
        }
      }
    }

    return revision
  }))

  return revisionsWithPublicationData
}

export async function getServerSideProps({query}) {
  const source = await getSource(query.sourceId)
  const harvests = await getSourceHarvests(query.sourceId)
  const revisions = await getRevisionsWithPublicationData(query.sourceId)

  return {
    props: {
      initialSource: source,
      initialHarvests: harvests,
      initialRevisions: revisions,
    }
  }
}

export default MoissoneurBAL
