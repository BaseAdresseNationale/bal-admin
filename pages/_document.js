import {Html, Head, Main, NextScript} from 'next/document'
import {dsfrDocumentApi} from './_app'

const {
  getColorSchemeHtmlAttributes,
  augmentDocumentForDsfr
} = dsfrDocumentApi

const Document = props => (
  <Html {...getColorSchemeHtmlAttributes(props)}>
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document

augmentDocumentForDsfr(Document)
