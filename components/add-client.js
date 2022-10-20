import Link from 'next/link'

const AddClient = () => (
  <div className='fr-container fr-p-3w end'>
    <Link href='/client'>
      <button
        type='button'
        className='fr-btn'
      >
        Ajouter un client
      </button>
    </Link>

    <style jsx>{`
      .end {
        display: flex;
        justify-content: end;
      }
    `}</style>
  </div>
)

export default AddClient
