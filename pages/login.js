import {useEffect, useState} from 'react'
import Router from 'next/router'

import Button from '@codegouvfr/react-dsfr/Button'
import Alert from '@codegouvfr/react-dsfr/Alert'

import Main from '@/layouts/main'

import {login} from '@/lib/user'

import {useUser} from '@/hooks/user'

const Login = () => {
  const [isAdmin] = useUser()

  const [error, setError] = useState()

  const handleSubmit = async e => {
    e.preventDefault()

    if (error) {
      setError(null)
    }

    try {
      const res = await login(e.currentTarget.password.value)

      if (res.status === 401) {
        setError('Mot de passe incorrecte')
      }

      if (res.ok) {
        Router.push('/')
      }
    } catch (error) {
      console.error('Une erreur imprévue est survenue :', error)
      setError(error.message)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      Router.push('/')
    }
  }, [isAdmin])

  return (
    <Main isAdmin={isAdmin}>
      <div className='fr-container background-alt-raised-grey login'>
        <form onSubmit={handleSubmit}>
          <label className='fr-label' htmlFor='password'>Mot de passe</label>
          <input className='fr-input' type='password' id='password' name='password' required />
          <Button className='fr-my-2w' type='submit'>
            Connexion
          </Button>

          {error && (
            <Alert
              className='fr-my-2w'
              title='Erreur'
              description={error}
              severity='error'
              closable={false}
              small
            />
          )}
        </form>

        <style jsx>{`
        .login {
          margin: auto;
          padding: 1rem;
        }
      `}</style>
      </div>
    </Main>
  )
}

export default Login
