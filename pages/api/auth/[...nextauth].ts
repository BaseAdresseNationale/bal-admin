/* eslint-disable new-cap */
import NextAuth from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
}
export default NextAuth(authOptions)
