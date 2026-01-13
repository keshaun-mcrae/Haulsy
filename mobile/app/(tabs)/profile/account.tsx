import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "@/components/haulsy";

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.9 }]}>
          <Ionicons name="chevron-back" size={22} color={HAULSY.colors.text} />
        </Pressable>
        <Text style={styles.title}>Account</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <Pressable onPress={() => router.push("/(tabs)/profile/security")} style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
            <View style={styles.rowIcon}>
              <Ionicons name="lock-closed-outline" size={18} color={HAULSY.colors.icon} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.rowTitle}>Security</Text>
              <Text style={styles.rowSub}>ID, phone, and email verification</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={HAULSY.colors.icon} />
          </Pressable>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: HAULSY.colors.bg },
  header: {
    paddingHorizontal: HAULSY.spacing.md,
    paddingTop: HAULSY.spacing.sm,
    paddingBottom: HAULSY.spacing.sm,
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
  content: { paddingHorizontal: HAULSY.spacing.md, paddingTop: 8 },
  card: { padding: HAULSY.spacing.md },
  cardTitle: { color: HAULSY.colors.text, ...HAULSY.typography.h2 },
  row: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: HAULSY.colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { color: HAULSY.colors.text, fontWeight: "900" },
  rowSub: { color: HAULSY.colors.subtext, marginTop: 4, ...HAULSY.typography.caption },
});

