import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card, Header } from "@/components/haulsy";
import { useDriverSettings, setDriverSettings } from "@/src/features/driver/settingsStore";
import { useAccountTrust } from "@/src/features/profile/accountStore";

type SettingRow = {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
};

function moneyPerKm({ fuelEconomyLPer100Km, gasPricePerLiter }: { fuelEconomyLPer100Km: number; gasPricePerLiter: number }) {
  // $/km = (L/100km)/100 * $/L
  return (fuelEconomyLPer100Km / 100) * gasPricePerLiter;
}

export default function ProfileScreen() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const driver = useDriverSettings();
  const trust = useAccountTrust();
  const [driverExpanded, setDriverExpanded] = useState(false);

  const user = {
    name: "Wes",
    handle: "@weshaulsy",
    rating: 4.9,
    itemsSold: 12,
    deliveries: 6,
  };

  // Demo HQ badge counts (MVP)
  const sellerActions = 2;
  const driverActions = 1;

  function formatBadge(n: number) {
    if (n <= 0) return null;
    return n > 9 ? "9+" : String(n);
  }

  const sellerBadge = formatBadge(sellerActions);
  const driverBadge = formatBadge(driverActions);

  const driverReady = !!driver.verified && !!driver.hasPayoutMethod && !!driver.vehicleType && !!driver.fuelEconomyLPer100Km && !!driver.gasPricePerLiter;
  const driverPillLabel = driverReady ? "Ready" : "Not ready";
  const setupDone = [driver.verified, driver.hasPayoutMethod, !!driver.vehicleType].filter(Boolean).length;
  const setupTotal = 3;
  const setupPct = setupDone / setupTotal;

  const vehicleSummary = useMemo(() => {
    const vt = driver.vehicleType ?? "Set vehicle";
    const fe = driver.fuelEconomyLPer100Km ? `${driver.fuelEconomyLPer100Km.toFixed(1)} L/100km` : "—";
    return `${vt} • ${fe}`;
  }, [driver.fuelEconomyLPer100Km, driver.vehicleType]);

  const fuelEstimate = useMemo(() => {
    if (!driver.fuelEconomyLPer100Km || !driver.gasPricePerLiter) return null;
    const v = moneyPerKm({ fuelEconomyLPer100Km: driver.fuelEconomyLPer100Km, gasPricePerLiter: driver.gasPricePerLiter });
    return `$${v.toFixed(2)}/km`;
  }, [driver.fuelEconomyLPer100Km, driver.gasPricePerLiter]);

  const idStatusLabel = useMemo(() => {
    if (trust.idStatus === "ID_VERIFIED") return "Verified";
    if (trust.idStatus === "ID_PENDING" || trust.idStatus === "ID_IN_REVIEW") return "Pending";
    return "Verify";
  }, [trust.idStatus]);
  const idStatusTone = trust.idStatus === "ID_VERIFIED" ? "good" : trust.idStatus === "ID_PENDING" || trust.idStatus === "ID_IN_REVIEW" ? "amber" : "neutral";

  const showIdBadge = trust.idStatus === "ID_VERIFIED" || trust.idStatus === "ID_PENDING" || trust.idStatus === "ID_IN_REVIEW";
  const idBadgeTone = trust.idStatus === "ID_VERIFIED" ? "good" : "amber";
  const idBadgeIcon: React.ComponentProps<typeof Ionicons>["name"] = trust.idStatus === "ID_VERIFIED" ? "shield-checkmark" : "time";

  const SETTINGS: SettingRow[] = [
    { id: "s1", title: "Account", subtitle: "Personal info, trust, security", icon: "person-circle-outline", onPress: () => router.push("/(tabs)/profile/account") },
    { id: "s2", title: "Payments & payouts", subtitle: "Cash out, escrow, history", icon: "card-outline", onPress: () => router.push("/(tabs)/profile/payments") },
    { id: "s3", title: "Addresses", subtitle: "Pickup locations, delivery notes", icon: "location-outline", onPress: () => router.push("/(tabs)/profile/addresses") },
    { id: "s4", title: "Seller settings", subtitle: "Listings, payouts, secure checkout", icon: "storefront-outline", onPress: () => router.push("/(tabs)/profile/seller-settings") },
    { id: "s5", title: "Driver settings", subtitle: "Verification, payout, vehicle", icon: "car-outline", onPress: () => router.push("/(tabs)/profile/driver") },
    { id: "s6", title: "Notifications", subtitle: "Messages, offers, pickups", icon: "notifications-outline", onPress: () => console.log("Notifications") },
    { id: "s7", title: "Privacy & safety", subtitle: "Blocked users, reporting, safety tips", icon: "shield-outline", onPress: () => router.push("/(tabs)/profile/privacy") },
    { id: "s8", title: "Rewards", subtitle: "Earn credits, referrals", icon: "gift-outline", onPress: () => router.push("/(tabs)/profile/rewards") },
    { id: "s9", title: "Help & support", subtitle: "FAQs and contact", icon: "help-circle-outline", onPress: () => console.log("Help") },
    { id: "s10", title: "Terms & policies", subtitle: "Legal, app version", icon: "document-text-outline", onPress: () => router.push("/(tabs)/profile/about") },
  ];

  const highlightDriver = focus === "payout" || focus === "verify" || focus === "vehicle";

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Profile" subtitle="Your account & settings" />

      <FlatList
        data={SETTINGS}
        keyExtractor={(x) => x.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Card style={styles.profileCard}>
              <View style={styles.profileTop}>
                <View style={styles.avatarWrap}>
                  <Image
                    source={{ uri: "https://i.pravatar.cc/200?img=32" }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />

                  {showIdBadge && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Verification status"
                      onPress={() => router.push("/(tabs)/profile/verification")}
                      hitSlop={8}
                      style={styles.avatarBadgeHit}
                    >
                      <View style={[styles.avatarBadge, idBadgeTone === "good" ? styles.badgeGood : styles.badgeAmber]}>
                        <Ionicons name={idBadgeIcon} size={16} color={idBadgeTone === "good" ? "#fff" : "#111"} />
                      </View>
                    </Pressable>
                  )}
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.handle}>{user.handle}</Text>
                  <Pressable
                    onPress={() => router.push("/(tabs)/profile/verification")}
                    style={({ pressed }) => [styles.idRow, pressed && { opacity: 0.92 }]}
                  >
                    <View style={styles.idRowLeft}>
                      <Ionicons name="shield-checkmark-outline" size={16} color={HAULSY.colors.icon} />
                      <Text numberOfLines={1} style={styles.idRowTitle}>
                        ID verification
                      </Text>
                    </View>

                    <View style={styles.idRowRight}>
                      <View
                        style={[
                          styles.idStatusChip,
                          idStatusTone === "good"
                            ? styles.idStatusChipGood
                            : idStatusTone === "amber"
                              ? styles.idStatusChipAmber
                              : styles.idStatusChipNeutral,
                        ]}
                      >
                        <Text
                          style={[
                            styles.idStatusText,
                            idStatusTone === "good"
                              ? styles.idStatusTextGood
                              : idStatusTone === "amber"
                                ? styles.idStatusTextAmber
                                : styles.idStatusTextNeutral,
                          ]}
                        >
                          {idStatusLabel}
                        </Text>
                      </View>

                      <View style={styles.chevSlot}>
                        <Ionicons name="chevron-forward" size={16} color={HAULSY.colors.icon} />
                      </View>
                    </View>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => console.log("Edit profile")}
                  style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.92 }]}
                >
                  <Ionicons name="create-outline" size={16} color={HAULSY.colors.primary} />
                  <Text style={styles.editText}>Edit profile</Text>
                </Pressable>
              </View>

              <View style={styles.statsRow}>
                <Stat label="Rating" value={user.rating.toFixed(1)} icon="star" />
                <View style={styles.divider} />
                <Stat label="Items sold" value={`${user.itemsSold}`} icon="pricetag" />
                <View style={styles.divider} />
                <Stat label="Deliveries completed" value={`${user.deliveries}`} icon="bicycle" />
              </View>
            </Card>

            <View style={styles.quickActionsWrap}>
              <Text style={styles.quickTitle}>Quick actions</Text>
              <View style={styles.quickGrid}>
                <QuickPill icon="add-circle-outline" label="Create listing" onPress={() => console.log("Create listing")} />
                <QuickPill
                  icon="sparkles"
                  label="Smart Scan"
                  accent="purple"
                  onPress={() => console.log("Smart Scan")}
                />
                <QuickPill
                  icon="storefront-outline"
                  label="Seller HQ"
                  badge={sellerBadge}
                  accessibilityLabel={sellerActions > 0 ? `Seller HQ, ${sellerActions} actions pending` : "Seller HQ"}
                  onPress={() => router.push("/(tabs)/profile/seller-hq")}
                />
                <QuickPill
                  icon="car-outline"
                  label="Driver HQ"
                  badge={driverBadge}
                  accessibilityLabel={driverActions > 0 ? `Driver HQ, ${driverActions} actions pending` : "Driver HQ"}
                  onPress={() => router.push("/(tabs)/profile/driver-hq")}
                />
              </View>
            </View>

            <Card style={[styles.driverCard, highlightDriver && styles.driverCardHighlight]}>
              <Pressable
                onPress={() => setDriverExpanded((v) => !v)}
                style={({ pressed }) => [styles.driverHeader, pressed && { opacity: 0.95 }]}
              >
                <View style={styles.driverLeft}>
                  <View style={styles.driverIcon}>
                    <Ionicons name="car-outline" size={18} color={HAULSY.colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.driverTitle}>Driver status</Text>
                    {!!driverExpanded && <Text style={styles.driverSub}>Collapse</Text>}
                  </View>
                </View>
                <View style={styles.driverHeaderRight}>
                  <View style={[styles.statusPill, driverReady ? styles.statusPillGood : styles.statusPillNeutral]}>
                    <Text style={[styles.statusPillText, driverReady ? styles.statusTextGood : styles.statusTextNeutral]}>{driverPillLabel}</Text>
                  </View>
                  {driverExpanded ? (
                    <View style={styles.collapseAffordance}>
                      <Text style={styles.collapseText}>Collapse</Text>
                      <Ionicons name="chevron-up" size={18} color={HAULSY.colors.icon} />
                    </View>
                  ) : (
                    <Ionicons name="chevron-down" size={18} color={HAULSY.colors.icon} />
                  )}
                </View>
              </Pressable>

              <Text style={styles.progressLabel}>Setup {setupDone}/{setupTotal} complete</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.round(setupPct * 100)}%` }]} />
              </View>

              {!driverExpanded ? (
                <Pressable
                  onPress={() => {
                    if (!driverReady) {
                      router.push("/(tabs)/profile/driver");
                      return;
                    }
                    if (driverReady && !driver.availabilityOnline) {
                      setDriverSettings({ availabilityOnline: true });
                      return;
                    }
                    router.push("/(tabs)/earn");
                  }}
                  style={({ pressed }) => [styles.driverPrimaryBtn, pressed && { opacity: 0.92 }]}
                >
                  <Text style={styles.driverPrimaryText}>
                    {!driverReady ? "Continue setup" : driver.availabilityOnline ? "View gigs" : "Go online"}
                  </Text>
                </Pressable>
              ) : (
                <>
                  <SettingRow
                    title="Verification"
                    subtitle={driver.verified ? "Verified" : "Not verified"}
                    action={driver.verified ? "View" : "Start"}
                    onPress={() => router.push({ pathname: "/(tabs)/profile/driver", params: { focus: "verify" } } as any)}
                  />
                  <SettingRow
                    title="Payout method"
                    subtitle={driver.hasPayoutMethod ? "Set" : "Not set"}
                    action={driver.hasPayoutMethod ? "Edit" : "Add"}
                    onPress={() => router.push({ pathname: "/(tabs)/profile/driver", params: { focus: "payout" } } as any)}
                  />
                  <SettingRow
                    title="Vehicle"
                    subtitle={vehicleSummary}
                    action="Edit"
                    onPress={() => router.push({ pathname: "/(tabs)/profile/driver", params: { focus: "vehicle" } } as any)}
                  />

                  <View style={styles.driverInfoRow}>
                    <Ionicons name="information-circle-outline" size={16} color={HAULSY.colors.icon} />
                    <Text style={styles.driverSummaryText}>
                      Fuel estimate: {fuelEstimate ?? "Set vehicle"} • Round trip default: {driver.defaultIncludeReturn ? "ON" : "OFF"}
                    </Text>
                  </View>

                  <View style={styles.availabilityRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.availabilityTitle}>{driver.availabilityOnline ? "Online" : "Offline"}</Text>
                      <Text style={styles.availabilityHint}>Go online to receive gigs.</Text>
                    </View>
                    <Switch
                      value={driver.availabilityOnline}
                      onValueChange={(v) => setDriverSettings({ availabilityOnline: v })}
                      trackColor={{ false: "rgba(17,17,17,0.12)", true: "rgba(37,99,255,0.22)" }}
                      thumbColor={driver.availabilityOnline ? HAULSY.colors.primary : "#F3F4F6"}
                    />
                  </View>
                </>
              )}
            </Card>

            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: HAULSY.spacing.sm }} />}
        renderItem={({ item }) => (
          <Pressable onPress={item.onPress} style={({ pressed }) => [pressed && { opacity: 0.95 }]}>
            <Card variant="surface" style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Ionicons name={item.icon} size={18} color={HAULSY.colors.icon} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                {!!item.subtitle && <Text style={styles.settingSub}>{item.subtitle}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={18} color={HAULSY.colors.icon} />
            </Card>
          </Pressable>
        )}
        ListFooterComponent={
          <View style={{ paddingTop: HAULSY.spacing.lg }}>
            <Pressable onPress={() => console.log("Log out")} style={({ pressed }) => [styles.logout, pressed && { opacity: 0.92 }]}>
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
            <Text style={styles.footerText}>Haulsy • Demo build</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function SettingRow({
  title,
  subtitle,
  action,
  onPress,
}: {
  title: string;
  subtitle: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.settingLine, pressed && { opacity: 0.92 }]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.lineTitle}>{title}</Text>
        <Text numberOfLines={1} style={styles.lineSub}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.lineRight}>
        <Text style={styles.lineAction}>{action}</Text>
        <Ionicons name="chevron-forward" size={18} color={HAULSY.colors.icon} />
      </View>
    </Pressable>
  );
}

function QuickPill({
  icon,
  label,
  badge,
  accessibilityLabel,
  accent,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  badge?: string | null;
  accessibilityLabel?: string;
  accent?: "purple";
  onPress: () => void;
}) {
  const PURPLE = "#7C3AED";
  const iconColor = accent === "purple" ? PURPLE : HAULSY.colors.text;
  const iconWrapStyle = accent === "purple" ? styles.quickIconWrapPurple : styles.quickIconWrap;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [styles.quickPill, pressed && { opacity: 0.92 }]}
    >
      {!!badge && (
        <View style={styles.quickBadge}>
          <Text style={styles.quickBadgeText}>{badge}</Text>
        </View>
      )}
      <View style={iconWrapStyle}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.quickPillText}>{label}</Text>
    </Pressable>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ComponentProps<typeof Ionicons>["name"] }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statTop}>
        <Ionicons name={icon} size={14} color={HAULSY.colors.primary} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: HAULSY.colors.bg },
  content: { paddingHorizontal: HAULSY.spacing.md, paddingBottom: 110 },

  profileCard: { marginTop: HAULSY.spacing.sm, padding: HAULSY.spacing.md },
  profileTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarWrap: { width: 46, height: 46 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
  },
  avatarBadgeHit: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeGood: { backgroundColor: "#16A34A" },
  badgeAmber: { backgroundColor: "#F59E0B" },
  name: { color: HAULSY.colors.text, ...HAULSY.typography.h2 },
  handle: { color: HAULSY.colors.subtext, marginTop: 2, ...HAULSY.typography.caption },

  idRow: {
    marginTop: 10,
    height: 34,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  idRowLeft: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 8 },
  idRowTitle: { flex: 1, color: HAULSY.colors.text, fontSize: 12, fontWeight: "900" },
  idRowRight: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 },
  idStatusChip: { height: 22, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  idStatusChipGood: { backgroundColor: "rgba(22,101,52,0.08)", borderColor: "rgba(22,101,52,0.14)" },
  idStatusChipAmber: { backgroundColor: "rgba(245,158,11,0.16)", borderColor: "rgba(245,158,11,0.24)" },
  idStatusChipNeutral: { backgroundColor: "#fff", borderColor: HAULSY.colors.border },
  idStatusText: { fontSize: 11, fontWeight: "900" },
  idStatusTextGood: { color: "#166534" },
  idStatusTextAmber: { color: "#7C2D12" },
  idStatusTextNeutral: { color: HAULSY.colors.text },
  chevSlot: { width: 18, alignItems: "flex-end", justifyContent: "center" },

  editBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: HAULSY.colors.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editText: { color: HAULSY.colors.primary, ...HAULSY.typography.button },

  statsRow: {
    marginTop: HAULSY.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: HAULSY.colors.bg,
    borderRadius: HAULSY.radius.md,
    paddingVertical: HAULSY.spacing.sm,
  },
  divider: { width: 1, height: 28, backgroundColor: HAULSY.colors.border, opacity: 0.8 },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  statValue: { color: HAULSY.colors.text, fontWeight: "900" },
  statLabel: { color: HAULSY.colors.subtext, ...HAULSY.typography.caption },

  driverCard: { marginTop: HAULSY.spacing.sm, padding: HAULSY.spacing.md },
  driverCardHighlight: { borderColor: "rgba(37,99,255,0.25)" },
  driverHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  driverHeaderRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  collapseAffordance: { flexDirection: "row", alignItems: "center", gap: 6 },
  collapseText: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800" },
  driverLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  driverIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: HAULSY.colors.primarySoft,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  driverTitle: { color: HAULSY.colors.text, fontWeight: "900", fontSize: 15 },
  driverSub: { color: HAULSY.colors.subtext, marginTop: 2, ...HAULSY.typography.caption },
  statusPill: { height: 24, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  statusPillGood: { backgroundColor: "rgba(22,101,52,0.08)", borderColor: "rgba(22,101,52,0.16)" },
  statusPillNeutral: { backgroundColor: "rgba(17,17,17,0.04)", borderColor: HAULSY.colors.border },
  statusPillText: { fontSize: 11, fontWeight: "900" },
  statusTextGood: { color: "#166534" },
  statusTextNeutral: { color: HAULSY.colors.subtext },

  progressLabel: { marginTop: 12, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800" },
  progressTrack: { marginTop: 8, height: 6, borderRadius: 999, backgroundColor: "rgba(17,17,17,0.06)", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: HAULSY.colors.primary, borderRadius: 999 },

  driverPrimaryBtn: {
    marginTop: 12,
    height: 40,
    borderRadius: HAULSY.radius.md,
    backgroundColor: HAULSY.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  driverPrimaryText: { color: "#fff", ...HAULSY.typography.button },

  settingLine: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: HAULSY.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  lineTitle: { color: HAULSY.colors.text, fontWeight: "900" },
  lineSub: { marginTop: 4, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  lineRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  lineAction: { color: HAULSY.colors.primary, fontWeight: "900" },

  driverInfoRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  driverSummaryText: { flex: 1, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700", lineHeight: 16 },

  availabilityRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: HAULSY.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  availabilityTitle: { color: HAULSY.colors.text, fontWeight: "900" },
  availabilitySub: { marginTop: 4, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  availabilityHint: { marginTop: 4, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },

  quickActionsWrap: { marginTop: 12 },
  quickTitle: { color: HAULSY.colors.text, fontSize: 14, fontWeight: "900", marginBottom: 10 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickPill: {
    width: "48%",
    height: 46,
    borderRadius: 16,
    backgroundColor: HAULSY.colors.card,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  quickPillText: { color: HAULSY.colors.text, fontSize: 12, fontWeight: "900" },
  quickIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  quickIconWrapPurple: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(124,58,237,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  quickBadgeText: { color: "#fff", fontSize: 11, fontWeight: "900" },

  sectionTitle: {
    marginTop: HAULSY.spacing.lg,
    marginBottom: HAULSY.spacing.sm,
    color: HAULSY.colors.text,
    ...HAULSY.typography.h2,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: HAULSY.spacing.md,
    paddingVertical: HAULSY.spacing.sm,
    borderRadius: HAULSY.radius.lg,
    backgroundColor: HAULSY.colors.card,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingTitle: { color: HAULSY.colors.text, fontWeight: "900" },
  settingSub: { color: HAULSY.colors.subtext, marginTop: 2, ...HAULSY.typography.caption },

  logout: {
    height: 46,
    borderRadius: HAULSY.radius.md,
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.18)",
    backgroundColor: HAULSY.colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: { color: "#DC2626", ...HAULSY.typography.button },
  footerText: { textAlign: "center", color: "rgba(107,114,128,0.75)", marginTop: 10, fontSize: 11, fontWeight: "600" },
});

