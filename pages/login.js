import {useEffect, useState} from 'react'
import Router from 'next/router'

import Main from '@/layouts/main'

import {login} from '@/lib/user'

import {useUser} from '@/hooks/user'

const Login = () => {
  const [isAdmin] = useUser()

  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    if (error) {
      setError('')
    }

    try {
      const res = await login(e.currentTarget.password.value)

      if (res.status === 401) {
        setError('Mot de passe incorrecte')
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
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
          <button type='submit' className='fr-btn fr-my-2w'>
            Connexion
          </button>

          {error && (
            <div className='fr-alert fr-alert--error fr-alert--sm fr-my-2w'>
              <p>Erreur : {error}</p>
            </div>
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
