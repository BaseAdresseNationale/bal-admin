import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {ToastContainer} from 'react-toastify'
import {SessionProvider} from 'next-auth/react'
import {createNextDsfrIntegrationApi} from '@codegouvfr/react-dsfr/next-pagesdir'
import Main from '../layouts/main'

import 'react-toastify/dist/ReactToastify.css'

const {withDsfr, dsfrDocumentApi} = createNextDsfrIntegrationApi({
  defaultColorScheme: 'system',
  Link
})

export {dsfrDocumentApi}

const App = ({Component, pageProps: {session, ...pageProps}}) => (
  <SessionProvider session={session}>
    <React.StrictMode>
      <Main>
        <Component {...pageProps} />
        <ToastContainer />
      </Main>
    </React.StrictMode>
  </SessionProvider>
)

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
}

export default withDsfr(App)

