import Tabs from '@codegouvfr/react-dsfr/Tabs'
import { OrganizationMoissoneurType, SourceMoissoneurType } from "types/moissoneur";
import { getOrganizations, getSources } from "@/lib/api-moissonneur-bal";
import MoissoneurSources from '@/components/moissonneur-bal/sources/index'
import MoissoneurOrganizations from '@/components/moissonneur-bal/organizations';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type MoissoneurBALProps = {
  page: string;
  sources: SourceMoissoneurType[];
  organizations: OrganizationMoissoneurType[];
};

const MoissoneurBAL = ({ sources, organizations, page }: MoissoneurBALProps) => {
  const router = useRouter();
  const [selectedTabId, setSelectedTabId] = useState(page);

  useEffect(() => {
    router.push(`/moissonneur-bal?page=${selectedTabId}`, undefined, { shallow: true })
  }, [selectedTabId])

  return (
    <div className='fr-container'>
      <Tabs
        className='fr-container fr-my-2w'
        selectedTabId={selectedTabId}
        onTabChange={(e) => setSelectedTabId(e)}
        tabs={[
          {tabId: "sources", label: 'Sources'},
          {tabId: "organizations", label: 'Organisations'}
        ]}
      >
        { selectedTabId === 'sources' && <MoissoneurSources sources={sources} /> }
        { selectedTabId === 'organizations' && <MoissoneurOrganizations organizations={organizations} /> }
      </Tabs>
    </div>
  )
}

export async function getServerSideProps({query}) {
  const {page} = query
  const sources: SourceMoissoneurType[] = await getSources();
  const organizations: OrganizationMoissoneurType[] = await getOrganizations();

  return {
    props: { sources, organizations, page: page || 'sources' },
  };
}

export default MoissoneurBAL;
