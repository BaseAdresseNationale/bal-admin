import {
  SignalementCommuneSettings,
  SignalementEnabledListKeys,
  SignalementSource,
  SignalementStatusEnum,
} from "types/signalement.types";

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

export const getSignalementSources = async (): Promise<SignalementSource[]> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_SIGNALEMENT_URL}/sources`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error fetching signalement sources : ${response.statusText}`
    );
  }

  const sources = await response.json();

  return sources;
};

export const getIsInSignalementEnabledList = async (
  listKey: SignalementEnabledListKeys,
  id: string
): Promise<boolean> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_SIGNALEMENT_URL}/settings/enabled-list/${listKey}/${id}`
  );

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error fetching signalement is in enabled list: ${response.statusText}`
    );
  }

  const isEnabled = await response.json();

  return isEnabled;
};

export const putIsInSignalementEnabledList = async (
  listKey: SignalementEnabledListKeys,
  id: string,
  enabled: boolean
): Promise<void> => {
  const response = await fetch(
    `/api/proxy-api-signalement/settings/enabled-list/${listKey}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        enabled,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Error updating enabled list: ${response.statusText}`);
  }
};

export const getSignalementCommuneSettings = async (
  code: string
): Promise<SignalementCommuneSettings> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_SIGNALEMENT_URL}/settings/commune-settings/${code}`
  );

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching commune settings : ${response.statusText}`);
  }

  const settings = await response.json();

  return settings;
};

export const postSignalementCommuneSettings = async (
  codeCommune: string,
  communeSettings: SignalementCommuneSettings
): Promise<void> => {
  const response = await fetch(
    `/api/proxy-api-signalement/settings/commune-settings/${codeCommune}`,
    {
      method: "POST",
      body: JSON.stringify(communeSettings),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Error updating commune settings: ${response.statusText}`);
  }
};
