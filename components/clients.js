import Client from '@/components/client'

const clients = [
  {
    _id: '6051dae287088f21afd00c5',
    nom: 'Nom de l’organisme',
    chefDeFile: 'cheldefile',
    mandataire: 'mandataire',
    active: true,
    authorizationStrategy: 'habilitation',
    _createdAt: '1970-01-01',
    _updatedAt: '1970-01-01',
    options: {
      relaxMode: false
    },
    token: 'xxxxxxxxxxxxxxxxxx'
  },
  {
    _id: '6051dae287088f1afd00c53',
    nom: 'Nom de l’organisme',
    chefDeFile: 'cheldefile',
    mandataire: 'mandataire',
    active: true,
    authorizationStrategy: 'habilitation',
    _createdAt: '1970-01-01',
    _updatedAt: '1970-01-01',
    options: {
      relaxMode: false
    },
    token: 'xxxxxxxxxxxxxxxxxx'
  },
  {
    _id: '6051de287088f21afd00c53',
    nom: ' l’organisme',
    chefDeFile: 'cheldefile',
    mandataire: 'mandataire',
    active: true,
    authorizationStrategy: 'habilitation',
    _createdAt: '1970-01-01',
    _updatedAt: '1970-01-01',
    options: {
      relaxMode: false
    },
    token: 'xxxxxxxxxxxxxxxxxx'
  },
  {
    _id: '051dae287088f21afd00c53',
    nom: 'Nom de ',
    chefDeFile: 'cheldefile',
    mandataire: 'mandataire',
    active: true,
    authorizationStrategy: 'habilitation',
    _createdAt: '1970-01-01',
    _updatedAt: '1970-01-01',
    options: {
      relaxMode: false
    },
    token: 'xxxxxxxxxxxxxxxxxx'
  },
  {
    _id: '601dae287088f21afd00c53',
    nom: 'Nom de l’organisme',
    chefDeFile: 'cheldefile',
    mandataire: 'mandataire',
    active: false,
    authorizationStrategy: 'habilitation',
    _createdAt: '1970-01-01',
    _updatedAt: '1970-01-01',
    options: {
      relaxMode: false
    },
    token: 'xxxxxxxxxxxxxxxxxx'
  },
  {
    _id: '605dae287088f21afd00c53',
    nom: 'Nom  l’organisme',
    chefDeFile: 'cheldefile',
    mandataire: 'mandataire',
    active: true,
    authorizationStrategy: 'chef-de-file',
    _createdAt: '1970-01-01',
    _updatedAt: '1970-01-01',
    options: {
      relaxMode: false
    },
    token: 'xxxxxxxxxxxxxxxxxx'
  },
  {
    _id: '6051dae287088f21afd0c53',
    nom: 'Nom de l’organisme',
    chefDeFile: 'cheldefile',
    mandataire: 'mandataire',
    active: true,
    authorizationStrategy: 'chef-de-file',
    _createdAt: '1970-01-01',
    _updatedAt: '1970-01-01',
    options: {
      relaxMode: false
    },
    token: 'xxxxxxxxxxxxxxxxxx'
  }
]

const Clients = () => (
  <div className='fr-container fr-mt-5w'>
    <h2>Clients :</h2>
    <div className='fr-container'>
      <div className='fr-grid-row border-bottom text-center fr-p-2w'>
        <div className='fr-col-12 fr-col-md-2 align'>
          Nom
        </div>
        <div className='fr-col-12 fr-col-md-2 align'>
          Chef de file
        </div>
        <div className='fr-col-12 fr-col-md-2 align'>
          Mandataire
        </div>
        <div className='fr-col-6 fr-col-md-2 align'>
          Authentification
        </div>
        <div className='fr-col-6 fr-col-md-2 align'>
          Actif
        </div>
        <div className='fr-col-6 fr-col-md-2 align'>
          Éditer
        </div>
      </div>
    </div>
    {clients.map(c => (
      <Client key={c._id} client={c} />
    ))}
    <style jsx>{`
      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1em;
      }

      .text-center {
        text-align: center;
        font-weight: bold;
      }

      .align {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      }

      .border-bottom {
        border-bottom: 1px solid #e5e5e5;
      }
    `}</style>
  </div>

)

export default Clients
