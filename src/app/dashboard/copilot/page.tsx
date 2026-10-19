import type { Metadata } from "next";
import { CopilotHud } from "@/components/copilot/CopilotHud";

export const metadata: Metadata = {
  title: "دستیار زنده فروش | نکس‌سل",
  description: "اعتراض تماس را بشنوید و جملهٔ آمادهٔ گفتن را همان لحظه ببینید.",
};

export default function CopilotPage() {
  return <CopilotHud />;
}
