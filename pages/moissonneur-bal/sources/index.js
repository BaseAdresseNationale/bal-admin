import PropTypes from 'prop-types'
import Image from 'next/image'

import Link from 'next/link'
import Main from '@/layouts/main'
import {getSource} from '@/lib/api-moissonneur-bal'

const MoissoneurBAL = ({source}) => {
  const {title, description, organization, license, type} = source
  return (
    <Main>
      <div className='fr-container fr-py-12v'>
        <h1>{title}</h1>
        <ul className='fr-tags-group'>
          <li>
            <p className='fr-tag'>{license}</p>
          </li>
          <li>
            <p className='fr-tag'>{type}</p>
          </li>
        </ul>
      </div>

      <div className='fr-container'>
        <p>{description}</p>
      </div>

      <div className='fr-container'>
        <h2>Organisation</h2>
        <div className='fr-card fr-card--grey fr-enlarge-link fr-card--horizontal fr-card--horizontal-tier'>
          <div className='fr-card__body'>
            <div className='fr-card__content'>
              <h3 className='fr-card__title'>
                <Link href={organization.page}>
                  <a>{organization.name}</a>
                </Link>
              </h3>
            </div>
          </div>
          <div className='fr-card__header'>
            <div className='fr-card__img'>
              <Image
                className='fr-responsive-img'
                layout='fill'
                src={organization.logo}
                alt={`logo de l’organisation ${organization.name}`}
              />
            </div>
          </div>
        </div>
      </div>
    </Main>
  )
}

MoissoneurBAL.propTypes = {
  source: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    organization: PropTypes.object.isRequired,
    license: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired
}

export async function getServerSideProps({query}) {
  const source = await getSource(query.sourceId)

  return {
    props: {source}
  }
}

export default MoissoneurBAL

// Const source = {
//   _id: 'datagouv-5be174928b4c412c5b8cc23f',
//   _created: '2022-10-20T15:22:12.137Z',
//   _deleted: false,
//   converter: null,
//   data: {
//     fileHash: '3f086f1fdee733fb652f61ad81ccc28b6ad699b145591ca1d282a86cd5a039ca',
//     fileId: '635167c305b2da820066459f',
//     harvestDate: '2022-10-20T15:22:13.402Z',
//     harvestId: '635167a505b2da8200663b60'
//   },
//   description: 'Cette donnée est générée à partir de la base de données de gestion et d’administration des données voies et adresses du territoire métropolitain.\n'
//     + '\n'
//     + 'Le format BAL (Base Adresse Locale) est la définition d’un modèle attributaire structuré de telle manière à se rapprocher voire à cloner le modèle de données BAN (Base Adresse Nationale). \n'
//     + 'Ainsi, ce format peut être exploité comme un format d’échange entre les modèles de données locaux et le modèle de données national.\n'
//     + '\n'
//     + 'Le format BAL que nous diffusons déroge légèrement du modèle standard :\n'
//     + ' - Ajout d’un champ unique « cle_producteur »,\n'
//     + ' - Localisation des lieudits,\n'
//     + ' - Localisation de l’ensemble des voies.\n'
//     + '\n'
//     + 'Les principales opérations de constitution de ce lot de données sont :\n'
//     + ' - Reconstitution des adresses complètes à partir de la base de données de production,\n'
//     + ' - Mise en forme des données pour correspondre aux exigences du modèle BAL,\n'
//     + ' - Exploitation des points de numérotation,\n'
//     + ' - Génération des points au centroïde des lieudits,\n'
//     + ' - Génération des points sur la trame viaire au centre de chacune des voies,\n'
//     + ' - Typage des points (entrée, segment, centroïde),\n'
//     + ' - Génération des coordonnées x/y en Lambert 93 et lat/long en WGS84.\n'
//     + '\n'
//     + 'Cette donnée est disponible au téléchargement sous 2 formats :\n'
//     + ' - Un fichier CSV répondant au standard BAL,\n'
//     + ' - Un fichier ZIP contenant le fichier CSV horodaté.',
//   harvesting: {
//     lastHarvest: '2022-10-20T15:22:13.402Z',
//     lastHarvestStatus: 'completed',
//     lastHarvestUpdateStatus: 'updated',
//     harvestingSince: null,
//     asked: true
//   },
//   license: 'lov2',
//   model: 'bal',
//   organization: {
//     name: 'Métropole de Lyon',
//     page: 'https://www.data.gouv.fr/fr/organizations/grand-lyon/',
//     logo: 'https://static.data.gouv.fr/avatars/04/c19464d327463da5579852ddbc3cf5-original.png'
//   },
//   page: 'https://www.data.gouv.fr/fr/datasets/base-adresse-locale-de-la-metropole-de-lyon-bal/',
//   title: 'Base Adresse Locale de la Métropole de Lyon',
//   type: 'github',
//   url: 'https://download.data.grandlyon.com/files/grandlyon/localisation/bal/bal_200046977.csv',
//   _updated: '2022-10-20T15:22:44.281Z'
// }
