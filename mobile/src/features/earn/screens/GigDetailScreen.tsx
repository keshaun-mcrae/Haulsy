import React, { useMemo, useState } from "react";
import { Alert, Platform, Pressable, SafeAreaView, StyleSheet, Text, View, Switch, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HAULSY } from "@/constants/haulsyTheme";

import { acceptGig, useEarnStore } from "../store";
import { formatMoney, gasEstimate, round2 } from "../utils";
import { useDriverSettings } from "@/src/features/driver/settingsStore";

function shadow() {
  return Platform.OS === "ios" ? HAULSY.shadow.ios : HAULSY.shadow.android;
}

export function GigDetailScreen() {
  const insets = useSafeAreaInsets();
  const { gigId } = useLocalSearchParams<{ gigId: string }>();
  const store = useEarnStore();
  const gig = useMemo(() => store.gigs.find((g) => g.id === String(gigId)), [gigId, store.gigs]);
  const driver = useDriverSettings();

  const hasCosts = !!driver.fuelEconomyLPer100Km && !!driver.gasPricePerLiter && !!driver.vehicleType;
  const [includeReturn, setIncludeReturn] = useState(!!driver.defaultIncludeReturn);

  if (!gig) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color={HAULSY.colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Gig</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: HAULSY.colors.subtext, fontWeight: "700" }}>Gig not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const baseDistance = gig.routeDistanceKm;
  const distanceKm = includeReturn ? baseDistance * 1.5 : baseDistance;

  const est = hasCosts
    ? gasEstimate({
        distanceKm,
        litersPer100Km: driver.fuelEconomyLPer100Km!,
        gasPricePerLiter: driver.gasPricePerLiter!,
      })
    : null;

  const estGas = est ? round2(est.gasCost) : null;
  const net = estGas != null ? round2(gig.payout - estGas) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={HAULSY.colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Gig details</Text>
        <Pressable onPress={() => router.push("/(tabs)/profile")} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={18} color={HAULSY.colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: HAULSY.spacing.md, paddingBottom: 120 + insets.bottom }}
      >
        <View style={[styles.card, shadow()]}>
          <Text style={styles.kicker}>Net payout</Text>
          <Text style={styles.big}>{net != null ? formatMoney(net) : formatMoney(gig.payout)}</Text>
          <Text style={styles.sub}>
            Pays {formatMoney(gig.payout)}
            {estGas != null ? ` • Est. gas ${formatMoney(estGas)}` : ""}
            {` • Est. time ~${gig.etaMins} min`}
          </Text>

          <View style={styles.sep} />
          <Text style={styles.rowTitle}>Pickup & dropoff</Text>
          <Text style={styles.rowBody}>Pickup: {gig.pickupArea}</Text>
          <Text style={styles.rowBody}>Dropoff: {gig.dropoffArea}</Text>
          <Text style={styles.note}>Exact addresses are shared after you accept.</Text>

          <View style={styles.sep} />
          <Text style={styles.rowTitle}>Item</Text>
          <Text style={styles.rowBody}>Size: {gig.itemSize}</Text>
          <Text style={styles.rowBody}>Vehicle fit: {gig.vehicleFit}</Text>
          {gig.twoPersonLift && <Text style={styles.rowBody}>Requirement: 2-person lift</Text>}
        </View>

        {gig.state === "Active" && (
          <View style={[styles.card, shadow()]}>
            <Text style={styles.rowTitle}>Next steps</Text>
            <Text style={styles.sub}>You’ve accepted this gig. Navigate to pickup when ready.</Text>
            <Pressable
              onPress={() => console.log("Navigate to pickup")}
              style={({ pressed }) => [styles.secondaryAction, pressed && { opacity: 0.92 }]}
            >
              <Ionicons name="navigate-outline" size={18} color={HAULSY.colors.text} />
              <Text style={styles.secondaryActionText}>Navigate to pickup</Text>
            </Pressable>
          </View>
        )}

        <View style={[styles.card, shadow()]}>
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Estimated costs</Text>
            {!hasCosts && (
              <Pressable onPress={() => router.push("/(tabs)/profile")} hitSlop={10}>
                <Text style={styles.link}>Set vehicle</Text>
              </Pressable>
            )}
          </View>

          <Text style={styles.sub}>
            Route distance: {round2(distanceKm).toFixed(1)} km
          </Text>

          <View style={{ marginTop: 12, gap: 10 }}>
            <KV label="Driver → Pickup → Dropoff" value={`${round2(baseDistance).toFixed(1)} km`} />
            <KV label="Fuel economy" value={hasCosts ? `${driver.fuelEconomyLPer100Km!.toFixed(1)} L/100km` : "—"} />
            <KV label="Gas price" value={hasCosts ? `$${driver.gasPricePerLiter!.toFixed(2)}/L` : "—"} />
            <KV label="Est. gas cost" value={estGas != null ? formatMoney(estGas) : "—"} />
            <KV label="Est. net payout" value={net != null ? formatMoney(net) : "—"} strong />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Include return estimate</Text>
              <Text style={styles.sub}>Adds ~50% distance for returning to pickup area.</Text>
            </View>
            <Switch value={includeReturn} onValueChange={setIncludeReturn} />
          </View>

          <View style={styles.tipRow}>
            <Ionicons name="information-circle-outline" size={16} color={HAULSY.colors.icon} />
            <Text style={styles.tipText}>Estimate only. Traffic, detours, and idle time can change fuel use.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <Pressable
          disabled={gig.state === "Active"}
          onPress={() => {
            acceptGig(gig.id);
            // Placeholder: "create/route to delivery chat thread"
            Alert.alert("Gig accepted", "We’ll open a delivery chat next (MVP).", [
              {
                text: "Open chat",
                onPress: () => router.push("/(tabs)/chat"),
              },
              { text: "OK" },
            ]);
          }}
          style={({ pressed }) => [
            styles.acceptBtn,
            gig.state === "Active" && { opacity: 0.6 },
            pressed && gig.state !== "Active" && { opacity: 0.92 },
          ]}
        >
          <Text style={styles.acceptText}>{gig.state === "Active" ? "Gig active" : "Accept gig"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function KV({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.kvRow}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={[styles.kvValue, strong && styles.kvStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: HAULSY.colors.bg },
  topBar: {
    paddingHorizontal: HAULSY.spacing.md,
    paddingBottom: 10,
    backgroundColor: HAULSY.colors.bg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topTitle: { color: HAULSY.colors.text, fontWeight: "900", fontSize: 15 },
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

  card: {
    backgroundColor: HAULSY.colors.card,
    borderRadius: HAULSY.radius.lg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    padding: HAULSY.spacing.md,
    marginTop: 12,
  },
  kicker: { color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  big: { marginTop: 6, color: HAULSY.colors.text, fontSize: 34, fontWeight: "900" },
  sub: { marginTop: 6, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700", lineHeight: 16 },
  sep: { marginTop: 14, marginBottom: 12, height: 1, backgroundColor: HAULSY.colors.border },
  rowTitle: { color: HAULSY.colors.text, fontSize: 14, fontWeight: "900" },
  rowBody: { marginTop: 6, color: HAULSY.colors.text, fontSize: 13, fontWeight: "700" },
  note: { marginTop: 6, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },
  rowBetween: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  link: { color: HAULSY.colors.primary, fontSize: 12, fontWeight: "900" },

  kvRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  kvLabel: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800" },
  kvValue: { color: HAULSY.colors.text, fontSize: 12, fontWeight: "900" },
  kvStrong: { color: HAULSY.colors.primary },

  toggleRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: HAULSY.colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleTitle: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },
  tipRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  tipText: { flex: 1, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700", lineHeight: 16 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: HAULSY.spacing.md,
    paddingTop: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderTopWidth: 1,
    borderTopColor: HAULSY.colors.border,
    ...(Platform.OS === "ios" ? HAULSY.shadow.ios : { elevation: 10 }),
  },
  acceptBtn: {
    height: 52,
    borderRadius: HAULSY.radius.md,
    backgroundColor: HAULSY.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: { color: "#fff", fontSize: 14, fontWeight: "900" },

  secondaryAction: {
    marginTop: 12,
    height: 46,
    borderRadius: HAULSY.radius.md,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: HAULSY.colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryActionText: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },
});

