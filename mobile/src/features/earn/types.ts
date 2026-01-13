export type EarnSegment = "Overview" | "Gigs" | "Rewards";

export type MissionStatus = "Not started" | "In progress" | "Completed";

export type MissionId = "verify" | "payout" | "first_pickup" | "refer";

export type Mission = {
  id: MissionId;
  title: string;
  rewardLabel: string; // e.g. "+$18"
  status: MissionStatus;
  icon: string; // Ionicons name (typed in component)
  onTap: "verify" | "payout" | "gigs" | "rewards";
};

export type ActivityItem = {
  id: string;
  text: string;
  amountLabel: string; // "+$18" or "-$40"
  when: string; // "Today 2:41pm"
};

export type GigSize = "Small" | "Medium" | "Large";
export type VehicleFit = "Sedan ok" | "SUV recommended" | "Truck required";

export type Gig = {
  id: string;
  payout: number; // pays
  estGas: number; // est gas (may be 0 if unknown)
  net: number; // payout - estGas (may equal payout if unknown)
  distanceToPickupKm: number;
  routeLabel: string; // "Pickup: X → Dropoff: Y"
  pickupArea: string; // neighborhood label
  dropoffArea: string;
  itemSize: GigSize;
  vehicleFit: VehicleFit;
  etaMins: number;
  heavy: boolean;
  twoPersonLift: boolean;
  routeDistanceKm: number; // driver→pickup→dropoff (km)
  payoutLabel?: string;
  state: "Available" | "Active" | "Completed";
};

export type RewardsState = {
  referralCode: string;
  invited: number;
  completed: number;
  streakTitle: string;
  streakProgress: number; // 0..1
};

