import React, { useState, useCallback, useEffect } from "react";
import Pagination from "react-js-pagination";
import { RevisionsRejectedBanItem } from "./revisions-rejected-ban-item";
import { getCurrentRevisions } from "@/lib/api-depot";
import { getCommuneAlerts } from "@/lib/api-ban";
import { PublicationBan } from "@/components/communes/publication-ban";
import Loader from "@/components/loader";
import type { Revision } from "types/api-depot.types";
import type { Alert } from "types/alerts.types";

const PAGE_LIMIT = 10;

type RevisionWithPublicationBan = Revision & {
  publicationBan: React.ReactNode;
};

interface RevisionsRejectedBanListProps {
  codeCommunes: string[];
}

export const RevisionsRejectedBanList = ({
  codeCommunes,
}: RevisionsRejectedBanListProps) => {
  const [revisions, setRevisions] = useState<RevisionWithPublicationBan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRevisions = useCallback(async () => {
    if (codeCommunes.length === 0) return;
    setIsLoading(true);
    try {
      const data = await getCurrentRevisions(codeCommunes);
      const alertsByCommune = await Promise.all(
        data.map((r) =>
          getCommuneAlerts(r.codeCommune).catch(() => [] as Alert[]),
        ),
      );
      const revisionsWithBan: RevisionWithPublicationBan[] = [...data]
        .reverse()
        .map((r) => ({
          ...r,
          publicationBan: (
            <PublicationBan revision={r} alerts={alertsByCommune[data.indexOf(r)]} />
          ),
        }));
      setRevisions(revisionsWithBan);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [codeCommunes]);

  useEffect(() => {
    fetchRevisions();
  }, [fetchRevisions]);

  const paginatedItems = revisions.slice(
    (currentPage - 1) * PAGE_LIMIT,
    currentPage * PAGE_LIMIT,
  );

  return (
    <Loader isLoading={isLoading}>
      <div className="fr-container">
        <div className="fr-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Code commune</th>
                <th scope="col">Client</th>
                <th scope="col">Publié le</th>
                <th scope="col">Fichier BAL</th>
                <th scope="col">Publication BAN</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((revision) => (
                <RevisionsRejectedBanItem
                  key={revision.codeCommune}
                  {...revision}
                />
              ))}
            </tbody>
          </table>
          {revisions.length > PAGE_LIMIT && (
            <div className="pagination fr-mx-auto fr-my-2w">
              <nav
                role="navigation"
                className="fr-pagination"
                aria-label="Pagination"
              >
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={PAGE_LIMIT}
                  totalItemsCount={revisions.length}
                  pageRangeDisplayed={5}
                  onChange={setCurrentPage}
                  innerClass="fr-pagination__list"
                  activeLinkClass=""
                  linkClass="fr-pagination__link"
                  linkClassFirst="fr-pagination__link--first"
                  linkClassPrev="fr-pagination__link--prev fr-pagination__link--lg-label"
                  linkClassNext="fr-pagination__link--next fr-pagination__link--lg-label"
                  linkClassLast="fr-pagination__link--last"
                />
              </nav>
            </div>
          )}
        </div>
      </div>
    </Loader>
  );
};
