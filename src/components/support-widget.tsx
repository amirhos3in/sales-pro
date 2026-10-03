"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n, type Lang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const OPEN_SUPPORT_EVENT = "nexsell-open-support";

export function openSupportWidget() {
  window.dispatchEvent(new CustomEvent(OPEN_SUPPORT_EVENT));
}

type Chat = { id: string; role: "user" | "assistant"; text: string };
type TicketNote = { id: string; text: string };

function aiAnswer(message: string, lang: Lang) {
  const q = message.toLowerCase();
  const pricing = /price|plan|vip|gold|upgrade|قیمت|پلن|طلا|خرید|ویژه/.test(q);
  const quiz = /quiz|challenge|unlock|lock|چالش|قفل|کوییز|آزمون/.test(q);
  const video = /video|aparat|film|ویدیو|فیلم|آپارات/.test(q);
  if (lang === "en") {
    if (pricing) return "Gold and VIP both open the four specialist paths. The practice checkout does not charge a real card. Lesson challenges still unlock the next film.";
    if (quiz) return "Each lesson has three questions. All three must be correct. A miss keeps the next video locked until you retry and pass.";
    if (video) return "Films play from Aparat. When the film ends, confirm viewing, then start the lesson challenge. Free training does not need a paid plan.";
    return "I can help with paths, locked videos, Gold or VIP, and the three-question challenge. Ask in one sentence.";
  }
  if (pricing) return "پلن طلایی و VIP هر چهار مسیر تخصصی را باز می‌کنند. درگاه آزمایشی است و کارت واقعی کشیده نمی‌شود. چالش هر درس هنوز برای ویدیوی بعدی لازم است.";
  if (quiz) return "هر درس سه سوال دارد و هر سه باید درست باشد. اگر رد شوید ویدیوی بعدی قفل می‌ماند تا تلاش مجدد قبول شود.";
  if (video) return "فیلم از آپارات پخش می‌شود. بعد از پایان، مشاهده را تایید کنید و بعد به چالش همان درس بروید. آموزش رایگان پلن نمی‌خواهد.";
  return "درباره مسیر دوره، قفل ویدیو، قیمت پلن یا قانون چالش بپرسید. یک جمله کافی است.";
}

