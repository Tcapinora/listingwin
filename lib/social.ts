export function socialHandle(url: string, fallback = "") {
  const value = url.trim();

  if (!value) {
    return fallback;
  }

  try {
    const parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const firstPathPart = parsed.pathname.split("/").filter(Boolean)[0];
    const host = parsed.hostname.replace(/^www\./, "");
    const handle = firstPathPart || host.split(".")[0];

    return handle.startsWith("@") ? handle : `@${handle}`;
  } catch {
    const cleaned = value
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./, "")
      .replace(/^instagram\.com\//i, "")
      .replace(/^facebook\.com\//i, "")
      .split(/[/?#]/)[0]
      .replace(/^@/, "");

    return cleaned ? `@${cleaned.replace(/^@/, "")}` : fallback;
  }
}
