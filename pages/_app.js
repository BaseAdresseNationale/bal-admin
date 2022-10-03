import React from 'react'
import PropTypes from 'prop-types'

import {withAppDsfr} from '@codegouvfr/react-dsfr/lib/nextJs'
import '@codegouvfr/react-dsfr/dsfr/dsfr.css'

const App = ({Component, pageProps}) => (
  <React.StrictMode>
    <Component {...pageProps} />
  </React.StrictMode>
)

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
}

export default withAppDsfr(
  App,
  {defaultColorScheme: 'system'}
)

