import React, { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterChips } from "../components/FilterChips";
import { SegmentedSwitch } from "../components/SegmentedSwitch";
import { ThreadRow } from "../components/ThreadRow";
import { getThreads } from "../mockData";
import type { Filter, Segment, Thread } from "../types";

const PAGE_BG = "#F6F7FB";
const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";

function matchesFilter(t: Thread, f: Filter) {
  if (f === "All") return true;
  if (f === "Buying") return t.role === "buying";
  if (f === "Selling") return t.role === "selling";
  // Action needed
  return !!t.actionReason && t.actionReason !== "done";
}

export function ChatInboxScreen() {
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState("");
  const [segment, setSegment] = useState<Segment>("Marketplace");
  const [filter, setFilter] = useState<Filter>("All");

  const base = useMemo(() => getThreads(segment), [segment]);
  const actionNeededCount = useMemo(() => base.filter((t) => !!t.actionReason && t.actionReason !== "done").length, [base]);

  const data = useMemo(() => {
    const query = q.trim().toLowerCase();
    return base
      .filter((t) => matchesFilter(t, filter))
      .filter((t) => {
        if (!query) return true;
        return t.name.toLowerCase().includes(query) || t.listingTitle.toLowerCase().includes(query);
      });
  }, [base, filter, q]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={MUTED} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search chats…"
              placeholderTextColor={MUTED}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
          <Pressable onPress={() => console.log("Settings")} hitSlop={10} style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.9 }]}>
            <Ionicons name="settings-outline" size={18} color={TEXT} />
          </Pressable>
        </View>

        <SegmentedSwitch value={segment} onChange={setSegment} />
        <FilterChips value={filter} onChange={setFilter} actionNeededCount={actionNeededCount} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <ThreadRow
            thread={item}
            onPress={() => router.push({ pathname: "/(tabs)/chat/[threadId]", params: { threadId: item.id } } as any)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: 16 + insets.bottom + 88 }]}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        initialNumToRender={8}
        windowSize={10}
        removeClippedSubviews
        ListEmptyComponent={<EmptyState segment={segment} />}
      />
    </SafeAreaView>
  );
}

function EmptyState({ segment }: { segment: Segment }) {
  if (segment === "Deliveries") {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Ionicons name="cube-outline" size={22} color={MUTED} />
        </View>
        <Text style={styles.emptyTitle}>No deliveries yet</Text>
        <Text style={styles.emptyBody}>When you request delivery, updates will appear here.</Text>
      </View>
    );
  }
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color={MUTED} />
      </View>
      <Text style={styles.emptyTitle}>No chats match your filters</Text>
      <Text style={styles.emptyBody}>Try changing filters or search.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PAGE_BG },
  top: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, backgroundColor: PAGE_BG },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchBar: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: { flex: 1, color: TEXT, fontSize: 15, fontWeight: "600" },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingHorizontal: 16, paddingTop: 0 },
  emptyCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    alignItems: "center",
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(17,17,17,0.04)",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { marginTop: 12, color: TEXT, fontSize: 15, fontWeight: "900" },
  emptyBody: { marginTop: 8, color: MUTED, fontSize: 13, fontWeight: "600", textAlign: "center" },
});

