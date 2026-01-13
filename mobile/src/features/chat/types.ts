export type Segment = "Marketplace" | "Deliveries";
export type Role = "buying" | "selling";
export type Filter = "All" | "Buying" | "Selling" | "Action needed";

export type DeliveryStatus = "QUOTE READY" | "ON THE WAY" | "PICKED UP" | "DELIVERED";

export type IntentTag = "High intent" | "Lowballing" | "Needs details";

export type ActionReason = "approval" | "reply" | "safety" | "delivery" | "done";

export type Thread = {
  id: string;
  segment: Segment;
  name: string;
  role: Role;
  avatarUrl: string;

  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingLocation: string;
  listingImageUrl: string;
  listingStatus: "Available" | "Pending" | "Sold";

  lastMessage: string;
  timestamp: string; // display-friendly label: "now", "Jan 7"
  unreadCount: number;

  // Marketplace-only signals
  intent?: IntentTag;
  verified?: boolean;
  deliveryPossible?: boolean;
  riskWarning?: boolean;

  // Deliveries-only
  deliveryStatus?: DeliveryStatus;
  deliveryEta?: string; // "35–55 min"
  pickupSummary?: string;
  dropoffSummary?: string;

  // Action needed system
  actionReason?: ActionReason;
};

export type Message = {
  id: string;
  threadId: string;
  direction: "in" | "out";
  text: string;
  timeLabel: string; // "2:41 PM"
};

export type HaulsyIQState = {
  assistantOn: boolean;
  autoReplyAvailable: boolean;
  notifyWhenSerious: boolean;
  requireApproval: boolean;
  pausedForChat: boolean;
  lastAction: string;
  // rules (modal)
  autoAnswerCommon: boolean;
  autoSchedule: boolean;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
  guardrailValue: number;
};

