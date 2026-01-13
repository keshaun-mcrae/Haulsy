import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Theme tokens (fallbacks per spec)
const PAGE_BG = "#F6F7FB";
const CARD_BG = "#FFFFFF";
const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";
const HAULSY_BLUE = "#1F67FF";
const HAULSYIQ_PURPLE = "#7C3AED";

type Listing = {
  id: string;
  title: string;
  price: number;
  locationLabel: string; // e.g. "Brooklyn, NY"
  timeLabel: string; // e.g. "2 hours ago"
  images: string[];
  description: string;
  details: {
    condition: string;
    brand: string;
    category: string;
    delivery: string;
  };
  seller: {
    name: string;
    rating: number;
    ratingCount: number;
    joinedYear: number;
    completedTrades: number;
    replyTime: string;
  };
};

const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Modern Grey Sectional Sofa - Like New",
    price: 450,
    locationLabel: "Brooklyn, NY",
    timeLabel: "2 hours ago",
    images: [
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1582582429415-99e3d9f4f17f?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=70",
    ],
    description:
      "Like-new sectional in a modern grey fabric. Clean home, no pets, no smoking. Super comfortable and fits well in apartments. Happy to share measurements and help with pickup.\n\nNo stains, no odors, minimal wear. Can be separated into two pieces for easier transport.",
    details: {
      condition: "Like New",
      brand: "West Elm",
      category: "Furniture > Living Room",
      delivery: "Available",
    },
    seller: {
      name: "Sarah Johnson",
      rating: 4.8,
      ratingCount: 32,
      joinedYear: 2023,
      completedTrades: 54,
      replyTime: "Usually replies in 20 min",
    },
  },
];

function formatPrice(n: number) {
  return `$${n.toLocaleString()}`;
}

function shadow(level: "soft" | "card" | "cta") {
  if (Platform.OS === "android") {
    const elevation = level === "cta" ? 10 : level === "card" ? 2 : 1;
    return { elevation };
  }
  if (level === "cta") {
    return {
      shadowColor: "#0B1220",
      shadowOpacity: 0.10,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
    };
  }
  if (level === "card") {
    return {
      shadowColor: "#0B1220",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    };
  }
  return {
    shadowColor: "#0B1220",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  };
}

function CircleIconButton({
  icon,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => [styles.topIconBtn, pressed && { opacity: 0.9 }]}>
      <Ionicons name={icon} size={18} color={TEXT} />
    </Pressable>
  );
}

function Pill({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
}) {
  return (
    <View style={styles.infoPill}>
      <Ionicons name={icon} size={15} color={HAULSY_BLUE} />
      <Text style={styles.infoPillText}>{text}</Text>
    </View>
  );
}

