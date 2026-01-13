import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { HaulsyIQState } from "../types";

const CARD_BG = "#FFFFFF";
const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";
const BLUE = "#1F67FF";
const PURPLE = "#7C3AED";

function shadow() {
  if (Platform.OS === "android") return { elevation: 6 };
  return { shadowColor: "#0B1220", shadowOpacity: 0.10, shadowRadius: 18, shadowOffset: { width: 0, height: 12 } };
}

export function HaulsyIQStrip({
  state,
  onPress,
}: {
  state: HaulsyIQState;
  onPress: () => void;
}) {
  const active = state.assistantOn && !state.pausedForChat;
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.bar, pressed && { opacity: 0.94 }]}>
        <View style={styles.left}>
          <View style={styles.sparkle}>
            <Ionicons name="sparkles" size={14} color="#fff" />
          </View>
          <Text style={styles.title}>HaulsyIQ</Text>
        </View>
        <View style={styles.right}>
          <View style={[styles.pill, active ? styles.pillOn : styles.pillOff]}>
            <Text style={[styles.pillText, active ? styles.pillTextOn : styles.pillTextOff]}>
              {active ? "Assistant On" : "Assistant Off"}
            </Text>
          </View>
          <Ionicons name="chevron-up" size={18} color={MUTED} />
        </View>
      </Pressable>
      {!!state.lastAction && <Text style={styles.sub}>Last action: {state.lastAction}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 10 },
  bar: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadow(),
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  sparkle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: TEXT, fontSize: 13, fontWeight: "900" },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  pill: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pillOn: { backgroundColor: "rgba(31,103,255,0.10)", borderColor: "rgba(31,103,255,0.18)" },
  pillOff: { backgroundColor: "rgba(17,17,17,0.04)", borderColor: BORDER },
  pillText: { fontSize: 12, fontWeight: "900" },
  pillTextOn: { color: BLUE },
  pillTextOff: { color: MUTED },
  sub: { marginTop: 6, marginLeft: 12, color: MUTED, fontSize: 11, fontWeight: "700" },
});

