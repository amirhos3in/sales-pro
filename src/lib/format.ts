export function faNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function toman(value: number) {
  return `${faNumber(value)} تومان`;
}

export function faPercent(value: number) {
  return `${faNumber(value)}٪`;
}

export function faDate(iso: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
