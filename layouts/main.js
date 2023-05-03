import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Footer from '@codegouvfr/react-dsfr/Footer'

import Header from '@/components/header'

const Layout = ({isAdmin, children}) => (
  <>
    <Head>
      <title>BAL Admin</title>
      <meta name='description' content='BAL Admin' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </Head>

    <div className='test'>
      <Header isLoggedIn={isAdmin} />
      <main role='main'>
        <React.StrictMode>
          {children}
        </React.StrictMode>
      </main>

      <Footer
        accessibility='non compliant'
        brandTop={<>Base Adresse Locale <br />Admin</>}
        contentDescription='Interface d’administration des services Base Adresse Locale'
        homeLinkProps={{
          href: '/',
          title: 'Accueil - Interface d’administration des services Base Adresse Locale'
        }}
        termsLinkProps={{
          href: '#'
        }}
      />
    </div>
    <style jsx>{`
      .test {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      main {
        flex: 1;
      }
    `}</style>
  </>
)

Layout.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

export default Layout
