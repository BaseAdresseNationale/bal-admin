import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import {Footer} from '@codegouvfr/react-dsfr/Footer'
import {useSession} from 'next-auth/react'

import Header from '@/components/header'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  > main {
    flex: 1;

    .user-not-logged-in {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        font-size: 1.5rem;
        font-weight: bold
      }
    }
  }
`

type LayoutProps = {
  children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  const {data: session} = useSession()

  return (
    <>
      <Head>
        <title>BAL Admin</title>
        <meta name='description' content='BAL Admin' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <StyledContainer>
        <Header session={session} />
        <main role='main'>
          {session ? children : (
            <div className='user-not-logged-in'>
              <p>Vous devez être connecté pour accéder à cette page</p>
            </div>
          )}
        </main>

        <Footer
          accessibility='non compliant'
          brandTop={<>Base Adresse Locale <br />Admin</>}
          contentDescription='Interface d’administration des services Base Adresse Locale'
          homeLinkProps={{
            href: '/',
            title: 'Accueil - Interface d’administration des services Base Adresse Locale',
          }}
          termsLinkProps={{
            href: '#',
          }}
        />
      </StyledContainer>
    </>
  )
}

export default Layout
