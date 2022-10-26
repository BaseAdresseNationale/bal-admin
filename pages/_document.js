import NextDocument, {Html, Head, Main, NextScript} from 'next/document'
import {getColorSchemeSsrUtils} from '@codegouvfr/react-dsfr/lib/next'

const {
  readColorSchemeFromCookie,
  getColorSchemeHtmlAttributes
} = getColorSchemeSsrUtils()

const Document = () => (
  <Html {...getColorSchemeHtmlAttributes()}>
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document

Document.getInitialProps = async ctx => {
  const initialProps = await NextDocument.getInitialProps(ctx)

  readColorSchemeFromCookie(ctx)

  return {...initialProps}
}
