import {useCallback, useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'

import {getSource, udpateSource, getSourceHarvests, harvestSource} from '@/lib/api-moissonneur-bal'

import Main from '@/layouts/main'

import HarvestItem from '@/components/moissonneur-bal/harvest-item'
import SourceOrganisation from '@/components/moissonneur-bal/source-organization'

const MoissoneurBAL = ({initialSource, initialHarvests}) => {
  const [source, setSource] = useState(initialSource)
  const [harvests, setHarvests] = useState(initialHarvests)

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

  useEffect(() => {
    if (source.harvesting.asked && !interval.current) {
      refresh()
    }
  }, [source, refresh])

  return (
    <Main>
      <div className='fr-container fr-py-12v'>
        <h1>{source.title}</h1>
        <ul className='fr-tags-group'>
          <li>
            <p className='fr-tag'>{source.license}</p>
          </li>
          <li>
            <p className='fr-tag'>{source.type}</p>
          </li>
        </ul>
      </div>

      <div className='fr-container'>
        <p>{source.description}</p>
      </div>

      <div className='fr-container'>
        <h2>Organisation</h2>
        {source.organization ? (
          <SourceOrganisation {...source.organization} />
        ) : (
          <div>Aucune information</div>
        )}
      </div>

      <div className='fr-container fr-my-12v'>
        <h2>Moissonnages</h2>

        <button
          type='button'
          className='fr-btn fr-btn--primary'
          onClick={askHarvest}
          disabled={source.harvesting.asked || !source.enabled}
        >
          {source.harvesting.asked ? 'Moissonnage en cours…' : 'Lancer le moissonnage'}
        </button>

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
        <button
          type='button'
          className='fr-btn fr-btn--secondary'
          onClick={enabledSource}
        >
          {source.enabled ? 'Désactiver' : 'Activer'} la source
        </button>
      </div>
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
  initialHarvests: PropTypes.array.isRequired
}

export async function getServerSideProps({query}) {
  const source = await getSource(query.sourceId)
  const harvests = await getSourceHarvests(query.sourceId)

  return {
    props: {
      initialSource: source,
      initialHarvests: harvests
    }
  }
}

export default MoissoneurBAL
