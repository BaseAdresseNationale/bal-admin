import Main from '@/layouts/main'

import {useUser} from '@/hooks/user'

import Loader from '@/components/loader'
import Dashboard from '@/components/dashboard'

const Home = () => {
  const [isAdmin, isLoading] = useUser()

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && <Dashboard />}
      </Loader>
    </Main>
  )
}

export default Home
