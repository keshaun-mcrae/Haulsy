import type { HaulsyIQState, Message, Thread } from "./types";

function avatar(img: number) {
  return `https://i.pravatar.cc/150?img=${img}`;
}

function listingImg(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/300/300`;
}

function t(id: string) {
  // lightweight deterministic timestamp labels for mock
  const map: Record<string, string> = {
    m1: "now",
    m2: "Jan 7",
    m3: "Jan 6",
    m4: "Jan 3",
    m5: "Dec 28",
    m6: "Dec 22",
    d1: "now",
    d2: "Jan 7",
  };
  return map[id] ?? "now";
}

export const THREADS: Thread[] = [
  {
    id: "m1",
    segment: "Marketplace",
    name: "Sarah Johnson",
    role: "selling",
    avatarUrl: avatar(32),
    listingId: "l1",
    listingTitle: "MacBook Pro 14 M3",
    listingPrice: 450,
    listingLocation: "Brooklyn, NY",
    listingImageUrl: listingImg("macbook-m3"),
    listingStatus: "Available",
    lastMessage: "Could you do $440 if I pick up tonight?",
    timestamp: t("m1"),
    unreadCount: 2,
    intent: "High intent",
    verified: true,
    deliveryPossible: true,
    actionReason: "approval",
  },
  {
    id: "m2",
    segment: "Marketplace",
    name: "Ava Chen",
    role: "buying",
    avatarUrl: avatar(47),
    listingId: "l2",
    listingTitle: "Modern Grey Sectional Sofa",
    listingPrice: 650,
    listingLocation: "Williamsburg",
    listingImageUrl: listingImg("sectional-sofa"),
    listingStatus: "Available",
    lastMessage: "What are the dimensions? Any stains or odors?",
    timestamp: t("m2"),
    unreadCount: 0,
    intent: "Needs details",
    deliveryPossible: true,
    actionReason: "reply",
  },
  {
    id: "m3",
    segment: "Marketplace",
    name: "Jordan Park",
    role: "selling",
    avatarUrl: avatar(12),
    listingId: "l3",
    listingTitle: "Nintendo Switch Bundle",
    listingPrice: 280,
    listingLocation: "Lower Manhattan",
    listingImageUrl: listingImg("switch-bundle"),
    listingStatus: "Available",
    lastMessage: "I can do $160 cash right now.",
    timestamp: t("m3"),
    unreadCount: 1,
    intent: "Lowballing",
    riskWarning: true,
    actionReason: "safety",
  },
  {
    id: "m4",
    segment: "Marketplace",
    name: "Mina K.",
    role: "buying",
    avatarUrl: avatar(9),
    listingId: "l4",
    listingTitle: "Vintage Floor Lamp (Brass)",
    listingPrice: 70,
    listingLocation: "Park Slope",
    listingImageUrl: listingImg("vintage-lamp"),
    listingStatus: "Pending",
    lastMessage: "Perfect — I can pick up tomorrow afternoon.",
    timestamp: t("m4"),
    unreadCount: 0,
    verified: true,
    actionReason: "done",
  },
  {
    id: "m5",
    segment: "Marketplace",
    name: "Chris Nolan",
    role: "buying",
    avatarUrl: avatar(21),
    listingId: "l5",
    listingTitle: "Road Bike • Size M",
    listingPrice: 520,
    listingLocation: "Queens",
    listingImageUrl: listingImg("road-bike"),
    listingStatus: "Available",
    lastMessage: "Can I see it this weekend?",
    timestamp: t("m5"),
    unreadCount: 0,
    intent: "High intent",
    deliveryPossible: false,
    actionReason: "reply",
  },
  {
    id: "m6",
    segment: "Marketplace",
    name: "Taylor Reed",
    role: "selling",
    avatarUrl: avatar(28),
    listingId: "l6",
    listingTitle: "KitchenAid Stand Mixer",
    listingPrice: 220,
    listingLocation: "Downtown",
    listingImageUrl: listingImg("stand-mixer"),
    listingStatus: "Available",
    lastMessage: "Yes, it includes the bowl + attachments.",
    timestamp: t("m6"),
    unreadCount: 0,
    verified: true,
    actionReason: "done",
  },
  {
    id: "d1",
    segment: "Deliveries",
    name: "Haulsy Delivery",
    role: "buying",
    avatarUrl: avatar(5),
    listingId: "l2",
    listingTitle: "Modern Grey Sectional Sofa",
    listingPrice: 650,
    listingLocation: "Brooklyn, NY",
    listingImageUrl: listingImg("delivery-section"),
    listingStatus: "Available",
    lastMessage: "Quote ready. Want to confirm pickup window?",
    timestamp: t("d1"),
    unreadCount: 1,
    deliveryStatus: "QUOTE READY",
    deliveryEta: "45–75 min",
    pickupSummary: "Pickup: Williamsburg",
    dropoffSummary: "Dropoff: Brooklyn 11201",
    actionReason: "delivery",
  },
  {
    id: "d2",
    segment: "Deliveries",
    name: "Haulsy Delivery",
    role: "selling",
    avatarUrl: avatar(15),
    listingId: "l7",
    listingTitle: "IKEA Kallax Shelf",
    listingPrice: 60,
    listingLocation: "Brooklyn, NY",
    listingImageUrl: listingImg("delivery-kallax"),
    listingStatus: "Available",
    lastMessage: "Driver assigned. ETA 35–55 min.",
    timestamp: t("d2"),
    unreadCount: 0,
    deliveryStatus: "ON THE WAY",
    deliveryEta: "35–55 min",
    pickupSummary: "Pickup: Bushwick",
    dropoffSummary: "Dropoff: Brooklyn 11221",
    actionReason: "delivery",
  },
];

export const DEFAULT_HIQ: HaulsyIQState = {
  assistantOn: true,
  autoReplyAvailable: true,
  notifyWhenSerious: true,
  requireApproval: true,
  pausedForChat: false,
  lastAction: "Waiting for your approval",
  autoAnswerCommon: true,
  autoSchedule: false,
  quietHoursEnabled: false,
  quietStart: "10:00 PM",
  quietEnd: "7:00 AM",
  guardrailValue: 440,
};

function msg(threadId: string, direction: Message["direction"], text: string, timeLabel: string): Message {
  return { id: `${threadId}-${Math.random().toString(16).slice(2)}`, threadId, direction, text, timeLabel };
}

export const MESSAGES_BY_THREAD: Record<string, Message[]> = {
  // High intent + negotiation (12+)
  m1: [
    msg("m1", "in", "Hey! Still available?", "2:12 PM"),
    msg("m1", "out", "Yes — still available.", "2:13 PM"),
    msg("m1", "in", "Amazing. Any scratches or repairs?", "2:13 PM"),
    msg("m1", "out", "No repairs. Minor wear on the bottom case.", "2:14 PM"),
    msg("m1", "in", "Battery cycles?", "2:15 PM"),
    msg("m1", "out", "112 cycles. I can screenshot the system report.", "2:16 PM"),
    msg("m1", "in", "Nice. Would you take $430?", "2:18 PM"),
    msg("m1", "out", "I’m hoping for closer to asking.", "2:19 PM"),
    msg("m1", "in", "If I pick up tonight, could you do $440?", "2:20 PM"),
    msg("m1", "out", "That could work. What time works for you?", "2:21 PM"),
    msg("m1", "in", "Around 7:30 in Brooklyn Heights.", "2:22 PM"),
    msg("m1", "out", "Perfect. I’ll confirm address in a moment.", "2:23 PM"),
  ],
  // Needs details thread (12+)
  m2: [
    msg("m2", "in", "Hi! Is the sectional still available?", "11:02 AM"),
    msg("m2", "out", "Yes it is.", "11:03 AM"),
    msg("m2", "in", "What are the dimensions?", "11:04 AM"),
    msg("m2", "out", "It’s 102\" wide, 64\" chaise depth, 34\" tall.", "11:06 AM"),
    msg("m2", "in", "Any stains or odors? Pet or smoke home?", "11:08 AM"),
    msg("m2", "out", "No smoke, no pets. No stains.", "11:10 AM"),
    msg("m2", "in", "Can it be disassembled?", "11:12 AM"),
    msg("m2", "out", "Yes — separates into 2 pieces.", "11:13 AM"),
    msg("m2", "in", "Do you offer delivery?", "11:15 AM"),
    msg("m2", "out", "Haulsy delivery quote is available (beta).", "11:16 AM"),
    msg("m2", "in", "Great. What’s the earliest pickup?", "11:18 AM"),
    msg("m2", "out", "Today after 5pm or tomorrow morning.", "11:20 AM"),
  ],
  // Lowball thread (12+)
  m3: [
    msg("m3", "in", "Would you take $160 cash right now?", "4:51 PM"),
    msg("m3", "out", "That’s too low — asking is $280.", "4:52 PM"),
    msg("m3", "in", "Ok $170 final.", "4:52 PM"),
    msg("m3", "out", "No thanks.", "4:53 PM"),
    msg("m3", "in", "I can come in 10 minutes.", "4:53 PM"),
    msg("m3", "out", "Still no.", "4:54 PM"),
    msg("m3", "in", "Do you have the dock at least?", "4:55 PM"),
    msg("m3", "out", "Yes, full set. But price is firm.", "4:56 PM"),
    msg("m3", "in", "You’re wasting time. $180?", "4:57 PM"),
    msg("m3", "out", "Please stop lowballing.", "4:58 PM"),
    msg("m3", "in", "Ok ok $200.", "4:58 PM"),
    msg("m3", "out", "No.", "4:59 PM"),
  ],
  // Delivery quote flow (12+)
  d1: [
    msg("d1", "in", "Delivery quote ready • $22–$31", "9:10 AM"),
    msg("d1", "out", "Thanks — what’s the ETA?", "9:11 AM"),
    msg("d1", "in", "Estimated 45–75 min (beta).", "9:12 AM"),
    msg("d1", "out", "Is pickup window flexible?", "9:13 AM"),
    msg("d1", "in", "Yes. Pick a 2-hour window.", "9:14 AM"),
    msg("d1", "out", "Today 2–4 works.", "9:15 AM"),
    msg("d1", "in", "Great. Confirming with driver pool…", "9:16 AM"),
    msg("d1", "in", "Driver assigned. Pickup 2–4.", "9:18 AM"),
    msg("d1", "out", "Perfect.", "9:19 AM"),
    msg("d1", "in", "Pickup started.", "2:07 PM"),
    msg("d1", "in", "En route to dropoff.", "2:28 PM"),
    msg("d1", "in", "Delivered. Please confirm condition.", "3:05 PM"),
  ],
};

export function getThread(threadId: string) {
  return THREADS.find((t) => t.id === threadId);
}

export function getThreads(segment: Thread["segment"]) {
  return THREADS.filter((t) => t.segment === segment);
}

export function getMessages(threadId: string) {
  return MESSAGES_BY_THREAD[threadId] ?? [];
}

