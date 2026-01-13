import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HAULSY } from "@/constants/haulsyTheme";
import { ListingCard } from "@/components/ListingCard";
import { MOCK_LISTINGS } from "@/lib/mockListings";
import { router } from "expo-router";

// Brand palette (strict roles)
const INK = "#111111";
const GRAY = "#6B7280";
const META = "#7A7F87";
const BORDER = "#E5E7EB";
const BORDER_SOFT = "#EEF2F7";
const BLUE = "#1E6BFF";
const PURPLE = "#7C3AED";

const LISTINGS = MOCK_LISTINGS;

const SEGMENTS = ["Sell", "For you", "Local", "Categories"] as const;

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<(typeof SEGMENTS)[number]>("For you");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={LISTINGS}
        numColumns={2}
        keyExtractor={(x) => x.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        columnWrapperStyle={styles.feedColumn}
        ItemSeparatorComponent={() => <View style={styles.feedSeparator} />}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } } as any)}
            isSaved={savedIds.has(item.id)}
            onToggleSave={() => toggleSave(item.id)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            {/* FB Marketplace-style header */}
            <View style={styles.topRow}>
              <View style={styles.brandRow}>
                <Text style={styles.title}>Haulsy</Text>
                <View style={styles.brandDot} />
              </View>
              <View style={styles.iconRow}>
                <HeaderActionButton icon="chatbubble-ellipses-outline" badge onPress={() => {}} />
                <HeaderActionButton icon="list-outline" onPress={() => {}} />
                <HeaderActionButton icon="search-outline" onPress={() => {}} />
              </View>
            </View>

            {/* Segmented row */}
            <FlatList
              data={SEGMENTS as unknown as string[]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(x) => x}
              contentContainerStyle={styles.segmentRow}
              renderItem={({ item }) => {
                const label = item as (typeof SEGMENTS)[number];
                const active = activeTab === label;
                return (
                  <Pressable
                    onPress={() => setActiveTab(label)}
                    style={({ pressed }) => [
                      styles.segmentItem,
                      active && styles.segmentActive,
                      pressed && { opacity: 0.92 },
                    ]}
                  >
                    <Text style={[styles.segmentText, active ? styles.segmentTextActive : styles.segmentTextInactive]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              }}
            />

            {/* Today's picks */}
            <View style={styles.picksRow}>
              <Text style={styles.picksTitle}>Today’s picks</Text>
              <View style={styles.picksRight}>
                <Ionicons name="location-outline" size={16} color={GRAY} />
                <Text style={styles.picksLocation}>Metro Vancouver</Text>
              </View>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function HeaderActionButton({
  icon,
  badge,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  badge?: boolean;
  onPress?: () => void;
}) {
  const SIZE = 34;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.headerIconBtn,
        {
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: pressed ? "rgba(30,107,255,0.10)" : "rgba(255,255,255,0.92)",
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={INK} />
      {!!badge && <View style={styles.headerIconBadge} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F8FC" },

  headerWrap: { paddingTop: 8, paddingBottom: 10, backgroundColor: HAULSY.colors.bg },

  topRow: {
    paddingHorizontal: HAULSY.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  brandRow: { flexDirection: "row", alignItems: "baseline" },
  title: { color: INK, fontSize: 28, fontWeight: "900" },
  brandDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: PURPLE, marginLeft: 6 },
  iconRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  headerIconBtn: {
    borderWidth: 1,
    borderColor: BORDER_SOFT,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  headerIconBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.92)",
  },

  segmentRow: {
    paddingHorizontal: HAULSY.spacing.md,
    paddingTop: 0,
    gap: 10,
    paddingBottom: 12,
  },
  segmentItem: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  segmentActive: {
    backgroundColor: "rgba(30,107,255,0.10)",
    borderColor: "rgba(30,107,255,0.25)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  segmentText: { fontSize: 14, fontWeight: "600" },
  segmentTextActive: { color: BLUE },
  segmentTextInactive: { color: INK },

  picksRow: {
    paddingHorizontal: HAULSY.spacing.md,
    paddingTop: 4,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  picksTitle: { color: INK, ...HAULSY.typography.h2 },
  picksRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  picksLocation: { color: GRAY, fontSize: 13, fontWeight: "700" },

  feedContent: { paddingBottom: 110, paddingHorizontal: 16 },
  feedColumn: { gap: 12 },
  feedSeparator: { height: 12 },
});
