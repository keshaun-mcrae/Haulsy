import React, { useMemo } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "@/components/haulsy";
import { defaultsForVehicle, setDriverSettings, useDriverSettings, type VehicleType } from "@/src/features/driver/settingsStore";

export default function DriverDetailsScreen() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const driver = useDriverSettings();

  const fuelEstimate = useMemo(() => {
    if (!driver.fuelEconomyLPer100Km || !driver.gasPricePerLiter) return null;
    const perKm = (driver.fuelEconomyLPer100Km / 100) * driver.gasPricePerLiter;
    return `$${perKm.toFixed(2)}/km`;
  }, [driver.fuelEconomyLPer100Km, driver.gasPricePerLiter]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.9 }]}>
          <Ionicons name="chevron-back" size={22} color={HAULSY.colors.text} />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Driver</Text>
          <Text style={styles.sub}>Setup & details</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <View style={{ paddingHorizontal: HAULSY.spacing.md, gap: 12 }}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Checklist</Text>

          <Row
            title="Verification"
            value={driver.verified ? "Verified" : "Not verified"}
            rightAction={driver.verified ? "View" : "Start"}
            onPress={() => {
              if (driver.verified) {
                Alert.alert("Verification", "You’re verified. (MVP placeholder)");
                return;
              }
              Alert.alert("Start verification?", "This is a placeholder flow. Mark as verified?", [
                { text: "Cancel", style: "cancel" },
                { text: "Mark verified", onPress: () => setDriverSettings({ verified: true }) },
              ]);
            }}
            highlight={focus === "verify"}
          />

          <Row
            title="Payout method"
            value={driver.hasPayoutMethod ? "Set" : "Not set"}
            rightAction={driver.hasPayoutMethod ? "Edit" : "Add"}
            onPress={() => {
              if (driver.hasPayoutMethod) {
                Alert.alert("Payout method", "Edit payout method (MVP placeholder).", [
                  { text: "Close" },
                  { text: "Remove", style: "destructive", onPress: () => setDriverSettings({ hasPayoutMethod: false }) },
                ]);
                return;
              }
              Alert.alert("Add payout method?", "This is a placeholder flow. Mark as set?", [
                { text: "Cancel", style: "cancel" },
                { text: "Mark set", onPress: () => setDriverSettings({ hasPayoutMethod: true }) },
              ]);
            }}
            highlight={focus === "payout"}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Vehicle & Costs</Text>
          <Text style={styles.cardSub}>These settings power net earnings and gas estimates.</Text>

          <View style={styles.vehiclePills}>
            {(["Sedan", "SUV", "Truck", "Van"] as VehicleType[]).map((t) => {
              const active = driver.vehicleType === t;
              return (
                <Pressable
                  key={t}
                  onPress={() =>
                    setDriverSettings({
                      vehicleType: t,
                      fuelEconomyLPer100Km: defaultsForVehicle(t),
                      gasPricePerLiter: driver.gasPricePerLiter ?? 1.79,
                    })
                  }
                  style={({ pressed }) => [styles.vPill, active && styles.vPillActive, pressed && { opacity: 0.92 }]}
                >
                  <Text style={[styles.vPillText, active && styles.vPillTextActive]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.costRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.costLabel}>Fuel economy (L/100km)</Text>
              <TextInput
                value={driver.fuelEconomyLPer100Km?.toString() ?? ""}
                onChangeText={(txt) => {
                  const n = Number(txt.replace(/[^0-9.]/g, ""));
                  if (!Number.isFinite(n)) return;
                  setDriverSettings({ fuelEconomyLPer100Km: n });
                }}
                keyboardType="decimal-pad"
                placeholder="9.5"
                placeholderTextColor={HAULSY.colors.subtext}
                style={styles.costInput}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.costLabel}>Gas price ($/L)</Text>
              <TextInput
                value={driver.gasPricePerLiter?.toString() ?? ""}
                onChangeText={(txt) => {
                  const n = Number(txt.replace(/[^0-9.]/g, ""));
                  if (!Number.isFinite(n)) return;
                  setDriverSettings({ gasPricePerLiter: n });
                }}
                keyboardType="decimal-pad"
                placeholder="1.79"
                placeholderTextColor={HAULSY.colors.subtext}
                style={styles.costInput}
              />
            </View>
          </View>

          <Row
            title="Round trip default"
            value={driver.defaultIncludeReturn ? "ON" : "OFF"}
            right={
              <Switch
                value={driver.defaultIncludeReturn}
                onValueChange={(v) => setDriverSettings({ defaultIncludeReturn: v })}
                trackColor={{ false: "rgba(17,17,17,0.12)", true: "rgba(37,99,255,0.22)" }}
                thumbColor={driver.defaultIncludeReturn ? HAULSY.colors.primary : "#F3F4F6"}
              />
            }
            highlight={focus === "vehicle"}
          />

          <View style={styles.hintRow}>
            <Ionicons name="information-circle-outline" size={16} color={HAULSY.colors.icon} />
            <Text style={styles.hintText}>Fuel estimate: {fuelEstimate ?? "—"}</Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

function Row({
  title,
  value,
  right,
  rightAction,
  onPress,
  highlight,
}: {
  title: string;
  value: string;
  right?: React.ReactNode;
  rightAction?: string;
  onPress?: () => void;
  highlight?: boolean;
}) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.rowPress, highlight && styles.rowHighlight, pressed && { opacity: 0.92 }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowValue}>{value}</Text>
        </View>
        <View style={styles.rowRight}>
          {!!rightAction && <Text style={styles.rowAction}>{rightAction}</Text>}
          <Ionicons name="chevron-forward" size={18} color={HAULSY.colors.icon} />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, highlight && styles.rowHighlight]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {right ?? null}
    </View>
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
  sub: { marginTop: 4, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },

  card: { padding: HAULSY.spacing.md },
  cardTitle: { color: HAULSY.colors.text, ...HAULSY.typography.h2 },
  cardSub: { marginTop: 6, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },

  row: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: HAULSY.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rowPress: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: HAULSY.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowAction: { color: HAULSY.colors.primary, fontWeight: "900" },
  rowHighlight: { borderTopColor: "rgba(37,99,255,0.22)" },
  rowTitle: { color: HAULSY.colors.text, fontWeight: "900" },
  rowValue: { marginTop: 4, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },

  vehiclePills: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  vPill: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: HAULSY.radius.pill,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  vPillActive: { backgroundColor: HAULSY.colors.primarySoft, borderColor: "rgba(37,99,255,0.25)" },
  vPillText: { color: HAULSY.colors.text, fontWeight: "900", fontSize: 12 },
  vPillTextActive: { color: HAULSY.colors.primary },

  costRow: { marginTop: 12, flexDirection: "row", alignItems: "flex-end" },
  costLabel: { color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  costInput: {
    marginTop: 8,
    height: 42,
    borderRadius: HAULSY.radius.md,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: HAULSY.colors.bg,
    paddingHorizontal: 12,
    color: HAULSY.colors.text,
    fontWeight: "800",
  },

  hintRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  hintText: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },
});

