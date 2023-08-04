import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {ToastContainer} from 'react-toastify'

import {createNextDsfrIntegrationApi} from '@codegouvfr/react-dsfr/next-pagesdir'

import 'react-toastify/dist/ReactToastify.css'

const {withDsfr, dsfrDocumentApi} = createNextDsfrIntegrationApi({
  defaultColorScheme: 'system',
  Link
})

export {dsfrDocumentApi}

const App = ({Component, pageProps}) => (
  <React.StrictMode>
    <Component {...pageProps} />
    <ToastContainer />
  </React.StrictMode>
)

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
}

export default withDsfr(App)

