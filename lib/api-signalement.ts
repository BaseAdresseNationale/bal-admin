import { SignalementStatusEnum } from "types/signalement.types";

export const getSignalementCount = async (
  code: string,
  status: SignalementStatusEnum
): Promise<number> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_SIGNALEMENT_URL}/signalements`
  );
  url.searchParams.append("codeCommunes", code);
  url.searchParams.append("status", status);
  url.searchParams.append("limit", "1");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching signalement count: ${response.statusText}`);
  }

  const data = await response.json();

  return data.total;
};
