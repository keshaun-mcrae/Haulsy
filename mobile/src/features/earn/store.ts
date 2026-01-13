import { useEffect, useMemo, useState } from "react";
import type { Gig } from "./types";
import { GIGS as MOCK_GIGS } from "./mockData";

type Listener = () => void;

type State = {
  online: boolean;
  gigsLoading: boolean;
  gigs: Gig[];
  activeGigId: string | null;
};

let state: State = {
  online: false,
  gigsLoading: false,
  gigs: MOCK_GIGS,
  activeGigId: null,
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function useEarnStore() {
  const [, bump] = useState(0);
  useEffect(() => {
    const l = () => bump((x) => x + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return useMemo(() => state, [state]);
}

export function setEarnState(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

export function refreshGigs() {
  // MVP: fake loading pulse
  setEarnState({ gigsLoading: true });
  setTimeout(() => {
    setEarnState({ gigsLoading: false });
  }, 700);
}

export function acceptGig(gigId: string) {
  const gigs = state.gigs.map((g) => (g.id === gigId ? { ...g, state: "Active" as const } : g));
  state = { ...state, gigs, activeGigId: gigId };
  emit();
}

export function completeGig(gigId: string) {
  const gigs = state.gigs.map((g) => (g.id === gigId ? { ...g, state: "Completed" as const } : g));
  state = { ...state, gigs, activeGigId: null };
  emit();
}

export function getGig(gigId: string) {
  return state.gigs.find((g) => g.id === gigId);
}

