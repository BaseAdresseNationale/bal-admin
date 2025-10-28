export interface Alert {
  id: string;
  revisionId: string;
  status: "error" | "success" | "info" | "warning";
  districtName: string;
  message: string;
  createdAt: string;
}
