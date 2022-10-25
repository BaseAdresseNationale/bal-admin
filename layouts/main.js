import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import Header from '@/components/header'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  static defaultProps = {
    children: null
  }

  render() {
    const {children} = this.props

    return (
      <>
        <Head>
          <title>BAL Admin</title>
          <meta name='description' content='BAL Admin' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>

        <Header />

        <main role='main'>
          <React.StrictMode>
            {children}
          </React.StrictMode>
        </main>
      </>
    )
  }
}

export default Layout
