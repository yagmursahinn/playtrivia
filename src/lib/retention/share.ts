import { getSiteUrl } from "@/lib/seo/site";

export type ShareResultPayload = {
  score: number;
  rankTitle: string;
};

export function getShareUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return getSiteUrl();
}

export function buildShareMessage({ score, rankTitle }: ShareResultPayload): string {
  return `I scored ${score} points in PlayTrivia and reached ${rankTitle}. Can you beat me?`;
}

export function buildShareClipboardText(payload: ShareResultPayload): string {
  const message = buildShareMessage(payload);
  const url = getShareUrl();
  return url ? `${message}\n\n${url}` : message;
}

export function buildTwitterShareUrl(payload: ShareResultPayload): string {
  const text = buildShareMessage(payload);
  const url = getShareUrl();
  const params = new URLSearchParams({
    text,
    ...(url ? { url } : {}),
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function buildWhatsAppShareUrl(payload: ShareResultPayload): string {
  const text = buildShareClipboardText(payload);
  const params = new URLSearchParams({ text });
  return `https://wa.me/?${params.toString()}`;
}

export function openShareWindow(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function copyShareResult(payload: ShareResultPayload): Promise<void> {
  const text = buildShareClipboardText(payload);
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("Clipboard is not supported.");
  }
  await navigator.clipboard.writeText(text);
}

export function isNativeShareSupported(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function shareWithNativeApi(payload: ShareResultPayload): Promise<void> {
  if (!isNativeShareSupported()) {
    throw new Error("Native share is not supported.");
  }

  const text = buildShareClipboardText(payload);
  const url = getShareUrl();

  await navigator.share({
    title: "PlayTrivia Result",
    text,
    ...(url ? { url } : {}),
  });
}
