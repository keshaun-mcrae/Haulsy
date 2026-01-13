import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Filter } from "../types";

const TEXT = "#0B1220";
const BORDER = "#E7EAF0";
const BLUE = "#1F67FF";

export function FilterChips({
  value,
  onChange,
  actionNeededCount,
}: {
  value: Filter;
  onChange: (v: Filter) => void;
  actionNeededCount: number;
}) {
  return (
    <View style={styles.row}>
      <Chip title="All" active={value === "All"} onPress={() => onChange("All")} />
      <Chip title="Buying" active={value === "Buying"} onPress={() => onChange("Buying")} />
      <Chip title="Selling" active={value === "Selling"} onPress={() => onChange("Selling")} />
      <ActionNeededChip active={value === "Action needed"} count={actionNeededCount} onPress={() => onChange("Action needed")} />
    </View>
  );
}

function Chip({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.92 }]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{title}</Text>
    </Pressable>
  );
}

function ActionNeededChip({ active, count, onPress }: { active: boolean; count: number; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.92 }]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>Action needed</Text>
      <View style={[styles.badge, active ? styles.badgeActive : styles.badgeInactive]}>
        <Text style={[styles.badgeText, active ? styles.badgeTextActive : styles.badgeTextInactive]}>{count}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: 12, flexDirection: "row", gap: 10, flexWrap: "wrap" },
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  chipActive: { backgroundColor: BLUE, borderColor: "rgba(31,103,255,0.40)" },
  chipText: { color: TEXT, fontSize: 12, fontWeight: "800" },
  chipTextActive: { color: "#FFFFFF" },
  badge: { minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 5, alignItems: "center", justifyContent: "center" },
  badgeActive: { backgroundColor: "rgba(255,255,255,0.22)" },
  badgeInactive: { backgroundColor: "rgba(17,17,17,0.10)" },
  badgeText: { fontSize: 11, fontWeight: "900" },
  badgeTextActive: { color: "#FFFFFF" },
  badgeTextInactive: { color: TEXT },
});

