import { createHmac, timingSafeEqual } from "crypto";

const API_KEY_PREFIX = "lw_live";
const SIGNATURE_LENGTH = 43;

function getSigningSecret() {
  return process.env.LISTINGWIN_API_KEY_SECRET || process.env.LISTINGWIN_API_KEY || "";
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signUserId(userId: string) {
  return createHmac("sha256", getSigningSecret())
    .update(userId)
    .digest("base64url")
    .slice(0, SIGNATURE_LENGTH);
}

export function isAccountApiKeyConfigured() {
  return Boolean(getSigningSecret());
}

export function createAccountApiKey(userId: string) {
  if (!isAccountApiKeyConfigured()) {
    return "";
  }

  return `${API_KEY_PREFIX}_${encode(userId)}_${signUserId(userId)}`;
}

export function getUserIdFromAccountApiKey(apiKey: string) {
  if (!isAccountApiKeyConfigured()) {
    return "";
  }

  const parts = apiKey.trim().split("_");

  if (parts.length !== 4 || `${parts[0]}_${parts[1]}` !== API_KEY_PREFIX) {
    return "";
  }

  try {
    const userId = decode(parts[2]);
    const expectedSignature = signUserId(userId);
    const receivedSignature = parts[3];

    if (receivedSignature.length !== expectedSignature.length) {
      return "";
    }

    const signaturesMatch = timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(expectedSignature),
    );

    return signaturesMatch ? userId : "";
  } catch {
    return "";
  }
}

export function isValidAccountApiKey(apiKey: string) {
  return Boolean(getUserIdFromAccountApiKey(apiKey));
}
