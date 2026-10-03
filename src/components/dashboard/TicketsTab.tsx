"use client";

import { frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import { openSupportWidget } from "@/components/support-widget";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

type TicketStatus = "review" | "answered" | "closed";

const samples: Array<{ id: string; status: TicketStatus; at: string; subject: { fa: string; en: string } }> = [
  {
    id: "TK-2401",
    status: "review",
    at: "2026-10-01T10:00:00",
    subject: { fa: "دسترسی ویدیوی مذاکره بعد از ارتقای پلن", en: "Negotiation video access after the upgrade" },
  },
  {
    id: "TK-2388",
    status: "answered",
    at: "2026-09-22T14:20:00",
    subject: { fa: "کد تایید برای ورود به پنل", en: "Verification code for the dashboard" },
  },
  {
    id: "TK-2310",
    status: "closed",
    at: "2026-09-04T08:40:00",
    subject: { fa: "رسید کش‌بک خرید اشتراک", en: "Cashback receipt for the plan purchase" },
  },
];

export function TicketsTab() {
  const { copy, lang } = useI18n();
  const text = copy.dash;
  const { user } = useStore();
  const labels: Record<TicketStatus, string> = {
    review: text.ticketReview,
    answered: text.ticketAnswered,
    closed: text.ticketClosed,
  };
  const live = (user?.tickets ?? []).map((ticket) => ({
    id: ticket.id,
    status: "review" as const,
    at: ticket.at,
    subject: ticket.subject,
  }));
  const rows = [
    ...live.map((ticket) => ({ ...ticket, subjectText: ticket.subject })),
    ...samples.map((ticket) => ({ ...ticket, subjectText: ticket.subject[lang] })),
  ];

  function stamp(value: string) {
    return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(new Date(value));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{text.ticketsTitle}</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{text.ticketsLead}</p>
        </div>
        <button type="button" className="h-11 rounded-2xl px-4 text-sm font-medium" style={goldButtonStyle} onClick={() => openSupportWidget()}>
          {text.newTicket}
        </button>
      </div>
      <div className="grid gap-3">
        {rows.map((ticket) => (
          <article key={ticket.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-5" style={frostStyle}>
            <div>
              <p className="text-xs text-muted-foreground">{ticket.id}</p>
              <h2 className="mt-1 text-base font-semibold">{ticket.subjectText}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{stamp(ticket.at)}</p>
            </div>
            <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-medium text-[#0B132B]">{labels[ticket.status]}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
