import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import type { RevisionMoissoneurType } from "../../types/moissoneur";
import type { Revision as RevisionApiDepot } from "../../types/api-depot.types";
import type { BaseLocaleType } from "../../types/mes-adresses";
import { getCommune } from "@/lib/cog";

import { ModalAlert } from "@/components/modal-alerte";
import { getAllRevisionByCommune } from "@/lib/api-depot";
import {
  searchBasesLocales,
  removeBaseLocale,
  getBaseLocaleIsHabilitationValid,
} from "@/lib/api-mes-adresses";
import { getRevisionsByCommune } from "@/lib/api-moissonneur-bal";

import { EditableList } from "@/components/editable-list";
import { RevisionItemApiDepot } from "@/components/communes/revisions-item-api-depot";
import { RevisionItemMoissoneur } from "@/components/communes/revisions-item-moissoneur";
import { BalsItem } from "@/components/communes/bals-item";

const getBasesLocalesIsHabilitationValid = async (bals: BaseLocaleType[]) => {
  for (const bal of bals) {
    bal.habilitationIsValid = await getBaseLocaleIsHabilitationValid(bal.id);
  }
};

type CommuneSourcePageProps = {
  code: string;
};

const CommuneSource = ({ code }: CommuneSourcePageProps) => {
  const [bals, setBals] = useState<BaseLocaleType[]>([]);
  const [initialRevisionsApiDepot, setInitialRevisionsApiDepot] = useState<
    RevisionApiDepot[]
  >([]);
  const [initialRevisionsMoissonneur, setInitialRevisionsMoissonneur] =
    useState<RevisionMoissoneurType[]>([]);
  const [balToDeleted, setBalToDeleted] = useState<BaseLocaleType>(null);

  const [pageApiDepot, setPageApiDepot] = useState({
    limit: 10,
    count: 0,
    current: 1,
  });

  const [pageMoissonneur, setPageMoissonneur] = useState({
    limit: 10,
    count: 0,
    current: 1,
  });

  const [pageMesAdresses, setPageMesAdresses] = useState({
    limit: 10,
    count: 0,
    current: 1,
  });

  const onPageMoissonneurChange = (newPage: number) => {
    setPageMoissonneur((setPageMoissonneur) => ({
      ...setPageMoissonneur,
      current: newPage,
    }));
  };

  const onPageMesAdressesChange = (newPage: number) => {
    const page: any = {
      ...pageMesAdresses,
      current: newPage,
    };
    setPageMesAdresses(page);
    fetchBals(code, page).catch(console.error);
  };

  const onPageApiDepotChange = (newPage: number) => {
    setPageApiDepot((pageApiDepot) => ({ ...pageApiDepot, current: newPage }));
  };

  const fetchBals = useCallback(async (commune: string, page: any) => {
    const res = await searchBasesLocales({
      commune,
      page: page.current,
      limit: page.limit,
    });

    await getBasesLocalesIsHabilitationValid(res.results);
    setBals(res.results);
    setPageMesAdresses({
      ...page,
      count: res.count,
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const initialRevisionsApiDepot: RevisionApiDepot[] =
        await getAllRevisionByCommune(code);
      const initialRevisionsMoissonneur: RevisionMoissoneurType[] =
        await getRevisionsByCommune(code);

      // Show the last revisions first
      setInitialRevisionsApiDepot(initialRevisionsApiDepot.reverse());
      setPageApiDepot((pageApiDepot) => ({
        ...pageApiDepot,
        count: initialRevisionsApiDepot.length,
      }));

      setInitialRevisionsMoissonneur(initialRevisionsMoissonneur.reverse());
      setPageMoissonneur((pageMoissonneur) => ({
        ...pageMoissonneur,
        count: initialRevisionsMoissonneur.length,
      }));
    };

    fetchData().catch(console.error);
  }, [code]);

  useEffect(() => {
    fetchBals(code, pageMesAdresses).catch(console.error);
  }, [code]);

  const revisionsApiDepot = useMemo(() => {
    const start = (pageApiDepot.current - 1) * pageApiDepot.limit;
    const end = pageApiDepot.current * pageApiDepot.limit;
    return initialRevisionsApiDepot.slice(start, end);
  }, [pageApiDepot, initialRevisionsApiDepot]);

  const revisionsMoissoneur = useMemo(() => {
    const start = (pageMoissonneur.current - 1) * pageMoissonneur.limit;
    const end = pageMoissonneur.current * pageMoissonneur.limit;
    return initialRevisionsMoissonneur.slice(start, end);
  }, [pageMoissonneur, initialRevisionsMoissonneur]);

  const onDeleteBal = useCallback(async () => {
    try {
      await removeBaseLocale(balToDeleted.id);
      await fetchBals(code, pageMesAdresses).catch(console.error);
      setBalToDeleted(null);
      toast("La BAL a bien été archivé", { type: "success" });
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        toast(e.message, { type: "error" });
      }
    }
  }, [balToDeleted, code, fetchBals, setBalToDeleted, pageMesAdresses]);

  const actionsBals = {
    delete(item: BaseLocaleType) {
      setBalToDeleted(item);
    },
  };

  return (
    <div className="fr-container fr-my-4w">
      <ModalAlert
        item={balToDeleted}
        setItem={setBalToDeleted}
        onAction={onDeleteBal}
        title="Voulez vous vraiment supprimer cette bal ?"
      />

      <h1>
        {getCommune(code).nom} ({code})
      </h1>

      <EditableList
        headers={[
          "Id",
          "Client",
          "Status",
          "Date création",
          "Date mise à jour",
          "Emails",
          "Consulter",
          "Supprimer",
        ]}
        caption="Bals mes adresses"
        data={bals}
        renderItem={BalsItem}
        page={{ ...pageMesAdresses, onPageChange: onPageMesAdressesChange }}
        actions={actionsBals}
      />

      <EditableList
        headers={[
          "Id",
          "Source",
          "Nb lignes",
          "Nb lignes erreurs",
          "Status",
          "Publication",
        ]}
        caption="Révisions Moissoneur"
        data={revisionsMoissoneur}
        renderItem={RevisionItemMoissoneur}
        page={{ ...pageMoissonneur, onPageChange: onPageMoissonneurChange }}
      />

      <EditableList
        headers={[
          "Id",
          "Client",
          "Status",
          "Current",
          "Validation",
          "Date création",
          "Date publication",
        ]}
        caption="Révisions Api Depot"
        data={revisionsApiDepot}
        renderItem={RevisionItemApiDepot}
        page={{ ...pageApiDepot, onPageChange: onPageApiDepotChange }}
      />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { code } = params;
  return { props: { code } };
}

export default CommuneSource;
