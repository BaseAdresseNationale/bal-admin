import Link from 'next/link'
import {signIn, signOut} from 'next-auth/react'
import type {Session} from 'next-auth'

type HeaderProps = {
  session: Session;
}

const Header = ({session}: HeaderProps) => (
  <header role='banner' className='fr-header'>
    <div className='fr-header__body'>
      <div className='fr-container'>
        <div className='fr-header__body-row'>
          <div className='fr-header__brand fr-enlarge-link'>
            <div className='fr-header__brand-top'>
              <Link href='/'>
                <div className='fr-header__logo'>
                  <p className='fr-logo'>
                    Base Adresse Locale <br />
                    Admin
                  </p>
                </div>
              </Link>
              <div className='fr-header__navbar'>
                <button className='fr-btn--menu fr-btn' type='button' data-fr-opened='false' aria-controls='modal-499' aria-haspopup='menu' id='button-500' title='Menu'>
                  Menu
                </button>
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
          <div className='fr-header__tools'>
            <div className='fr-header__tools-links'>
              <ul className='fr-btns-group'>
                <li style={{alignItems: 'center'}}>
                  {session ? (<>
                    <div style={{marginRight: 10}}>{session?.user?.name}</div>
                    <button onClick={async () => signOut()} type='button' style={{margin: 0}} className='fr-btn fr-icon-logout-box-r-line' >
                      Déconnexion
                    </button>
                  </>
                  )
                    : <button onClick={async () => signIn()} type='button' style={{margin: 0}} className='fr-btn fr-icon-logout-box-r-line' >
                      Connexion
                    </button>}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='fr-header__menu fr-modal' id='modal-499' aria-labelledby='button-500'>
      <div className='fr-container'>
        <button className='fr-btn--close fr-btn' type='button' aria-controls='modal-499' title='Fermer'>
          Fermer
        </button>
        <div className='fr-header__menu-links' />
        <nav className='fr-nav' id='navigation-494' role='navigation' aria-label='Menu principal'>
          <ul className='fr-nav__list'>
            <li className='fr-nav__item'>
              <Link href='/mes-adresses'>
                <a className='fr-nav__link' target='_self'>Mes Adresses</a>
              </Link>
            </li>
            <li className='fr-nav__item'>
              <Link href='/api-depot'>
                <a className='fr-nav__link' target='_self'>API Dépôt</a>
              </Link>
            </li>
            <li className='fr-nav__item'>
              <Link href='/moissonneur-bal'>
                <a className='fr-nav__link' target='_self'>Moissonneur BAL</a>
              </Link>
            </li>
            <li className='fr-nav__item'>
              <Link href='/partenaires-de-la-charte'>
                <a className='fr-nav__link' target='_self'>Partenaires de la charte</a>
              </Link>
            </li>
            <li className='fr-nav__item'>
              <Link href='/communes'>
                <a className='fr-nav__link' target='_self'>Communes</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
)

export default Header
