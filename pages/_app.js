import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { createNextDsfrIntegrationApi } from "@codegouvfr/react-dsfr/next-pagesdir";
import Main from "../layouts/main";
import { createGlobalStyle } from "styled-components";

import "react-toastify/dist/ReactToastify.css";

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
  defaultColorScheme: "system",
  Link,
});

export { dsfrDocumentApi };

// Global styles to override DSFR styles
const GlobalStyle = createGlobalStyle`
  .fr-container {
    max-width: unset
  };

  /* Ensure text in DSFR modals adapts to dark mode */
  .fr-modal__content {
    color: inherit;
  }

  /* Ensure all text elements inside modal content inherit the color */
  .fr-modal__content p,
  .fr-modal__content li,
  .fr-modal__content span,
  .fr-modal__content b,
  .fr-modal__content strong {
    color: var(--text-default-grey);
  }

  /* Override for dark mode - modals typically have light background even in dark mode */
  [data-fr-theme="dark"] .fr-modal__content,
  [data-fr-theme="dark"] .fr-modal__content p,
  [data-fr-theme="dark"] .fr-modal__content li,
  [data-fr-theme="dark"] .fr-modal__content span,
  [data-fr-theme="dark"] .fr-modal__content b,
  [data-fr-theme="dark"] .fr-modal__content strong {
    color: var(--text-title-grey);
  }

  [data-fr-theme="light"] .fr-modal__content,
  [data-fr-theme="light"] .fr-modal__content p,
  [data-fr-theme="light"] .fr-modal__content li,
  [data-fr-theme="light"] .fr-modal__content span,
  [data-fr-theme="light"] .fr-modal__content b,
  [data-fr-theme="light"] .fr-modal__content strong {
    color: var(--text-default-grey);
  }
`;

const App = ({ Component, pageProps: { session, ...pageProps } }) => (
  <SessionProvider session={session}>
    <React.StrictMode>
      <GlobalStyle />
      <Main>
        <Component {...pageProps} />
        <ToastContainer />
      </Main>
    </React.StrictMode>
  </SessionProvider>
);

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default withDsfr(App);
