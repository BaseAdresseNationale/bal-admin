import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

const SourceOrganisation = ({name, page, logo}) => (
  <div className='fr-card fr-card--grey fr-enlarge-link fr-card--horizontal fr-card--horizontal-tier'>
    <div className='fr-card__body'>
      <div className='fr-card__content'>
        <h3 className='fr-card__title'>
          <Link href={page}>
            <a>{name}</a>
          </Link>
        </h3>
      </div>
    </div>

    <div className='fr-card__header'>
      {logo && (
        <div className='fr-card__img'>
          <Image
            className='fr-responsive-img'
            layout='fill'
            src={logo}
            alt={`logo de l’organisation ${name}`}
          />
        </div>
      )}
    </div>
  </div>
)

SourceOrganisation.propTypes = {
  name: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  logo: PropTypes.string
}

export default SourceOrganisation
