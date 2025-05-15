import { onMessage } from "@/messages.ts";

export async function getCookiesByDomain(domain: string): Promise<chrome.cookies.Cookie[]> {
  return await chrome.cookies.getAll({ domain });
}

onMessage("getCookiesByDomain", async ({ data }) => {
  return await getCookiesByDomain(data);
});

export async function setCookie(data: chrome.cookies.SetDetails): Promise<void> {
  await chrome.cookies.set(data);
}

onMessage("setCookie", async ({ data }) => {
  return await setCookie(data);
});
