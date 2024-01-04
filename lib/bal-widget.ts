import { BALWidgetConfig } from "../types/bal-widget";

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";

export async function getBALWidgetConfig() {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/bal-widget/config`
  );
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  const data = await response.json();

  return data as BALWidgetConfig;
}

export async function setBALWidgetConfig(payload) {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/bal-widget/config`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  const data = await response.json();

  return data as BALWidgetConfig;
}
