import Main from '@/layouts/main'

import {useUser} from '@/hooks/user'

import Loader from '@/components/loader'

const Home = () => {
  const [isAdmin, isLoading] = useUser()

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && <div>Bienvenue</div>}
      </Loader>
    </Main>
  )
}

export default Home
