"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchAgencyWebsiteInfo } from "@/lib/agencyWebsite";
import { AgentProfile, emptyAgentProfile } from "@/lib/types";

const STORAGE_KEY = "listingwin-agent-profile";
const LEGACY_STORAGE_KEY = "listingmockup-agent-profile";

type AgentProfileContextValue = {
  profile: AgentProfile;
  hasProfile: boolean;
  isProfileComplete: boolean;
  hydrated: boolean;
  updateProfile: (updates: Partial<AgentProfile>) => void;
  replaceProfile: (profile: AgentProfile) => void;
};

const AgentProfileContext = createContext<AgentProfileContextValue | null>(null);

function readProfile() {
  if (typeof window === "undefined") {
    return {
      profile: emptyAgentProfile,
      hasProfile: false,
    };
  }

  try {
    const stored =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY);

    if (!stored) {
      return {
        profile: emptyAgentProfile,
        hasProfile: false,
      };
    }

    return {
      profile: normalizeProfile({
        ...emptyAgentProfile,
        ...JSON.parse(stored),
      }),
      hasProfile: true,
    };
  } catch {
    return {
      profile: emptyAgentProfile,
      hasProfile: false,
    };
  }
}

function writeProfile(profile: AgentProfile) {
  if (typeof window === "undefined") {
    return;
  }

  // MVP persistence is localStorage. Later this can be replaced by loading and
  // saving an Agent Profile record through authenticated database-backed APIs.
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Production should store uploaded logos in object storage and keep URLs.
    try {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // If local storage is unavailable, keep the profile in memory.
    }
  }
}

function normalizeProfile(profile: AgentProfile): AgentProfile {
  const agencyLogos = profile.agencyLogos?.length
    ? profile.agencyLogos
    : profile.agencyLogo
      ? [profile.agencyLogo]
      : [];

  return {
    ...emptyAgentProfile,
    ...profile,
    agencyLogos,
    agencyLogo: profile.agencyLogo || agencyLogos[0] || "",
    photographyMorning: profile.photographyMorning || [],
    photographyAfternoon: profile.photographyAfternoon || [],
    photographyTwilight: profile.photographyTwilight || [],
  };
}

function profileIsComplete(profile: AgentProfile) {
  return Boolean(
    profile.agentName.trim() &&
      profile.agencyName.trim() &&
      profile.phone.trim() &&
      profile.email.trim(),
  );
}

export function AgentProfileProvider({
  children,
  initialProfile,
}: {
  children: ReactNode;
  initialProfile?: AgentProfile;
}) {
  const [profile, setProfile] = useState<AgentProfile>(
    initialProfile
      ? normalizeProfile({ ...emptyAgentProfile, ...initialProfile })
      : emptyAgentProfile,
  );
  const [hasProfile, setHasProfile] = useState(Boolean(initialProfile));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setProfile(normalizeProfile({ ...emptyAgentProfile, ...initialProfile }));
      setHasProfile(true);
      setHydrated(true);
      return;
    }

    const stored = readProfile();
    setProfile(stored.profile);
    setHasProfile(stored.hasProfile);
    setHydrated(true);
  }, [initialProfile]);

  const replaceProfile = useCallback((nextProfile: AgentProfile) => {
    const normalized = normalizeProfile(nextProfile);
    setProfile(normalized);
    setHasProfile(true);
    writeProfile(normalized);

    if (normalized.agencyWebsite) {
      void fetchAgencyWebsiteInfo(normalized.agencyWebsite);
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<AgentProfile>) => {
    setProfile((current) => {
      const nextProfile = normalizeProfile({
        ...current,
        ...updates,
      });

      setHasProfile(true);
      writeProfile(nextProfile);

      if (
        updates.agencyWebsite !== undefined &&
        nextProfile.agencyWebsite.trim()
      ) {
        void fetchAgencyWebsiteInfo(nextProfile.agencyWebsite);
      }

      return nextProfile;
    });
  }, []);

  const value = useMemo(
    () => ({
      profile,
      hasProfile,
      isProfileComplete: profileIsComplete(profile),
      hydrated,
      updateProfile,
      replaceProfile,
    }),
    [hasProfile, hydrated, profile, replaceProfile, updateProfile],
  );

  return (
    <AgentProfileContext.Provider value={value}>
      {children}
    </AgentProfileContext.Provider>
  );
}

export function useAgentProfile() {
  const context = useContext(AgentProfileContext);

  if (!context) {
    throw new Error("useAgentProfile must be used within AgentProfileProvider");
  }

  return context;
}
