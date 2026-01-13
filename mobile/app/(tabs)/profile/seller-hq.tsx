import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "@/components/haulsy";

export default function SellerHqScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.9 }]}>
          <Ionicons name="chevron-back" size={22} color={HAULSY.colors.text} />
        </Pressable>
        <Text style={styles.title}>Seller HQ</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Selling</Text>
          <Text style={styles.sub}>Quick entry points to listings and selling settings (MVP placeholder).</Text>
          <View style={styles.btnRow}>
            <Pressable onPress={() => console.log("Create listing")} style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}>
              <Text style={styles.primaryText}>Create listing</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/(tabs)/profile/seller-settings")} style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.92 }]}>
              <Text style={styles.secondaryText}>Seller settings</Text>
            </Pressable>
          </View>
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
  sub: { marginTop: 6, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  btnRow: { marginTop: 12, flexDirection: "row", gap: 10 },
  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: HAULSY.radius.md,
    backgroundColor: HAULSY.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", ...HAULSY.typography.button },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: HAULSY.radius.md,
    backgroundColor: HAULSY.colors.card,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { color: HAULSY.colors.text, ...HAULSY.typography.button },
});

