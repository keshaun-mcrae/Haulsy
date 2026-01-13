import React from "react";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HAULSY } from "@/constants/haulsyTheme";
import { RECENT_ACTIVITY } from "../mockData";

function shadow() {
  return Platform.OS === "ios" ? HAULSY.shadow.ios : HAULSY.shadow.android;
}

export function EarnHistoryScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={HAULSY.colors.text} />
        </Pressable>
        <Text style={styles.title}>Earnings history</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={[styles.card, shadow()]}>
        {RECENT_ACTIVITY.map((a, idx) => (
          <View key={a.id} style={[styles.row, idx !== 0 && styles.rowBorder]}>
            <Text style={styles.text}>{a.text}</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.amt}>{a.amountLabel}</Text>
              <Text style={styles.when}>{a.when}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: HAULSY.colors.bg },
  header: {
    paddingHorizontal: HAULSY.spacing.md,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: HAULSY.colors.card,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: HAULSY.colors.text, fontSize: 15, fontWeight: "900" },
  card: {
    marginTop: 10,
    marginHorizontal: HAULSY.spacing.md,
    backgroundColor: HAULSY.colors.card,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    borderRadius: HAULSY.radius.lg,
    overflow: "hidden",
  },
  row: { paddingHorizontal: HAULSY.spacing.md, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", gap: 10 },
  rowBorder: { borderTopWidth: 1, borderTopColor: HAULSY.colors.border },
  text: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "800" },
  amt: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },
  when: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700", marginTop: 2 },
});

