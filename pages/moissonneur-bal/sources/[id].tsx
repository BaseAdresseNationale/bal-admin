import { useCallback, useRef, useState, useEffect } from "react";

import Button from "@codegouvfr/react-dsfr/Button";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Pagination from "react-js-pagination";

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
  AggregateRevisionMoissoneurType,
} from "types/moissoneur";
import Link from "next/link";

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
  const [revisions, setRevisions] = useState<AggregateRevisionMoissoneurType[]>(
    []
  );
  const [forcePublishRevisionStatus, setForcePublishRevisionStatus] = useState<
    string | null
  >(null);
  const interval = useRef<ReturnType<typeof setInterval> | undefined>();

  async function fetchCurrentRevision(sourceId) {
    setRevisionsIsLoading(true);
    const revisions: AggregateRevisionMoissoneurType[] =
      await getSourceLastUpdatedRevisions(sourceId);
    setRevisionsIsLoading(false);
    return revisions;
  }

  useEffect(() => {
    async function fetchData() {
      const initialRevisions = await fetchCurrentRevision(source._id);
      setRevisions(initialRevisions);
    }

    fetchData();
  }, [source._id]);

  const updateHarvest = useCallback(
    async (page) => {
      const { results, count } = await getSourceHarvests(
        source._id,
        limit,
        page
      );
      setHarvests(results);
      setTotalCount(count);
    },
    [source._id, setHarvests, setTotalCount]
  );

  const refresh = useCallback(async () => {
    async function update() {
      const freshSource = await getSource(source._id);
      setSource(freshSource);
      if (freshSource.harvesting.harvestingSince === null) {
        clearInterval(interval.current);
        updateHarvest(currentPage);
        const revisions = await fetchCurrentRevision(source._id);
        setRevisions(revisions);
      }
    }

    await update();
    interval.current = setInterval(async () => {
      await update();
    }, 5000);
  }, [source._id, currentPage, updateHarvest]);

  const onPageChange = useCallback(
    async (page) => {
      setCurrentPage(page);
      updateHarvest(page);
    },
    [setCurrentPage, updateHarvest]
  );

  const askHarvest = async () => {
    await harvestSource(source._id);
    await refresh();
  };

  const enabledSource = async () => {
    const updatedSource = await udpateSource(source._id, {
      enabled: !source.enabled,
    });
    setSource(updatedSource);
  };

  const onForcePublishRevision = async (id) => {
    setForcePublishRevisionStatus("loading");
    try {
      await publishRevision(id, { force: true });
      const updateRevisions = await fetchCurrentRevision(source._id);
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
            <CopyToClipBoard text={source._id} title="Id" />

            <ul className="fr-tags-group">
              <li>
                <p className="fr-tag">{source.license}</p>
              </li>
            </ul>
          </div>

          <div className="fr-col-2">
            <div className="fr-container">
              {source._deleted ? (
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
      <div className="fr-container">
        <h2>Organisation</h2>
        {source.organizationId ? (
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
          disabled={
            source.harvesting.harvestingSince !== null || !source.enabled
          }
          onClick={askHarvest}
        >
          {source.harvesting.harvestingSince !== null
            ? "Moissonnage en cours…"
            : "Lancer le moissonnage"}
        </Button>

        <div className="fr-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Début du moissonnage</th>
                <th scope="col">Fin du moissonnage</th>
                <th scope="col">État du moissonnage</th>
                <th scope="col">État de la mise à jour</th>
                <th scope="col">Fichier moissonné</th>
              </tr>
            </thead>

            <tbody>
              {harvests.map((harvest) => (
                <HarvestItem key={harvest._id} {...harvest} />
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
                  <th scope="col">Id</th>
                  <th scope="col">Commune</th>
                  <th scope="col">Date</th>
                  <th scope="col">Nombre de ligne / erreur</th>
                  <th scope="col">Status</th>
                  <th scope="col">Publication</th>
                  <th scope="col">Fichier</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {revisions.map((revision) => (
                  <RevisionItem
                    key={revision._id}
                    revision={revision}
                    onForcePublishRevision={() =>
                      onForcePublishRevision(revision._id)
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
  const organization: OrganizationMoissoneurType = await getOrganization(
    source.organizationId
  );
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
