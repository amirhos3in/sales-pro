import { mockAnalysisData, type CallAudit } from "@/lib/mockAnalysisData";

export type AuditRecord = {
  id: string;
  at: string;
  title: { fa: string; en: string };
  audit: CallAudit;
};

function withScore(score: number, strengthFa: string, strengthEn: string): CallAudit {
  return {
    ...mockAnalysisData,
    overallScore: score,
    strengths: [{ fa: strengthFa, en: strengthEn }, ...mockAnalysisData.strengths.slice(1)],
  };
}

export const auditHistory: AuditRecord[] = [
  {
    id: "call-82",
    at: "2026-10-01T16:40:00",
    title: { fa: "تماس پیگیری قیمت", en: "Price follow-up call" },
    audit: mockAnalysisData,
  },
  {
    id: "call-74",
    at: "2026-09-24T11:15:00",
    title: { fa: "تماس معرفی محصول", en: "Product introduction call" },
    audit: withScore(
      74,
      "لحن شروع آرام بود و نام خریدار را درست گفتید.",
      "The opening tone was calm and you used the buyer’s name correctly.",
    ),
  },
  {
    id: "call-91",
    at: "2026-09-18T09:05:00",
    title: { fa: "مذاکره تمدید قرارداد", en: "Renewal negotiation" },
    audit: withScore(
      91,
      "بستن تماس روز و صاحب قدم بعدی را مشخص کرد.",
      "The close named the day and the owner of the next step.",
    ),
  },
];
