import { useDashboardData } from "@/hooks/dashboard-data";
import { RevisionsRejectedBanList } from "./revisions-rejected-ban/revisions-rejected-ban-list";
import Loader from "../loader";
import { LastsRevisionsPendingList } from "./lasts-revisions-pending/lasts-revisions-pending-list";

const BlockedBals = () => {
  const { dashboardData, isLoading } = useDashboardData();

  return (
    <div className="fr-container fr-my-4w">
      <Loader isLoading={isLoading}>
        <h3 style={{ paddingTop: "16px" }}>Révisions rejetées par la BAN</h3>
        <RevisionsRejectedBanList
          codeCommunes={dashboardData.nbCommunesStillWithBanErrors}
        />
        <h3 style={{ paddingTop: "16px" }}>Dernières révisions en attentes</h3>
        <LastsRevisionsPendingList />
      </Loader>
    </div>
  );
};

export default BlockedBals;
