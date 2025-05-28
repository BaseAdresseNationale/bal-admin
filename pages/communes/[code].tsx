import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { sortBy } from "lodash";

import type { RevisionMoissoneurType } from "../../types/moissoneur";
import type { Revision as RevisionApiDepot } from "../../types/api-depot.types";
import type { BaseLocaleType } from "../../types/mes-adresses";
import { getCommune, isCommune } from "@/lib/cog";

import { ModalAlert } from "@/components/modal-alerte";
import { getAllRevisionByCommune, getEmailsCommune } from "@/lib/api-depot";
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
import Badge from "@codegouvfr/react-dsfr/Badge";
import Alert from "@codegouvfr/react-dsfr/Alert";
import {
  SignalementCommuneSettings,
  SignalementSource,
  SignalementStatusEnum,
} from "types/signalement.types";
import {
  getSignalementCommuneSettings,
  getSignalementCount,
  getSignalementSources,
} from "@/lib/api-signalement";
import { CommuneInfosHeader } from "@/components/communes/commune-infos-header";
import { getMarieTelephones } from "server/utils/api-annuaire";

const getBasesLocalesIsHabilitationValid = async (bals: BaseLocaleType[]) => {
  for (const bal of bals) {
    bal.habilitationIsValid = await getBaseLocaleIsHabilitationValid(bal.id);
  }
};

type CommuneSourcePageProps = {
  code: string;
  emails: string[];
  telephones: string[];
  signalementCount: {
    pending: number;
    processed: number;
    ignored: number;
    expired: number;
  };
  signalementCommuneSettings?: SignalementCommuneSettings;
  signalementSources: SignalementSource[];
};

const CommuneSource = ({
  code,
  emails,
  telephones,
  signalementCount,
  signalementCommuneSettings,
  signalementSources,
}: CommuneSourcePageProps) => {
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
    const fetchDataApiDepot = async () => {
      const initialRevisionsApiDepot: RevisionApiDepot[] =
        await getAllRevisionByCommune(code);
      // Show the last revisions first
      setInitialRevisionsApiDepot(initialRevisionsApiDepot.reverse());
      setPageApiDepot((pageApiDepot) => ({
        ...pageApiDepot,
        count: initialRevisionsApiDepot.length,
      }));
    };
    const fetchDataMoissonneur = async () => {
      const initialRevisionsMoissonneur: RevisionMoissoneurType[] =
        await getRevisionsByCommune(code);

      setInitialRevisionsMoissonneur(
        sortBy(initialRevisionsMoissonneur, "createdAt").reverse()
      );
      setPageMoissonneur((pageMoissonneur) => ({
        ...pageMoissonneur,
        count: initialRevisionsMoissonneur.length,
      }));
    };

    fetchDataApiDepot().catch(console.error);
    fetchDataMoissonneur().catch(console.error);
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

  if (!isCommune(code)) {
    return (
      <div className="fr-container">
        <Alert
          className="fr-mt-4v"
          title="Une erreur est survenue"
          description={`Le Code Commune ${code} n'est pas valide`}
          severity="error"
          small
        />
      </div>
    );
  }

  return (
    <div className="fr-container fr-my-4w">
      <ModalAlert
        item={balToDeleted}
        setItem={setBalToDeleted}
        onAction={onDeleteBal}
        title="Voulez vous vraiment supprimer cette bal ?"
      />
      <h1>
        {getCommune(code)?.nom || (
          <Badge severity="warning">Commune Ancienne</Badge>
        )}{" "}
        ({code})
      </h1>
      <CommuneInfosHeader
        emails={emails}
        telephones={telephones}
        signalementCount={signalementCount}
        signalementCommuneSettings={signalementCommuneSettings}
        signalementSources={signalementSources}
        codeCommune={code}
      />
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
          "Date",
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
          "Fichier BAL",
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
  const emails = await getEmailsCommune(code);
  const telephones = await getMarieTelephones(code);
  const signalementSources = await getSignalementSources();
  const signalementCommuneSettings = await getSignalementCommuneSettings(code);
  const pendingSignalementCount = await getSignalementCount(
    code,
    SignalementStatusEnum.PENDING
  );
  const processedSignalementCount = await getSignalementCount(
    code,
    SignalementStatusEnum.PROCESSED
  );
  const ignoredSignalementCount = await getSignalementCount(
    code,
    SignalementStatusEnum.IGNORED
  );
  const expiredSignalementCount = await getSignalementCount(
    code,
    SignalementStatusEnum.EXPIRED
  );

  return {
    props: {
      code,
      emails,
      telephones,
      signalementCount: {
        pending: pendingSignalementCount,
        processed: processedSignalementCount,
        ignored: ignoredSignalementCount,
        expired: expiredSignalementCount,
      },
      signalementCommuneSettings,
      signalementSources,
    },
  };
}

export default CommuneSource;
