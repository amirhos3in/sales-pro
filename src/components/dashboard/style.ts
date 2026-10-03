export const frostStyle = {
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
} as const;

export const goldButtonStyle = {
  backgroundColor: "#D4AF37",
  color: "#0B132B",
} as const;

export const avatarChoices = [
  { id: "navy", background: "#0B132B", color: "#D4AF37" },
  { id: "gold", background: "#D4AF37", color: "#0B132B" },
  { id: "ink", background: "#1C2541", color: "#F6F1E4" },
  { id: "sand", background: "#F3E5AB", color: "#0B132B" },
  { id: "pine", background: "#1F4D3A", color: "#F3E5AB" },
  { id: "wine", background: "#6E2B3A", color: "#F6F1E4" },
] as const;

export type AvatarId = (typeof avatarChoices)[number]["id"];

export function avatarChoice(id?: string) {
  return avatarChoices.find((item) => item.id === id) ?? avatarChoices[0];
}
