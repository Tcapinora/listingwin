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
import { emptyListingState, ListingState } from "@/lib/types";
import { readListingState, writeListingState } from "@/lib/storage";

type ListingContextValue = {
  listing: ListingState;
  setListing: (next: ListingState | ((current: ListingState) => ListingState)) => void;
  resetListing: () => void;
};

const ListingContext = createContext<ListingContextValue | null>(null);

export function ListingProvider({ children }: { children: ReactNode }) {
  const [listing, setListingState] = useState<ListingState>(emptyListingState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setListingState(readListingState());
    setHydrated(true);
  }, []);

  const setListing = useCallback((
    next: ListingState | ((current: ListingState) => ListingState),
  ) => {
    setListingState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      writeListingState(value);
      return value;
    });
  }, []);

  const value = useMemo(
    () => ({
      listing,
      setListing,
      resetListing: () => {
        setListing(emptyListingState);
      },
    }),
    [listing, setListing],
  );

  return (
    <ListingContext.Provider value={value}>
      <div className={hydrated ? "opacity-100" : "opacity-0"}>{children}</div>
    </ListingContext.Provider>
  );
}

export function useListing() {
  const context = useContext(ListingContext);

  if (!context) {
    throw new Error("useListing must be used within ListingProvider");
  }

  return context;
}
