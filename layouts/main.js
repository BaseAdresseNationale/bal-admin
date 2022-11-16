import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import Header from '@/components/header'

const Layout = ({isAdmin, children}) => (
  <>
    <Head>
      <title>BAL Admin</title>
      <meta name='description' content='BAL Admin' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </Head>

    <Header isLoggedIn={isAdmin} />

    <main role='main'>
      <React.StrictMode>
        {children}
      </React.StrictMode>
    </main>
  </>
)

Layout.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

export default Layout
