import { useEffect, useMemo, useState } from "react";

export type VerificationStatus = "VERIFIED" | "PENDING" | "IN_REVIEW" | "NOT_SET";
export type IdVerificationStatus = "ID_VERIFIED" | "ID_PENDING" | "ID_IN_REVIEW" | "ID_NOT_STARTED";

export type AccountTrustState = {
  idStatus: IdVerificationStatus;
  phoneStatus: VerificationStatus;
  emailStatus: VerificationStatus;
};

type Listener = () => void;

let state: AccountTrustState = {
  idStatus: "ID_PENDING",
  phoneStatus: "VERIFIED",
  emailStatus: "VERIFIED",
};

const listeners = new Set<Listener>();

export function useAccountTrust() {
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

export function setAccountTrust(patch: Partial<AccountTrustState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

