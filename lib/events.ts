import type { EventType } from "types/event";

// eslint-disable-next-line @typescript-eslint/naming-convention
const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";

async function processResponse(response) {
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  return response.json();
}

export async function getEvent(id: string) {
  const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/${id}`);
  const event = await processResponse(response);

  return event as EventType;
}

export async function getEvents() {
  const url = new URL(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events`);

  const response = await fetch(url);
  const events = await processResponse(response);

  return events as EventType[];
}

export async function createEvent(payload) {
  const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const event = await processResponse(response);

  return event as EventType;
}

export async function updateEvent(id: string, payload) {
  const url = new URL(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/${id}`);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const event = await processResponse(response);

  return event as EventType;
}

export async function deleteEvent(id: string) {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/${id}`,
    {
      method: "DELETE",
    }
  );
  const isDeleted = await processResponse(response);

  return isDeleted as boolean;
}
