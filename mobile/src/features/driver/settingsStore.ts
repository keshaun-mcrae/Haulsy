import { useEffect, useMemo, useState } from "react";

export type VehicleType = "Sedan" | "SUV" | "Truck" | "Van";

export type DriverSettings = {
  verified: boolean;
  hasPayoutMethod: boolean;
  availabilityOnline: boolean;

  vehicleType: VehicleType | null;
  fuelEconomyLPer100Km: number | null;
  gasPricePerLiter: number | null;
  defaultIncludeReturn: boolean;
};

type Listener = () => void;

let state: DriverSettings = {
  verified: false,
  hasPayoutMethod: false,
  availabilityOnline: false,
  vehicleType: "Sedan",
  fuelEconomyLPer100Km: 9.5,
  gasPricePerLiter: 1.79,
  defaultIncludeReturn: false,
};

const listeners = new Set<Listener>();

export function getDriverSettings() {
  return state;
}

export function setDriverSettings(patch: Partial<DriverSettings>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function useDriverSettings() {
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

export function defaultsForVehicle(vehicleType: VehicleType) {
  switch (vehicleType) {
    case "Sedan":
      return 9.5;
    case "SUV":
      return 12.0;
    case "Truck":
    case "Van":
      return 14.5;
  }
}