function Chip({
  title,
  icon,
  onPress,
  tone = "neutral",
}: {
  title: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  tone?: "neutral" | "primary";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        tone === "primary" && styles.chipPrimary,
        pressed && { opacity: 0.92 },
      ]}
    >
      {!!icon && <Ionicons name={icon} size={15} color={tone === "primary" ? "#fff" : HAULSY_BLUE} />}
      <Text style={[styles.chipText, tone === "primary" && { color: "#fff" }]}>{title}</Text>
    </Pressable>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const listing = useMemo(() => {
    const found = MOCK_LISTINGS.find((x) => x.id === String(id));
    return found ?? MOCK_LISTINGS[0];
  }, [id]);

  const HERO_RADIUS = 30;
  const HERO_H = Math.round(width * 1.05);

  const scrollRef = useRef<ScrollView | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const [page, setPage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [haulsyIQExpanded, setHaulsyIQExpanded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [messageText, setMessageText] = useState("Still available?");

  const CTA_BAR_H = 92; // visual height without safe-area
  const contentPadBottom = CTA_BAR_H + insets.bottom + 24;

  const fairness = 82;
  const risk = "Low";
  const deliverySummary = "Est. delivery: $18–$35 • 45–75 min (beta)";

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: contentPadBottom }}
      >
        {/* Hero carousel */}
        <View style={[styles.hero, { height: HERO_H, borderBottomLeftRadius: HERO_RADIUS, borderBottomRightRadius: HERO_RADIUS }]}>
          <FlatList
            data={listing.images}
            keyExtractor={(x, i) => `${listing.id}-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const next = Math.round(x / Math.max(width, 1));
              setPage(next);
            }}
            renderItem={({ item }) => (
              <View style={{ width, height: HERO_H }}>
                <Image source={{ uri: item }} style={styles.heroImg} resizeMode="cover" />
              </View>
            )}
          />

          {/* Top overlay controls */}
          <View style={[styles.heroTop, { paddingTop: insets.top + 10 }]}>
            <CircleIconButton icon="close" onPress={() => router.back()} />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <CircleIconButton icon="search" onPress={() => console.log("Search")} />
              <CircleIconButton icon="ellipsis-horizontal" onPress={() => console.log("More")} />
            </View>
          </View>

          {/* Pagination dots */}
          <View style={styles.dots}>
            {listing.images.map((_, i) => (
              <View key={i} style={[styles.dot, i === page ? styles.dotActive : styles.dotInactive]} />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header info */}
          <View style={styles.headerBlock}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(listing.price)}</Text>
              <Pressable
                onPress={() => setIsSaved((v) => !v)}
                hitSlop={12}
                style={({ pressed }) => [styles.heartBtn, pressed && { opacity: 0.85 }]}
              >
                <Ionicons name={isSaved ? "heart" : "heart-outline"} size={22} color={isSaved ? HAULSY_BLUE : MUTED} />
              </Pressable>
            </View>

            <Text numberOfLines={2} style={styles.title}>
              {listing.title}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={15} color={MUTED} />
                <Text style={styles.metaText}>{listing.locationLabel}</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={15} color={MUTED} />
                <Text style={styles.metaText}>{listing.timeLabel}</Text>
              </View>
            </View>

            {/* Pickup / Delivery pill */}
            <View style={styles.pillRow}>
              <Pill icon="storefront-outline" text="Pickup available" />
              <Pill icon="cube-outline" text="Delivery from $18 (beta)" />
            </View>
          </View>

          {/* HaulsyIQ module (NO SLIDER) */}
          <View style={styles.hiqCard}>
            <Pressable
              onPress={() => setHaulsyIQExpanded((v) => !v)}
              style={({ pressed }) => [styles.hiqHeader, pressed && { opacity: 0.94 }]}
            >
              <View style={styles.hiqHeaderLeft}>
                <View style={styles.hiqIconCircle}>
                  <Ionicons name="sparkles" size={16} color="#fff" />
                </View>
                <Text style={styles.hiqTitle}>HaulsyIQ</Text>
              </View>
              <View style={styles.hiqHeaderRight}>
                <View style={styles.betaBadge}>
                  <Text style={styles.betaBadgeText}>Beta</Text>
                </View>
                <Ionicons name={haulsyIQExpanded ? "chevron-up" : "chevron-down"} size={18} color={MUTED} />
              </View>
            </Pressable>

            {!haulsyIQExpanded ? (
              <View style={styles.hiqCollapsed}>
                <Text style={styles.hiqSummaryText}>Fairness: {fairness}/100</Text>
                <Text style={styles.hiqSummaryText}>Risk: {risk}</Text>
                <Text style={styles.hiqSummaryText}>{deliverySummary}</Text>
              </View>
            ) : (
              <View style={styles.hiqExpanded}>
                <View style={styles.hiqTiles}>
                  <View style={styles.hiqTile}>
                    <Text style={styles.hiqTileLabel}>Fairness</Text>
                    <View style={styles.hiqTileValueRow}>
                      <Text style={styles.hiqTileValue}>{fairness}</Text>
                      <Text style={styles.hiqTileUnit}>/100</Text>
                    </View>
                  </View>
                  <View style={styles.hiqTile}>
                    <Text style={styles.hiqTileLabel}>Risk</Text>
                    <Text style={styles.hiqTileValue}>{risk}</Text>
                  </View>
                </View>

                <View style={styles.hiqDeliveryRow}>
                  <Ionicons name="cube-outline" size={18} color={HAULSYIQ_PURPLE} />
                  <Text style={styles.hiqDeliveryText}>{deliverySummary}</Text>
                </View>

                <View style={styles.hiqChips}>
                  <Chip icon="flash-outline" title="Auto message" onPress={() => console.log("Auto message")} />
                  <Chip icon="pricetag-outline" title="Suggest offer" onPress={() => console.log("Suggest offer")} />
                  <Chip icon="cube-outline" title="Get quote" onPress={() => console.log("Get quote")} />
                </View>
              </View>
            )}
          </View>

          {/* Send to seller */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Send to seller</Text>

            <View style={styles.suggestionRow}>
              <Chip title="Available?" onPress={() => setMessageText("Available?")} />
              <Chip title="Best price?" onPress={() => setMessageText("Best price?")} />
            </View>

            <View style={styles.messageRow}>
              <View style={styles.messageInputWrap}>
                <TextInput
                  ref={inputRef}
                  value={messageText}
                  onChangeText={setMessageText}
                  placeholder="Still available?"
                  placeholderTextColor={MUTED}
                  style={styles.messageInput}
                />
              </View>
              <Pressable
                onPress={() => console.log("Send message")}
                style={({ pressed }) => [styles.sendSquare, pressed && { opacity: 0.92 }]}
              >
                <Ionicons name="paper-plane" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Description */}
          <View style={styles.sectionCard}>
            <Pressable
              onPress={() => setDescExpanded((v) => !v)}
              style={({ pressed }) => [styles.sectionHeaderRow, pressed && { opacity: 0.94 }]}
            >
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={styles.seeMoreRow}>
                <Text style={styles.seeMoreText}>{descExpanded ? "See less" : "See more"}</Text>
                <Ionicons name={descExpanded ? "chevron-up" : "chevron-down"} size={16} color={MUTED} />
              </View>
            </Pressable>
            <Text numberOfLines={descExpanded ? undefined : 3} style={styles.bodyText}>
              {listing.description}
            </Text>
          </View>

          {/* Seller */}
          <View style={styles.sectionCard}>
            <View style={styles.sellerTopRow}>
              <View style={styles.sellerLeft}>
                <View style={styles.avatarCircle}>
                  <View style={styles.avatarInner} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.sellerNameRow}>
                    <Text style={styles.sellerName}>{listing.seller.name}</Text>
                    <Ionicons name="checkmark-circle" size={18} color={HAULSY_BLUE} />
                  </View>
                  <Text style={styles.sellerMeta}>{`Joined ${listing.seller.joinedYear} • ${listing.seller.completedTrades} completed trades`}</Text>
                  <Text style={styles.sellerMeta}>{listing.seller.replyTime}</Text>
                </View>
              </View>

              <View style={styles.ratingPill}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>{`${listing.seller.rating.toFixed(1)} (${listing.seller.ratingCount})`}</Text>
              </View>
            </View>

            <View style={styles.badgesRow}>
              <Badge icon="shield-checkmark-outline" label="ID Verified" tint="#16A34A" />
              <Badge icon="call-outline" label="Phone Verified" tint={HAULSY_BLUE} />
              <Badge icon="location-outline" label="Pickup Verified" tint={HAULSYIQ_PURPLE} />
            </View>
          </View>

          {/* Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={{ marginTop: 10 }}>
              <DetailRow label="Condition" value={listing.details.condition} />
              <DetailRow label="Brand" value={listing.details.brand} />
              <DetailRow label="Category" value={listing.details.category} />
              <DetailRow label="Delivery" value={listing.details.delivery} />
            </View>
          </View>

          {/* Where to meet */}
          <View style={styles.whereWrap}>
            <Text style={styles.whereTitle}>Where to meet</Text>
            <Pressable
              onPress={() => console.log("Open map")}
              style={({ pressed }) => [styles.mapCard, pressed && { opacity: 0.94 }]}
            >
              <Ionicons name="location-outline" size={28} color={MUTED} />
              <Text style={styles.mapPreview}>Map preview</Text>
              <Text style={styles.mapAddress}>Brooklyn, NY 11201</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA bar */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom }]}>
        <View style={styles.ctaRow}>
          <Pressable
            onPress={() => console.log("Message")}
            style={({ pressed }) => [styles.ctaPrimary, pressed && { opacity: 0.92 }]}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
            <Text style={styles.ctaPrimaryText}>Message</Text>
          </Pressable>

          <Pressable
            onPress={() => console.log("Get quote")}
            style={({ pressed }) => [styles.ctaSecondary, pressed && { opacity: 0.92 }]}
          >
            <Ionicons name="cube-outline" size={18} color={HAULSY_BLUE} />
            <Text style={styles.ctaSecondaryText}>Get quote</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Badge({
  icon,
  label,
  tint,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  tint: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: `${tint}14`, borderColor: `${tint}2E` }]}>
      <Ionicons name={icon} size={14} color={tint} />
      <Text style={[styles.badgeText, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PAGE_BG },

  hero: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  heroImg: { width: "100%", height: "100%" },
  heroTop: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: "rgba(231,234,240,0.9)",
    alignItems: "center",
    justifyContent: "center",
    ...shadow("soft"),
  },
  dots: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotActive: { backgroundColor: "rgba(255,255,255,0.95)" },
  dotInactive: { backgroundColor: "rgba(255,255,255,0.55)" },

  content: { paddingHorizontal: 16, paddingTop: 14 },

  headerBlock: { gap: 10 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { color: TEXT, fontSize: 34, fontWeight: "900", letterSpacing: -0.5 },
  heartBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { color: TEXT, fontSize: 18, fontWeight: "800", lineHeight: 24 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: MUTED, fontSize: 13, fontWeight: "600" },
  metaDot: { color: MUTED, fontSize: 13, fontWeight: "700" },

  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 2 },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(31,103,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(31,103,255,0.18)",
  },
  infoPillText: { color: TEXT, fontSize: 12, fontWeight: "700" },

  hiqCard: {
    marginTop: 14,
    backgroundColor: "#F3F0FF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.18)",
    padding: 14,
    ...shadow("card"),
  },
  hiqHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  hiqHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  hiqHeaderRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  hiqIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: HAULSYIQ_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    ...shadow("soft"),
  },
  hiqTitle: { color: TEXT, fontSize: 15, fontWeight: "900" },
  betaBadge: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(124,58,237,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.26)",
    alignItems: "center",
    justifyContent: "center",
  },
  betaBadgeText: { color: HAULSYIQ_PURPLE, fontSize: 12, fontWeight: "800" },
  hiqCollapsed: { marginTop: 12, gap: 8 },
  hiqSummaryText: { color: TEXT, fontSize: 13, fontWeight: "700" },
  hiqExpanded: { marginTop: 14, gap: 12 },
  hiqTiles: { flexDirection: "row", gap: 10 },
  hiqTile: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(231,234,240,0.95)",
    padding: 12,
  },
  hiqTileLabel: { color: MUTED, fontSize: 12, fontWeight: "700" },
  hiqTileValueRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 8 },
  hiqTileValue: { color: TEXT, fontSize: 22, fontWeight: "900" },
  hiqTileUnit: { color: MUTED, fontSize: 12, fontWeight: "800" },
  hiqDeliveryRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  hiqDeliveryText: { flex: 1, color: TEXT, fontSize: 13, fontWeight: "700" },
  hiqChips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipPrimary: {
    backgroundColor: HAULSY_BLUE,
    borderColor: "rgba(31,103,255,0.35)",
  },
  chipText: { color: HAULSY_BLUE, fontSize: 12, fontWeight: "800" },

  sectionCard: {
    marginTop: 14,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    ...shadow("card"),
  },
  sectionTitle: { color: TEXT, fontSize: 15, fontWeight: "900" },
  suggestionRow: { marginTop: 12, flexDirection: "row", gap: 10 },
  messageRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  messageInputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(246,247,251,0.7)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageInput: { color: TEXT, fontSize: 14, fontWeight: "700" },
  sendSquare: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: HAULSY_BLUE,
    alignItems: "center",
    justifyContent: "center",
    ...shadow("soft"),
  },

  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  seeMoreRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  seeMoreText: { color: MUTED, fontSize: 13, fontWeight: "700" },
  bodyText: { marginTop: 10, color: MUTED, fontSize: 14, lineHeight: 20, fontWeight: "600" },

  sellerTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  sellerLeft: { flexDirection: "row", alignItems: "flex-start", gap: 12, flex: 1 },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F3F0FF",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.20)",
    overflow: "hidden",
  },
  avatarInner: {
    position: "absolute",
    left: -10,
    top: -10,
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(31,103,255,0.18)",
  },
  sellerNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sellerName: { color: TEXT, fontSize: 15, fontWeight: "900" },
  sellerMeta: { marginTop: 6, color: MUTED, fontSize: 12, fontWeight: "700" },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(245,158,11,0.12)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.22)",
  },
  ratingText: { color: TEXT, fontSize: 12, fontWeight: "900" },
  badgesRow: { marginTop: 14, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "900" },

  detailRow: { paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  detailLabel: { color: MUTED, fontSize: 13, fontWeight: "700" },
  detailValue: { color: TEXT, fontSize: 13, fontWeight: "900", textAlign: "right", marginLeft: 12, flex: 1 },

  whereWrap: { marginTop: 14, marginBottom: 8 },
  whereTitle: { color: TEXT, fontSize: 15, fontWeight: "900", paddingHorizontal: 2 },
  mapCard: {
    marginTop: 12,
    height: 200,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadow("card"),
  },
  mapPreview: { color: MUTED, fontSize: 12, fontWeight: "800" },
  mapAddress: { color: TEXT, fontSize: 13, fontWeight: "900" },

  ctaBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingTop: 12,
    ...shadow("cta"),
  },
  ctaRow: { flexDirection: "row", gap: 12 },
  ctaPrimary: {
    flex: 1,
    height: 54,
    borderRadius: 999,
    backgroundColor: HAULSY_BLUE,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaPrimaryText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  ctaSecondary: {
    flex: 1,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaSecondaryText: { color: HAULSY_BLUE, fontSize: 14, fontWeight: "900" },
});

