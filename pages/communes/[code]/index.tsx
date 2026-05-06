import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { sortBy } from "lodash";
import { Button } from "@codegouvfr/react-dsfr/Button";

import type {
  RevisionMoissoneurType,
  SourceMoissoneurType,
} from "types/moissoneur";
import type {
  Client,
  Revision,
  Revision as RevisionApiDepot,
} from "types/api-depot.types";
import type { BaseLocaleType } from "types/mes-adresses";
import { getCommune, isCommune } from "@/lib/cog";

import { ModalAlert } from "@/components/modal-alerte";
import {
  getAllRevisionByCommune,
  getEmailsCommune,
  syncRevisionAndPublish,
} from "@/lib/api-depot";
import {
  searchBasesLocales,
  removeBaseLocale,
  updateSettingsBaseLocale,
  syncAndPublishBaseLocale,
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
import { getSources } from "@/lib/api-moissonneur-bal";
import {
  fetchLookupCommune,
  getCommuneAlerts,
  LookupResponse,
  TypeCompositionEnum,
} from "@/lib/api-ban";
import { Alert as AlertBAN } from "types/alerts.types";
import { PublicationBan } from "@/components/communes/publication-ban";

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
  sourcesMoissonneur: SourceMoissoneurType[];
  clientApiDepot: Client[];
  alerts: AlertBAN[];
  lookup: LookupResponse;
};

