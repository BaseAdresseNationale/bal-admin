import { EventDTO } from "server/lib/events/dto";
import type { Event } from "../server/lib/events/entity";
import { Participant } from "server/lib/participant/entity";

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "http://localhost:3000";

async function processResponse(response) {
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  return response.json();
}

export async function getEvent(id: string): Promise<Event> {
  const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/${id}`);
  const event = await processResponse(response);

  return event as Event;
}

export async function getEventParticipants(id: string): Promise<Participant[]> {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/${id}/participants`
  );
  const participants = await processResponse(response);

  return participants as Participant[];
}

export async function getEvents(): Promise<Event[]> {
  const url = new URL(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events`);

  const response = await fetch(url);
  const events = await processResponse(response);

  return events as Event[];
}

export async function massImportEvents(payload): Promise<Event[]> {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/mass-import`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    }
  );
  const event = await processResponse(response);

  return event as Event[];
}

export async function createEvent(payload: EventDTO): Promise<Event> {
  const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const event = await processResponse(response);

  return event as Event;
}

export async function updateEvent(
  id: string,
  payload: EventDTO
): Promise<Event> {
  const url = new URL(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/${id}`);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const event = await processResponse(response);

  return event as Event;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const response = await fetch(
    `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events/${id}`,
    {
      method: "DELETE",
    }
  );
  const isDeleted = await processResponse(response);

  return isDeleted as boolean;
}
