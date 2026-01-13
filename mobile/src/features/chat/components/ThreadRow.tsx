import React, { useMemo, useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ActionReason, Thread } from "../types";

const CARD_BG = "#FFFFFF";
const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";
const BLUE = "#1F67FF";

function shadow() {
  if (Platform.OS === "android") return { elevation: 1 };
  return { shadowColor: "#0B1220", shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } };
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "?";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export function ThreadRow({
  thread,
  onPress,
}: {
  thread: Thread;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.94 }]}>
      <Avatar name={thread.name} url={thread.avatarUrl} />

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.name}>
          {thread.name}
        </Text>

        <Text numberOfLines={1} style={styles.title}>
          {thread.segment === "Deliveries" ? `Haulsy Delivery — ${thread.listingTitle}` : thread.listingTitle}
        </Text>

        <Text numberOfLines={1} style={styles.snippet}>
          {thread.lastMessage}
        </Text>
      </View>

      <RightRail thread={thread} />
    </Pressable>
  );
}

function RightRail({ thread }: { thread: Thread }) {
  const statusLabel = useMemo(() => {
    if (thread.segment === "Deliveries") return thread.deliveryStatus ?? "QUOTE READY";
    return thread.role === "selling" ? "SELLING" : "BUYING";
  }, [thread.deliveryStatus, thread.role, thread.segment]);

  // Bottom slot: ONE indicator only (priority: unread > warning > hourglass).
  const showUnread = thread.unreadCount > 0;
  const showWarning = !showUnread && thread.actionReason === "safety";
  const showHourglass =
    !showUnread &&
    !showWarning &&
    !!thread.actionReason &&
    thread.actionReason !== "done";

  return (
    <View style={styles.rail}>
      {/* (a) top: time/date */}
      <View style={styles.railSlotTop}>
        <Text style={styles.railTime}>{thread.timestamp}</Text>
      </View>

      {/* (b) middle: status chip (reserve space even if omitted) */}
      <View style={styles.railSlotMid}>
        {!!statusLabel ? (
          <View style={[styles.statusPill, thread.segment === "Deliveries" ? styles.statusPillDelivery : styles.statusPillRole]}>
            <Text style={[styles.statusText, thread.segment === "Deliveries" ? styles.statusTextDelivery : styles.statusTextRole]}>
              {statusLabel}
            </Text>
          </View>
        ) : (
          <View style={styles.railMidPlaceholder} />
        )}
      </View>

      {/* (c) bottom: ONE indicator (reserve space always) */}
      <View style={styles.railSlotBot}>
        {showUnread ? (
          <View style={styles.unread}>
            <Text style={styles.unreadText}>{thread.unreadCount}</Text>
          </View>
        ) : showWarning ? (
          <View style={styles.indicatorBox}>
            <Ionicons name="warning-outline" size={16} color={MUTED} />
          </View>
        ) : showHourglass ? (
          <View style={styles.indicatorBox}>
            <Ionicons name="hourglass-outline" size={16} color={MUTED} />
          </View>
        ) : (
          <View style={styles.indicatorBox} />
        )}
      </View>
    </View>
  );
}

function Avatar({ name, url }: { name: string; url: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <View style={styles.avatar}>
      {!loaded && <View style={styles.avatarSkeleton} />}
      {!failed ? (
        <Image
          source={{ uri: url }}
          style={styles.avatarImg}
          resizeMode="cover"
          onLoadEnd={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
        />
      ) : (
        <Text style={styles.avatarText}>{initials(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: "rgba(231,234,240,0.85)",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    ...shadow(),
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(231,234,240,0.9)",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarSkeleton: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.45)" },
  avatarText: { color: TEXT, fontSize: 14, fontWeight: "900" },

  center: { flex: 1, minWidth: 0 },
  name: { flex: 1, color: TEXT, fontSize: 15, fontWeight: "900" },
  title: { marginTop: 6, color: TEXT, fontSize: 14, fontWeight: "800" },
  snippet: { marginTop: 6, color: MUTED, fontSize: 12, fontWeight: "700" },

  // STRICT right rail: fixed width + 3 slots (time / status / one indicator)
  rail: { width: 100, alignItems: "flex-end" },
  railSlotTop: { height: 18, justifyContent: "flex-start" },
  railTime: { color: MUTED, fontSize: 12, fontWeight: "700", textAlign: "right" },
  railSlotMid: { height: 24, justifyContent: "center", marginTop: 8 },
  railMidPlaceholder: { height: 22, width: 72 },
  railSlotBot: { height: 24, justifyContent: "flex-end", alignItems: "center", marginTop: 8 },

  statusPill: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPillRole: { backgroundColor: "rgba(31,103,255,0.10)", borderColor: "rgba(31,103,255,0.18)" },
  statusTextRole: { color: BLUE, fontSize: 10, fontWeight: "900", letterSpacing: 0.3 },
  statusPillDelivery: { backgroundColor: "rgba(17,17,17,0.04)", borderColor: BORDER },
  statusTextDelivery: { color: TEXT, fontSize: 10, fontWeight: "900", letterSpacing: 0.5 },
  statusText: { fontSize: 10, fontWeight: "900" },

  indicatorBox: { width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  unread: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: { color: "#fff", fontSize: 11, fontWeight: "900" },
});

