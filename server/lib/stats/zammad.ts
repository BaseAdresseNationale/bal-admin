import { format, parseISO, eachMonthOfInterval } from "date-fns";

const ZAMMAD_URL =
  process.env.ZAMMAD_URL ||
  "https://zammad.base-adresse-locale.incubateur.anct.gouv.fr";
const ZAMMAD_TOKEN = process.env.ZAMMAD_TOKEN;

const PER_PAGE = 100;
const CONCURRENCY = 10;

export type ZammadMonthlyStat = {
  month: string;
  opened: number;
  closed: number;
  pending: number;
};

export type ZammadStat = {
  months: ZammadMonthlyStat[];
  totalTickets: number;
  totalMessages: number;
};

type ZammadTicketDates = {
  created_at: string;
  close_at: string | null;
  article_count: number;
};

function assertZammadConfigured() {
  if (!ZAMMAD_TOKEN) {
    throw new Error("Configuration Zammad incomplète : ZAMMAD_TOKEN est requis");
  }
}

async function fetchZammadTicketsPage(page: number): Promise<any[]> {
  const response = await fetch(
    `${ZAMMAD_URL}/api/v1/tickets?page=${page}&per_page=${PER_PAGE}`,
    { headers: { Authorization: `Token token=${ZAMMAD_TOKEN}` } },
  );
  if (!response.ok) {
    throw new Error(
      `Zammad API GET /tickets?page=${page} failed (${response.status}): ${await response.text()}`,
    );
  }
  return response.json();
}

export async function fetchAllZammadTickets(): Promise<ZammadTicketDates[]> {
  assertZammadConfigured();

  const tickets: ZammadTicketDates[] = [];
  let page = 1;
  let reachedEnd = false;

  while (!reachedEnd) {
    const pagesToFetch = Array.from({ length: CONCURRENCY }, (_, i) => page + i);
    const batches = await Promise.all(
      pagesToFetch.map((p) => fetchZammadTicketsPage(p)),
    );

    for (const batch of batches) {
      for (const ticket of batch) {
        tickets.push({
          created_at: ticket.created_at,
          close_at: ticket.close_at,
          article_count: ticket.article_count || 0,
        });
      }
      if (batch.length < PER_PAGE) {
        reachedEnd = true;
      }
    }

    page += CONCURRENCY;
  }

  return tickets;
}

export function computeZammadMonthlyStat(
  tickets: ZammadTicketDates[],
): ZammadMonthlyStat[] {
  if (tickets.length === 0) {
    return [];
  }

  const openedByMonth: Record<string, number> = {};
  const closedByMonth: Record<string, number> = {};
  let firstDate = parseISO(tickets[0].created_at);

  for (const ticket of tickets) {
    const createdAt = parseISO(ticket.created_at);
    if (createdAt < firstDate) {
      firstDate = createdAt;
    }

    const openedMonth = format(createdAt, "yyyy-MM");
    openedByMonth[openedMonth] = (openedByMonth[openedMonth] || 0) + 1;

    if (ticket.close_at) {
      const closedMonth = format(parseISO(ticket.close_at), "yyyy-MM");
      closedByMonth[closedMonth] = (closedByMonth[closedMonth] || 0) + 1;
    }
  }

  const months = eachMonthOfInterval({ start: firstDate, end: new Date() }).map(
    (date) => format(date, "yyyy-MM"),
  );

  let cumulOpened = 0;
  let cumulClosed = 0;

  return months.map((month) => {
    cumulOpened += openedByMonth[month] || 0;
    cumulClosed += closedByMonth[month] || 0;
    return {
      month,
      opened: openedByMonth[month] || 0,
      closed: closedByMonth[month] || 0,
      pending: cumulOpened - cumulClosed,
    };
  });
}

export function computeZammadStat(tickets: ZammadTicketDates[]): ZammadStat {
  return {
    months: computeZammadMonthlyStat(tickets),
    totalTickets: tickets.length,
    totalMessages: tickets.reduce((sum, t) => sum + t.article_count, 0),
  };
}
