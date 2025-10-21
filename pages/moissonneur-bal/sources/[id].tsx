import { useCallback, useRef, useState, useEffect } from "react";

import Button from "@codegouvfr/react-dsfr/Button";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Pagination from "react-js-pagination";
import { keyBy } from "lodash";

import {
  getSource,
  udpateSource,
  getSourceHarvests,
  harvestSource,
  publishRevision,
  getOrganization,
  getSourceLastUpdatedRevisions,
} from "@/lib/api-moissonneur-bal";

import Loader from "@/components/loader";
import CopyToClipBoard from "@/components/copy-to-clipboard";
import HarvestItem from "@/components/moissonneur-bal/harvest-item";
import RevisionItem from "@/components/moissonneur-bal/revision-item";
import {
  HarvestMoissonneurType,
  SourceMoissoneurType,
  RevisionMoissoneurType,
  OrganizationMoissoneurType,
} from "types/moissoneur";
import Link from "next/link";
import { Revision } from "types/api-depot.types";
import { getCurrentRevisions } from "@/lib/api-depot";
import { SignalementEnabledListKeys } from "types/signalement.types";
import { ToggleSignalementEnabledList } from "@/components/toggle-signalement-enabled-list";

const limit = 10;

interface MoissoneurSourceProps {
  initialSource: SourceMoissoneurType;
  initialHarvests: HarvestMoissonneurType[];
  initialTotalCount: number;
  organization: OrganizationMoissoneurType;
}

