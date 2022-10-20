import router from 'next/router'

import Main from '@/layouts/main'
import ClientForm from '@/components/client-form'

const NewClient = () => {
  // Pass props for testing
  const client = router.query
  return (
    <Main>
      <ClientForm client={client} />
    </Main>
  )
}

export default NewClient
