"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { avatarChoice, avatarChoices, frostStyle, goldButtonStyle } from "@/components/dashboard/style";
import { useAuth, type AcademyUser } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";
import { phoneKey, validPhone } from "@/lib/store";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-2xl border border-[#D4AF37]/35 bg-white/80 px-3 text-sm text-[#0B132B] outline-none focus:border-[#D4AF37] dark:bg-[#0B132B]/55 dark:text-[#F6F1E4]";

function draftFrom(user: AcademyUser) {
  return {
    name: user.name,
    phone: user.phone,
    email: user.email ?? "",
    jobTitle: user.jobTitle,
    bio: user.bio,
    avatarId: user.avatarId ?? "navy",
  };
}

export function ProfileTab({ user }: { user: AcademyUser }) {
  const { copy } = useI18n();
  const text = copy.dash;
  const { updateProfile } = useAuth();
  const [draft, setDraft] = useState(() => draftFrom(user));
  const portrait = avatarChoice(draft.avatarId);

  function save(event: FormEvent) {
    event.preventDefault();
    if (draft.name.trim().length < 2 || draft.jobTitle.trim().length < 2) {
      toast.error(copy.session.invalidName);
      return;
    }
    if (!validPhone(draft.phone)) {
      toast.error(copy.session.invalidPhone);
      return;
    }
    if (draft.email.trim() && !/^\S+@\S+\.\S+$/.test(draft.email.trim())) {
      toast.error(text.invalidEmail);
      return;
    }
    updateProfile({
      name: draft.name.trim(),
      phone: phoneKey(draft.phone),
      email: draft.email.trim(),
      jobTitle: draft.jobTitle.trim(),
      bio: draft.bio.trim(),
      avatarId: draft.avatarId,
    });
    toast.success(text.saved);
  }

  return (
    <form onSubmit={save} className="glass space-y-5 rounded-[28px] p-6" style={frostStyle}>
      <div>
        <p className="text-xs tracking-[0.16em] text-[#D4AF37]">{text.profile}</p>
        <h1 className="mt-2 text-2xl font-semibold">{text.profileTitle}</h1>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span
          className="grid size-20 place-items-center rounded-full text-2xl font-semibold"
          style={{ background: portrait.background, color: portrait.color }}
        >
          {(draft.name || user.name).slice(0, 1)}
        </span>
        <div>
          <p className="text-sm font-medium">{text.avatar}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {avatarChoices.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.id}
                aria-pressed={draft.avatarId === item.id}
                onClick={() => setDraft((current) => ({ ...current, avatarId: item.id }))}
                className={cn("size-8 rounded-full ring-offset-2", draft.avatarId === item.id && "ring-2 ring-[#D4AF37]")}
                style={{ background: item.background }}
              />
            ))}
          </div>
        </div>
      </div>
      <label className="block space-y-1.5 text-sm">
        <span>{copy.session.name}</span>
        <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className={fieldClass} />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="flex items-center gap-2">
          {copy.session.phone}
          <span className="rounded-full border border-[#D4AF37]/50 px-2 py-0.5 text-[10px] text-[#8C7016] dark:text-[#D4AF37]">{text.verified}</span>
        </span>
        <input
          dir="ltr"
          inputMode="tel"
          value={draft.phone}
          onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
          className={`${fieldClass} text-left`}
        />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span>{text.email}</span>
        <input
          dir="ltr"
          type="email"
          value={draft.email}
          onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
          className={`${fieldClass} text-left`}
        />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span>{copy.session.job}</span>
        <input value={draft.jobTitle} onChange={(event) => setDraft((current) => ({ ...current, jobTitle: event.target.value }))} className={fieldClass} />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span>{text.bio}</span>
        <textarea
          rows={5}
          value={draft.bio}
          placeholder={text.bioHint}
          onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
          className="w-full rounded-2xl border border-[#D4AF37]/35 bg-white/80 px-3 py-3 text-sm leading-7 text-[#0B132B] outline-none focus:border-[#D4AF37] dark:bg-[#0B132B]/55 dark:text-[#F6F1E4]"
        />
      </label>
      <button type="submit" className="h-11 rounded-2xl px-5 text-sm font-medium" style={goldButtonStyle}>
        {text.save}
      </button>
    </form>
  );
}
