import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { BLockedRevisionItem } from "./blocked-revisions-item";
import { getRevision } from "@/lib/api-depot";
import Loader from "@/components/loader";
import { Revision } from "types/api-depot.types";

const PAGE_LIMIT = 10;

interface BlockedRevisionsListProps {
  blockedRevisions: string[];
}

export const BlockedRevisionsList = ({
  blockedRevisions,
}: BlockedRevisionsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pageIds = blockedRevisions.slice(
      (currentPage - 1) * PAGE_LIMIT,
      currentPage * PAGE_LIMIT,
    );
    if (pageIds.length === 0) {
      setRevisions([]);
      return;
    }
    setIsLoading(true);
    Promise.all(pageIds.map((id) => getRevision(id)))
      .then(setRevisions)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [blockedRevisions, currentPage]);

  return (
    <Loader isLoading={isLoading}>
      <div className="fr-container">
        <div className="fr-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Code commune</th>
                <th scope="col">Client</th>
                <th scope="col">Créé le</th>
                <th scope="col">Fichier</th>
                <th scope="col">Validation</th>
              </tr>
            </thead>
            <tbody>
              {revisions.map((item) => (
                <BLockedRevisionItem key={item.codeCommune} {...item} />
              ))}
            </tbody>
          </table>
          <div className="pagination fr-mx-auto fr-my-2w">
            <nav
              role="navigation"
              className="fr-pagination"
              aria-label="Pagination"
            >
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={PAGE_LIMIT}
                totalItemsCount={blockedRevisions.length}
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
        </div>
      </div>
    </Loader>
  );
};
