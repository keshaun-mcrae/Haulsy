import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { Segment } from "../types";

const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";

function shadowSelected() {
  if (Platform.OS === "android") return { elevation: 2 };
  return { shadowColor: "#0B1220", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } };
}

export function SegmentedSwitch({
  value,
  onChange,
}: {
  value: Segment;
  onChange: (v: Segment) => void;
}) {
  return (
    <View style={styles.wrap}>
      <SegBtn
        title="Marketplace"
        icon="chatbubble-outline"
        active={value === "Marketplace"}
        onPress={() => onChange("Marketplace")}
      />
      <SegBtn
        title="Deliveries"
        icon="cube-outline"
        active={value === "Deliveries"}
        onPress={() => onChange("Deliveries")}
      />
    </View>
  );
}

function SegBtn({
  title,
  icon,
  active,
  onPress,
}: {
  title: Segment;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, active && styles.btnActive, pressed && { opacity: 0.92 }]}>
      <Ionicons name={icon} size={16} color={active ? TEXT : MUTED} />
      <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    padding: 4,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    gap: 6,
  },
  btn: {
    flex: 1,
    height: 38,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    ...shadowSelected(),
  },
  text: { fontSize: 13, fontWeight: "800" },
  textActive: { color: TEXT },
  textInactive: { color: MUTED },
});