const CommuneSource = ({
  code,
  emails,
  telephones,
  signalementCount,
  signalementCommuneSettings,
  signalementSources,
  alerts,
  lookup,
}: CommuneSourcePageProps) => {
  const [bals, setBals] = useState<BaseLocaleType[]>([]);
  const [balSelected, setBalSelected] = useState<string>(null);
  const [initialRevisionsApiDepot, setInitialRevisionsApiDepot] = useState<
    RevisionApiDepot[]
  >([]);
  const [lockSyncRevision, setLockSyncRevision] = useState(false);
  const [initialRevisionsMoissonneur, setInitialRevisionsMoissonneur] =
    useState<RevisionMoissoneurType[]>([]);
  const [balToDeleted, setBalToDeleted] = useState<BaseLocaleType>(null);
  const [balToSync, setBalToSync] = useState<BaseLocaleType>(null);
  const [revisionToSync, setRevisionToSync] = useState<Revision>(null);

  const [sourcesMoissonneur, setSourcesMoissonneur] = useState<
    SourceMoissoneurType[]
  >([]);

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
    setBals(res.results);
    setPageMesAdresses({
      ...page,
      count: res.count,
    });
  }, []);

  const fetchDataApiDepot = useCallback(async () => {
    const initialRevisionsApiDepot: RevisionApiDepot[] =
      await getAllRevisionByCommune(code);
    // Show the last revisions first
    setInitialRevisionsApiDepot(initialRevisionsApiDepot.reverse());
    setPageApiDepot((pageApiDepot) => ({
      ...pageApiDepot,
      count: initialRevisionsApiDepot.length,
    }));
  }, [code]);

  const fetchDataMoissonneur = async () => {
    const initialRevisionsMoissonneur: RevisionMoissoneurType[] =
      await getRevisionsByCommune(code);

    setInitialRevisionsMoissonneur(
      sortBy(initialRevisionsMoissonneur, "createdAt").reverse(),
    );
    setPageMoissonneur((pageMoissonneur) => ({
      ...pageMoissonneur,
      count: initialRevisionsMoissonneur.length,
    }));
  };

  const onSyncRevision = useCallback(async () => {
    try {
      setLockSyncRevision(true);
      await syncRevisionAndPublish(revisionToSync.id);
      await fetchDataApiDepot();
      toast("La BAL a bien été synchroniser et publier", { type: "success" });
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        toast(e.message, { type: "error" });
      }
    } finally {
      setLockSyncRevision(false);
    }
  }, [revisionToSync, fetchDataApiDepot]);

  const onSyncBal = useCallback(async () => {
    try {
      await syncAndPublishBaseLocale(balToSync.id);
      await fetchBals(code, pageMesAdresses).catch(console.error);
      await fetchDataApiDepot();
      setBalToSync(null);
      toast("La BAL a bien été synchroniser et publier", { type: "success" });
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        toast(e.message, { type: "error" });
      }
    }
  }, [balToSync, code, fetchBals, fetchDataApiDepot, pageMesAdresses]);

  const revisionsApiDepot = useMemo(() => {
    const start = (pageApiDepot.current - 1) * pageApiDepot.limit;
    const end = pageApiDepot.current * pageApiDepot.limit;
    return initialRevisionsApiDepot.slice(start, end).map((r) => {
      const res = {
        ...r,
        selected: balSelected === r.context?.extras?.balId,
        publicationBan: (
          <PublicationBan
            revision={r}
            alerts={alerts}
            setRevisionToSync={() => setRevisionToSync(r)}
          />
        ),
      };
      if (r.client.legacyId === "moissonneur-bal") {
        return {
          ...res,
          client: {
            ...r.client,
            sourceName:
              sourcesMoissonneur.find(
                (s) => s.id === r.context?.extras?.sourceId,
              )?.title || "inconnu",
          },
        };
      }
      return res;
    });
  }, [
    pageApiDepot,
    initialRevisionsApiDepot,
    balSelected,
    alerts,
    sourcesMoissonneur,
  ]);

  const revisionsMoissoneur = useMemo(() => {
    const start = (pageMoissonneur.current - 1) * pageMoissonneur.limit;
    const end = pageMoissonneur.current * pageMoissonneur.limit;
    return initialRevisionsMoissonneur.slice(start, end).map((r) => ({
      ...r,
      sourceName:
        sourcesMoissonneur.find((s) => s.id === r.sourceId)?.title || "inconnu",
    }));
  }, [pageMoissonneur, initialRevisionsMoissonneur, sourcesMoissonneur]);

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

  const setOtherBalPublishedIgnored = useCallback(
    async (baseLocale: BaseLocaleType) => {
      try {
        const res = await updateSettingsBaseLocale(baseLocale.id, {
          ...baseLocale.settings,
          otherBalPublishedIgnored:
            !baseLocale.settings?.otherBalPublishedIgnored,
        });

        setBals((bals) =>
          bals.map((bal) =>
            bal.id === baseLocale.id ? { ...bal, settings: res.settings } : bal,
          ),
        );
        toast("La Bal a bien été modifiée", { type: "success" });
      } catch (e: unknown) {
        console.error(e);
        if (e instanceof Error) {
          toast(e.message, { type: "error" });
        }
      }
    },
    [setBals],
  );

  const actionsBals = {
    delete(item: BaseLocaleType) {
      setBalToDeleted(item);
    },
    sync(item: BaseLocaleType) {
      setBalToSync(item);
    },
    toggleOtherBalPublishedIgnored(item: BaseLocaleType) {
      setOtherBalPublishedIgnored(item);
    },
    select(item: BaseLocaleType) {
      if (balSelected === item.id) {
        setBalSelected(null);
      } else {
        setBalSelected(item.id);
      }
    },
  };

  useEffect(() => {
    async function fetchSourcesMoissonneur() {
      const sources = await getSources();
      setSourcesMoissonneur(sources);
    }
    fetchSourcesMoissonneur().catch(console.error);
  }, []);

  useEffect(() => {
    fetchDataApiDepot().catch(console.error);
    fetchDataMoissonneur().catch(console.error);
    fetchBals(code, pageMesAdresses).catch(console.error);
  }, [code]);

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
        id="modal-deletion"
        title="Voulez vous vraiment supprimer cette BAL ?"
        item={balToDeleted}
        setItem={setBalToDeleted}
        onAction={onDeleteBal}
      />
      <ModalAlert
        id="modal-synchronisation-bal"
        title="Voulez vous vraiment synchroniser et publier cette BAL ?"
        item={balToSync}
        setItem={setBalToSync}
        onAction={onSyncBal}
      />
      <ModalAlert
        id="modal-synchronisation-revision"
        title="Voulez vous vraiment synchroniser et publier cette révision ?"
        item={revisionToSync}
        setItem={setRevisionToSync}
        onAction={onSyncRevision}
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
        lookup={lookup}
      />
      <EditableList
        headers={[
          "Id",
          "Client",
          "Status",
          "Date création",
          "Date mise à jour",
          "Emails",
          "Nombre numéros / certifiés",
          "Edition",
          "Import",
          "Actions",
        ]}
        caption="Bals mes adresses"
        data={bals}
        renderItem={BalsItem}
        page={{ ...pageMesAdresses, onPageChange: onPageMesAdressesChange }}
        actions={actionsBals}
        selectedItem={balSelected}
        createBtn={
          <Link href={`/communes/${code}/new`} passHref legacyBehavior>
            <Button iconId="fr-icon-add-line" className="fr-mb-2w">
              Nouvelle BAL
            </Button>
          </Link>
        }
      />
      <EditableList
        headers={["Source", "Date", "Nb lignes / erreurs", "Status"]}
        caption="Révisions Moissonneur"
        data={revisionsMoissoneur}
        renderItem={RevisionItemMoissoneur}
        page={{ ...pageMoissonneur, onPageChange: onPageMoissonneurChange }}
      />
      <EditableList
        headers={[
          "Id",
          "Client",
          "Status",
          "Validation",
          "Date création",
          "Date publication",
          "Fichier BAL",
          "Publication BAN",
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
    SignalementStatusEnum.PENDING,
  );
  const processedSignalementCount = await getSignalementCount(
    code,
    SignalementStatusEnum.PROCESSED,
  );
  const ignoredSignalementCount = await getSignalementCount(
    code,
    SignalementStatusEnum.IGNORED,
  );
  const expiredSignalementCount = await getSignalementCount(
    code,
    SignalementStatusEnum.EXPIRED,
  );

  const lookup = await fetchLookupCommune(code);

  const alerts = [];

  try {
    const res = await getCommuneAlerts(code);
    alerts.push(...res);
  } catch {}

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
      alerts,
      lookup,
    },
  };
}

export default CommuneSource;
