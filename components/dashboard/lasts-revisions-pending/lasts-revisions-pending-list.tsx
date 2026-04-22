import React, { useState, useCallback, useEffect } from "react";
import Pagination from "react-js-pagination";
import { LastRevisionPendingItem } from "./lasts-revisions-pending-item";
import { getLastsRevisionsPending } from "@/lib/api-depot";
import Loader from "@/components/loader";
import { LastsRevisionsPending } from "types/api-depot.types";

export const LastsRevisionsPendingList = ({}) => {
  const [page, setPage] = useState({
    limit: 10,
    total: 0,
    page: 1,
  });
  const [revisions, setRevisions] = useState<LastsRevisionsPending[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLastsRevisionsPending = useCallback(async (newPage: any) => {
    setIsLoading(true);
    try {
      const { result, total } = await getLastsRevisionsPending(newPage);
      setRevisions(result);
      setPage((p) => ({
        ...p,
        total,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLastsRevisionsPending(page);
  }, []);

  const onPageChange = (nextPage: number) => {
    const newPage = {
      ...page,
      page: nextPage,
    };
    setPage(newPage);
    fetchLastsRevisionsPending(newPage).catch(console.error);
  };

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
                <th scope="col">Validation</th>
              </tr>
            </thead>
            <tbody>
              {revisions.map((item) => (
                <LastRevisionPendingItem key={item.codeCommune} {...item} />
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
                activePage={page.page}
                itemsCountPerPage={page.limit}
                totalItemsCount={page.total}
                pageRangeDisplayed={5}
                onChange={onPageChange}
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
