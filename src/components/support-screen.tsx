"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { AccountGate } from "@/components/account-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { assistantPrompts, assistantReply } from "@/lib/assistant";
import { faDate } from "@/lib/format";
import { supportSla } from "@/lib/plans";
import { useStore } from "@/lib/store";

type ChatMessage = { role: "user" | "assistant"; text: string };

export function SupportScreen() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">پشتیبانی</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          انسان برای پروندهٔ واقعی شما، و دستیار برای تمرین جمله و سناریو.
        </p>
      </header>
      <Tabs defaultValue="human">
        <TabsList className="h-auto w-full sm:w-fit">
          <TabsTrigger value="human" className="px-3 py-2">
            پشتیبان انسانی
          </TabsTrigger>
          <TabsTrigger value="ai" className="px-3 py-2">
            دستیار هوش مصنوعی
          </TabsTrigger>
        </TabsList>
        <TabsContent value="human" className="mt-4">
          <HumanSupport />
        </TabsContent>
        <TabsContent value="ai" className="mt-4">
          <AiSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HumanSupport() {
  return (
    <AccountGate title="پشتیبان انسانی">
      <HumanForm />
    </AccountGate>
  );
}

function HumanForm() {
  const { user, addTicket } = useStore();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  if (!user) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    const error = addTicket(subject, body);
    if (error) {
      toast.error(error);
      return;
    }
    setSubject("");
    setBody("");
    toast.success("درخواست برای پشتیبان ثبت شد.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submit} className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
        <p className="text-sm leading-7 text-muted-foreground">{supportSla(user.plan)}</p>
        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="subject">موضوع</Label>
            <Input id="subject" value={subject} onChange={(event) => setSubject(event.target.value)} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="body">شرح سناریو</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="min-h-32"
              placeholder="جملهٔ مشتری و جایی که گیر کرده‌اید را بنویسید."
            />
          </div>
          <Button type="submit" className="h-10">
            ثبت درخواست
          </Button>
        </div>
      </form>
      <div className="space-y-3">
        {user.tickets.length === 0 ? (
          <div className="rounded-3xl bg-secondary/70 p-5 text-sm leading-7">
            هنوز درخواستی ندارید. یک اعتراض واقعی از تماس یا دایرکت این هفته را بفرستید.
          </div>
        ) : (
          user.tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-medium">{ticket.subject}</h2>
                <time className="text-xs text-muted-foreground">{faDate(ticket.at)}</time>
              </div>
              <p className="mt-2 text-sm leading-7">{ticket.body}</p>
              <p className="mt-3 rounded-2xl bg-secondary px-3 py-2 text-sm leading-7">{ticket.reply}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function AiSupport() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "سلام. جملهٔ مشتری را بفرستید تا یک پاسخ کوتاه و قابل گفتن پیشنهاد بدهم.",
    },
  ]);
  const [draft, setDraft] = useState("");

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const reply = assistantReply(clean);
    setMessages((current) => [
      ...current,
      { role: "user", text: clean },
      { role: "assistant", text: reply },
    ]);
    setDraft("");
  }

  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        {assistantPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="rounded-full bg-secondary px-3 py-1 text-xs"
            onClick={() => send(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="max-h-[28rem] space-y-3 overflow-y-auto pe-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={
              message.role === "user"
                ? "ms-8 rounded-2xl bg-primary px-4 py-3 text-sm leading-7 whitespace-pre-wrap text-primary-foreground"
                : "me-8 rounded-2xl bg-secondary px-4 py-3 text-sm leading-7 whitespace-pre-wrap"
            }
          >
            {message.text}
          </div>
        ))}
      </div>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="مثلاً: مشتری گفت برام بفرستید بررسی کنم"
          className="h-10"
        />
        <Button type="submit" className="h-10 px-4">
          ارسال
        </Button>
      </form>
    </div>
  );
}
