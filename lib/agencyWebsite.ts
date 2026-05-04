export type AgencyWebsiteInfo = {
  url: string;
  suggestedAgencyName?: string;
};

export async function fetchAgencyWebsiteInfo(
  url: string,
): Promise<AgencyWebsiteInfo | null> {
  if (!url.trim()) {
    return null;
  }

  // Placeholder for a later enrichment step. In production this could call a
  // backend service that verifies the URL, fetches agency metadata, imports
  // brand colours, and stores the result against the authenticated user.
  return {
    url: url.trim(),
  };
}
