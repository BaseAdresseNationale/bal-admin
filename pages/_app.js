import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import {createNextDsfrIntegrationApi} from '@codegouvfr/react-dsfr/next-pagesdir'

const {withDsfr, dsfrDocumentApi} = createNextDsfrIntegrationApi({
  defaultColorScheme: 'system',
  Link
})

export {dsfrDocumentApi}

const App = ({Component, pageProps}) => (
  <React.StrictMode>
    <Component {...pageProps} />
  </React.StrictMode>
)

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
}

export default withDsfr(App)

