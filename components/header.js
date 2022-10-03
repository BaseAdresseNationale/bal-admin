import Link from 'next/link'

const Header = () => (
  <header role='banner' className='fr-header'>
    <div className='fr-header__body'>
      <div className='fr-container'>
        <div className='fr-header__body-row'>
          <div className='fr-header__brand fr-enlarge-link'>
            <div className='fr-header__brand-top'>
              <div className='fr-header__logo'>
                <p className='fr-logo'>
                  Base Adresse Locale <br />
                  Admin
                </p>
              </div>
            </div>
            <div className='fr-header__service'>
              <Link href='/' title='Accueil - [BAL Admin / ANCT]'>
                <p className='fr-header__service-title'>
                  Base Adresse Locale / Admin - ANCT
                </p>
              </Link>
              <p className='fr-header__service-tagline'>Interface d’administration des services Base Adresse Locale</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
)

export default Header