export function SupportWidget() {
  const { copy, lang } = useI18n();
  const { user, addTicket } = useStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"ai" | "human">("ai");
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [tickets, setTickets] = useState<TicketNote[]>([]);
  const chatReady = Boolean(user) || started;
  const shownName = user ? `${user.firstName} ${user.lastName}`.trim() : name;
  const shownPhone = user?.phone || phone;

  function pushAssistant(text: string) {
    setTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", text },
      ]);
      setTyping(false);
    }, 700);
  }

  function begin(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3 || phone.trim().length < 8 || topic.trim().length < 2 || description.trim().length < 4) {
      toast.error(copy.support.empty);
      return;
    }
    setStarted(true);
    const text = `${topic}: ${description}`;
    setMessages([{ id: crypto.randomUUID(), role: "user", text }]);
    pushAssistant(aiAnswer(text, lang));
  }

  function sendAi(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text }]);
    pushAssistant(aiAnswer(text, lang));
  }

  function sendHuman(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (text.length < 4) return;
    setDraft("");
    let id = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    if (user && text.length >= 8) {
      const result = addTicket(topic.trim() || (lang === "fa" ? "پشتیبانی" : "Support"), text);
      if (result.id) id = result.id;
    }
    setTickets((current) => [{ id, text }, ...current]);
  }

  const eta = user?.premiumTier === "vip" ? copy.support.etaVip : copy.support.eta;

  useEffect(() => {
    const openPanel = () => {
      setOpen(true);
      setTab("human");
    };
    window.addEventListener(OPEN_SUPPORT_EVENT, openPanel);
    return () => window.removeEventListener(OPEN_SUPPORT_EVENT, openPanel);
  }, []);

  return (
    <div className="print-hide fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {open ? (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass mb-3 flex h-[32rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-3xl shadow-2xl"
          >
            <header className="border-b border-[color:var(--glass-border)] px-4 py-3">
              <h2 className="font-semibold">{copy.support.title}</h2>
              {chatReady ? (
                <p className="text-xs text-muted-foreground">{shownName}</p>
              ) : (
                <p className="text-xs leading-5 text-muted-foreground">{copy.support.guest}</p>
              )}
            </header>
            {chatReady ? (
              <>
                <div className="grid grid-cols-2 gap-1 p-2">
                  {(["ai", "human"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTab(item)}
                      className={`rounded-2xl px-2 py-2 text-xs ${
                        tab === item
                          ? "bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item === "ai" ? copy.support.ai : copy.support.human}
                    </button>
                  ))}
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-2">
                  {tab === "ai" ? (
                    <>
                      {messages.length === 0 ? (
                        <p className="rounded-2xl bg-foreground/5 px-3 py-2 text-sm leading-6">{copy.support.hello}</p>
                      ) : null}
                      {messages.map((message) => (
                        <p
                          key={message.id}
                          className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                            message.role === "user"
                              ? "ms-auto bg-[#D4AF37] text-[#0B132B]"
                              : "bg-foreground/5"
                          }`}
                        >
                          {message.text}
                        </p>
                      ))}
                      {typing ? <p className="text-xs text-muted-foreground">{copy.support.typing}</p> : null}
                    </>
                  ) : (
                    <>
                      {tickets.map((ticket) => (
                        <article key={ticket.id} className="rounded-2xl bg-foreground/5 p-3 text-sm leading-6">
                          <p className="font-semibold">#{ticket.id}</p>
                          <p className="mt-1">{copy.support.ticketOk}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{ticket.text}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                            <span className="rounded-full bg-[#6366F1]/15 px-2 py-1 text-[#8B5CF6]">{copy.support.status}</span>
                            <span className="rounded-full px-2 py-1 ring-1 ring-[color:var(--glass-border)]">{eta}</span>
                          </div>
                        </article>
                      ))}
                    </>
                  )}
                </div>
                <form onSubmit={tab === "ai" ? sendAi : sendHuman} className="flex gap-2 border-t border-[color:var(--glass-border)] p-3">
                  <Input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={copy.support.placeholder}
                    className="h-10"
                  />
                  <Button type="submit" size="icon" className="size-10 bg-[#D4AF37] text-[#0B132B] hover:bg-[#E5C07B]" aria-label={copy.support.send}>
                    <Send />
                  </Button>
                </form>
              </>
            ) : (
              <form onSubmit={begin} className="space-y-2 overflow-y-auto p-4">
                <label className="block space-y-1 text-xs">
                  <span>{copy.support.name}</span>
                  <Input value={shownName} onChange={(event) => setName(event.target.value)} className="h-10" />
                </label>
                <label className="block space-y-1 text-xs">
                  <span>{copy.support.phone}</span>
                  <Input dir="ltr" value={shownPhone} onChange={(event) => setPhone(event.target.value)} className="h-10 text-left" />
                </label>
                <label className="block space-y-1 text-xs">
                  <span>{copy.support.topic}</span>
                  <Input value={topic} onChange={(event) => setTopic(event.target.value)} className="h-10" />
                </label>
                <label className="block space-y-1 text-xs">
                  <span>{copy.support.description}</span>
                  <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
                </label>
                <Button type="submit" className="h-10 w-full bg-[#D4AF37] text-[#0B132B] hover:bg-[#E5C07B]">
                  {copy.support.start}
                </Button>
              </form>
            )}
          </motion.section>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={copy.support.button}
        className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] text-white shadow-2xl shadow-[#6366F1]/40"
      >
        <Headphones />
      </button>
    </div>
  );
}