const MoissoneurSource = ({
  initialSource,
  initialHarvests,
  initialTotalCount,
  organization,
}: MoissoneurSourceProps) => {
  const [source, setSource] = useState<SourceMoissoneurType>(initialSource);
  const [harvests, setHarvests] =
    useState<HarvestMoissonneurType[]>(initialHarvests);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [revisionsIsLoading, setRevisionsIsLoading] = useState<boolean>(false);
  const [revisions, setRevisions] = useState<RevisionMoissoneurType[]>([]);
  const [indexRevisions, setIndexRevisions] = useState<
    Record<string, Revision>
  >({});
  const [forcePublishRevisionStatus, setForcePublishRevisionStatus] = useState<
    string | null
  >(null);
  const interval = useRef<ReturnType<typeof setInterval> | undefined>();

  async function fetchCurrentRevision(sourceId) {
    setRevisionsIsLoading(true);
    const revisions: RevisionMoissoneurType[] =
      await getSourceLastUpdatedRevisions(sourceId);
    const revisionsApiDepot = await getCurrentRevisions(
      revisions.map((revision) => revision.codeCommune)
    );
    setIndexRevisions(keyBy(revisionsApiDepot, "codeCommune"));
    setRevisionsIsLoading(false);
    return revisions;
  }

  useEffect(() => {
    async function fetchData() {
      const initialRevisions = await fetchCurrentRevision(source.id);
      setRevisions(initialRevisions);
    }

    fetchData();
  }, [source.id]);

  const updateHarvest = useCallback(
    async (page) => {
      const { results, count } = await getSourceHarvests(
        source.id,
        limit,
        page
      );
      setHarvests(results);
      setTotalCount(count);
    },
    [source.id, setHarvests, setTotalCount]
  );

  const refresh = useCallback(async () => {
    async function update() {
      const freshSource = await getSource(source.id);
      setSource(freshSource);
      if (freshSource.harvestingSince === null) {
        clearInterval(interval.current);
        updateHarvest(currentPage);
        const revisions = await fetchCurrentRevision(source.id);
        setRevisions(revisions);
      }
    }

    await update();
    interval.current = setInterval(async () => {
      await update();
    }, 5000);
  }, [source.id, currentPage, updateHarvest]);

  const onPageChange = useCallback(
    async (page) => {
      setCurrentPage(page);
      updateHarvest(page);
    },
    [setCurrentPage, updateHarvest]
  );

  const askHarvest = async () => {
    await harvestSource(source.id);
    await refresh();
  };

  const enabledSource = async () => {
    const updatedSource = await udpateSource(source.id, {
      enabled: !source.enabled,
    });
    setSource(updatedSource);
  };

  const onForcePublishRevision = async (id) => {
    setForcePublishRevisionStatus("loading");
    try {
      await publishRevision(id, { force: true });
      const updateRevisions = await fetchCurrentRevision(source.id);
      setRevisions(updateRevisions);
      setForcePublishRevisionStatus("success");
    } catch (err) {
      console.error(err);
      setForcePublishRevisionStatus("error");
    }
  };

  return (
    <>
      <div className="fr-container fr-py-12v">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-10">
            <h1>{source.title}</h1>
            <CopyToClipBoard text={source.id} title="Id" />

            <ul className="fr-tags-group">
              <li>
                <p className="fr-tag">{source.license}</p>
              </li>
            </ul>
          </div>

          <div className="fr-col-2">
            <div className="fr-container">
              {source.deletedAt ? (
                <Badge
                  severity="error"
                  style={{ marginRight: 2, marginBottom: 2 }}
                >
                  Supprimé
                </Badge>
              ) : source.enabled ? (
                <Badge
                  severity="success"
                  style={{ marginRight: 2, marginBottom: 2 }}
                >
                  Activé
                </Badge>
              ) : (
                <Badge
                  severity="error"
                  style={{ marginRight: 2, marginBottom: 2 }}
                >
                  Désactivé
                </Badge>
              )}
              <div className="fr-toggle">
                <input
                  type="checkbox"
                  className="fr-toggle__input"
                  aria-describedby="toggle-source-hint-text"
                  id="toggle-source"
                  checked={source.enabled}
                  onChange={enabledSource}
                />
                <label
                  className="fr-toggle__label"
                  htmlFor="toggle-source"
                  data-fr-checked-label="Activé"
                  data-fr-unchecked-label="Désactivé"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fr-container">
        <p>{source.description}</p>
      </div>
      <div className="fr-container" style={{ marginBottom: "2rem" }}>
        <ToggleSignalementEnabledList
          listKey={SignalementEnabledListKeys.SOURCES_MOISSONNEUR_ENABLED}
          id={source.id}
        />
      </div>
      <div className="fr-container">
        <h2>Organisation</h2>
        {organization && source.organizationId ? (
          <Link
            href={{
              pathname: `/moissonneur-bal/organizations/${source.organizationId}`,
            }}
          >
            {organization.name}
          </Link>
        ) : (
          <div>Aucune information</div>
        )}
      </div>

      <div className="fr-container fr-my-12v">
        <h2>Moissonnages</h2>

        <Button
          disabled={source.harvestingSince !== null || !source.enabled}
          onClick={askHarvest}
        >
          {source.harvestingSince !== null
            ? "Moissonnage en cours…"
            : "Lancer le moissonnage"}
        </Button>

        <div className="fr-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Début du moissonnage</th>
                <th scope="col">Fin du moissonnage</th>
                <th scope="col">status</th>
                <th scope="col">Fichier moissonné</th>
              </tr>
            </thead>

            <tbody>
              {harvests.map((harvest) => (
                <HarvestItem key={harvest.id} {...harvest} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination fr-mx-auto fr-my-2w">
          <nav
            role="navigation"
            className="fr-pagination"
            aria-label="Pagination"
          >
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={limit}
              totalItemsCount={totalCount}
              pageRangeDisplayed={5}
              onChange={onPageChange}
              innerClass="fr-pagination__list"
              activeLinkClass=""
              linkClass="fr-pagination__link"
              linkClassFirst="fr-pagination__link--first"
              linkClassPrev="fr-pagination__link--prev"
              linkClassNext="fr-pagination__link--next"
              linkClassLast="fr-pagination__link--last"
            />
          </nav>
        </div>
      </div>

      <div className="fr-container fr-my-12v">
        <h2>Révisions par commune</h2>
        <Loader isLoading={revisionsIsLoading}>
          {revisions.length === 0 && <div>Aucune révisions</div>}

          {forcePublishRevisionStatus === "error" && (
            <Alert
              title="Erreur"
              description="La publication de la révision a échoué"
              severity="error"
              closable
              small
            />
          )}
          {forcePublishRevisionStatus === "success" && (
            <Alert
              title="Succès"
              description="La révision a bien été publiée"
              severity="success"
              closable
              small
            />
          )}

          <div className="fr-table">
            <table>
              <thead>
                <tr>
                  <th scope="col">Commune</th>
                  <th scope="col">Date</th>
                  <th scope="col">Nombre de ligne / erreur</th>
                  <th scope="col">Status</th>
                  <th scope="col">Fichier</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {revisions.map((revision) => (
                  <RevisionItem
                    key={revision.id}
                    revision={revision}
                    revisionApiDepot={indexRevisions[revision.codeCommune]}
                    onForcePublishRevision={() =>
                      onForcePublishRevision(revision.id)
                    }
                    isForcePublishRevisionLoading={
                      forcePublishRevisionStatus === "loading"
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Loader>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  const source: SourceMoissoneurType = await getSource(params.id);
  let organization: OrganizationMoissoneurType = null;
  try {
    organization = await getOrganization(source.organizationId);
  } catch (err) {
    console.error(err);
  }

  const { results, count } = await getSourceHarvests(params.id, limit);
  return {
    props: {
      initialSource: source,
      initialHarvests: results,
      initialTotalCount: count,
      organization: organization,
    },
  };
}

export default MoissoneurSource;
