import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "@/components/haulsy";
import { useAccountTrust } from "@/src/features/profile/accountStore";

function statusTextForId(idStatus: string) {
  if (idStatus === "ID_VERIFIED") return "Verified";
  if (idStatus === "ID_PENDING" || idStatus === "ID_IN_REVIEW") return "Pending";
  return "Not set";
}

function statusText(s: string) {
  if (s === "VERIFIED") return "Verified";
  if (s === "PENDING" || s === "IN_REVIEW") return "Pending";
  return "Not set";
}

export default function SecurityScreen() {
  const trust = useAccountTrust();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.9 }]}>
          <Ionicons name="chevron-back" size={22} color={HAULSY.colors.text} />
        </Pressable>
        <Text style={styles.title}>Security</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <SecurityRow
            icon="shield-checkmark-outline"
            title="ID verification"
            status={statusTextForId(trust.idStatus)}
            onPress={() => router.push("/(tabs)/profile/verification")}
          />
          <SecurityRow
            icon="call-outline"
            title="Phone verification"
            status={statusText(trust.phoneStatus)}
            onPress={() => console.log("Phone verification flow")}
          />
          <SecurityRow
            icon="mail-outline"
            title="Email verification"
            status={statusText(trust.emailStatus)}
            onPress={() => console.log("Email verification flow")}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}

function SecurityRow({
  icon,
  title,
  status,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  status: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={HAULSY.colors.icon} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{status}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={HAULSY.colors.icon} />
    </Pressable>
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
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
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

