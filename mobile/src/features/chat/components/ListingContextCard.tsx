import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { Thread } from "../types";

const CARD_BG = "#FFFFFF";
const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";
const BLUE = "#1F67FF";

function shadow() {
  if (Platform.OS === "android") return { elevation: 1 };
  return { shadowColor: "#0B1220", shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } };
}

export function ListingContextCard({ thread }: { thread: Thread }) {
  const isDelivery = thread.segment === "Deliveries";

  return (
    <View style={styles.card}>
      <Image source={{ uri: thread.listingImageUrl }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.mid}>
        <Text numberOfLines={1} style={styles.title}>
          {thread.listingTitle}
        </Text>
        <Text style={styles.meta}>
          ${thread.listingPrice.toLocaleString()} • {thread.listingLocation}
        </Text>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{thread.listingStatus.toUpperCase()}</Text>
          </View>
          {isDelivery && (
            <View style={styles.deliveryChip}>
              <Ionicons name="cube-outline" size={14} color={BLUE} />
              <Text style={styles.deliveryChipText}>{thread.deliveryStatus ?? "QUOTE READY"}</Text>
            </View>
          )}
        </View>
        {isDelivery && (
          <Text numberOfLines={1} style={styles.deliveryMeta}>
            {thread.pickupSummary} • {thread.dropoffSummary}
          </Text>
        )}
      </View>
      {isDelivery ? (
        <View style={styles.right}>
          <Text style={styles.eta}>{thread.deliveryEta ?? "—"}</Text>
          <Text style={styles.etaSub}>ETA</Text>
        </View>
      ) : (
        <View style={styles.right}>
          <Ionicons name="chevron-forward" size={18} color={MUTED} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    ...shadow(),
  },
  thumb: { width: 52, height: 52, borderRadius: 16, backgroundColor: "#F3F4F6" },
  mid: { flex: 1, minWidth: 0 },
  title: { color: TEXT, fontSize: 14, fontWeight: "900" },
  meta: { marginTop: 6, color: MUTED, fontSize: 12, fontWeight: "700" },
  row: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  badge: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "rgba(17,17,17,0.04)",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: TEXT, fontSize: 10, fontWeight: "900", letterSpacing: 0.6 },
  deliveryChip: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "rgba(31,103,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(31,103,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  deliveryChipText: { color: BLUE, fontSize: 10, fontWeight: "900", letterSpacing: 0.4 },
  deliveryMeta: { marginTop: 8, color: MUTED, fontSize: 12, fontWeight: "700" },
  right: { alignItems: "flex-end", justifyContent: "center" },
  eta: { color: TEXT, fontSize: 13, fontWeight: "900" },
  etaSub: { marginTop: 4, color: MUTED, fontSize: 11, fontWeight: "700" },
});

