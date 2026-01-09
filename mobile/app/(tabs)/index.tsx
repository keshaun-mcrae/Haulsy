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
import { ListingCard, type Listing } from "@/components/haulsy";

// Brand palette (strict roles)
const INK = "#111111";
const GRAY = "#6B7280";
const META = "#7A7F87";
const BORDER = "#E5E7EB";
const BORDER_SOFT = "#EEF2F7";
const BLUE = "#1E6BFF";
const PURPLE = "#7C3AED";

const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "IKEA Kallax Shelf (white)",
    price: 60,
    city: "Surrey",
    minutesAgo: 12,
    badge: "Good",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "2",
    title: "Nintendo Switch + 2 games",
    price: 280,
    city: "Vancouver",
    minutesAgo: 35,
    badge: "Like New",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "3",
    title: "Sectional Sofa (delivery avail.)",
    price: 350,
    city: "Burnaby",
    minutesAgo: 55,
    badge: "Fair",
    image:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "4",
    title: "MacBook Pro 14” (M2)",
    price: 1450,
    city: "Richmond",
    minutesAgo: 80,
    badge: "Good",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "5",
    title: "Vintage floor lamp (brass)",
    price: 45,
    city: "Coquitlam",
    minutesAgo: 8,
    badge: "Like New",
    image:
      "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "6",
    title: "Road bike • tuned • size M",
    price: 520,
    city: "New West",
    minutesAgo: 22,
    badge: "Good",
    image:
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "7",
    title: "KitchenAid stand mixer",
    price: 220,
    city: "Vancouver",
    minutesAgo: 65,
    badge: "Good",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "8",
    title: "Navy wool coat (men’s L)",
    price: 70,
    city: "Burnaby",
    minutesAgo: 41,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=60",
  },
];

const SEGMENTS = ["Sell", "For you", "Local", "Categories"] as const;

export default function HomeScreen() {
  const [segment, setSegment] = useState<(typeof SEGMENTS)[number]>("For you");

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
        renderItem={({ item }) => <ListingCard item={item} />}
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
                const active = segment === label;
                return (
                  <Pressable
                    onPress={() => setSegment(label)}
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
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  segmentActive: {
    backgroundColor: "rgba(30,107,255,0.12)",
    borderColor: "rgba(30,107,255,0.28)",
  },
  segmentText: { fontSize: 13, fontWeight: "600" },
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
