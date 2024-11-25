import { BalWidget } from "../server/lib/bal-widget/entity";

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";

export async function getBALWidgetConfig(): Promise<BalWidget> {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/bal-widget/config`
  );
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  const data = await response.json();

  return data as BalWidget;
}

export async function setBALWidgetConfig(
  payload: BalWidget
): Promise<BalWidget> {
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

  return data as BalWidget;
}
