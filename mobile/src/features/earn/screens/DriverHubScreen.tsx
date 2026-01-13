import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HAULSY } from "@/constants/haulsyTheme";
import * as Clipboard from "expo-clipboard";

import type { EarnSegment, Gig, Mission } from "../types";
import { EARNINGS, MISSIONS, RECENT_ACTIVITY, REWARDS } from "../mockData";
import { refreshGigs, setEarnState, useEarnStore } from "../store";
import { formatMoney } from "../utils";
import { useDriverSettings } from "@/src/features/driver/settingsStore";

const SEGMENTS: EarnSegment[] = ["Overview", "Gigs", "Rewards"];

function shadow() {
  return Platform.OS === "ios" ? HAULSY.shadow.ios : HAULSY.shadow.android;
}

export function DriverHubScreen() {
  const insets = useSafeAreaInsets();
  const store = useEarnStore();
  const driver = useDriverSettings();

  const [seg, setSeg] = useState<EarnSegment>("Overview");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [compressed, setCompressed] = useState(false);
  const [tierBHeight, setTierBHeight] = useState(0);
  const [pastTierB, setPastTierB] = useState(false);
  const lastY = useRef(0);
  const gigSkeleton = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({ id: `sk-${i}`, __sk: true })), []);

  // Gigs filters (keep lightweight and fast)
  const DEFAULT_NEARBY = true;
  const DEFAULT_PAYHIGH = true;
  const DEFAULT_FIT = false;
  const DEFAULT_SIZE: "Any" | Gig["itemSize"] = "Any";
  const DEFAULT_TIME: "Any" | "≤30m" | "≤45m" = "Any";

  const [fNearby, setFNearby] = useState(DEFAULT_NEARBY);
  const [fPayHigh, setFPayHigh] = useState(DEFAULT_PAYHIGH);
  const [fFit, setFFit] = useState(false);
  const [fSize, setFSize] = useState<"Any" | Gig["itemSize"]>(DEFAULT_SIZE);
  const [fTime, setFTime] = useState<"Any" | "≤30m" | "≤45m">(DEFAULT_TIME);

  // Money state (mock)
  const weekTotal = EARNINGS.weekTotal;
  const available = EARNINGS.available;
  const pending = EARNINGS.pending;
  const deliveriesThisWeek = EARNINGS.deliveriesThisWeek;

  const payoutOk = driver.hasPayoutMethod;
  const canCashOut = payoutOk && available > 0;
  const showPayoutHero = !driver.hasPayoutMethod;

  // Mission progress
  const missions = useMemo(() => {
    // Tie mission states to driver settings (lightweight realism)
    return MISSIONS.map((m) => {
      if (m.id === "verify") return { ...m, status: driver.verified ? "Completed" : "Not started" } as Mission;
      if (m.id === "payout") return { ...m, status: driver.hasPayoutMethod ? "Completed" : "Not started" } as Mission;
      return m;
    });
  }, [driver.hasPayoutMethod, driver.verified]);

  const completedCount = missions.filter((m) => m.status === "Completed").length;
  const earningUpTo = 38;

  const availableGigs = useMemo(() => store.gigs.filter((g) => g.state === "Available"), [store.gigs]);
  const availableGigCount = availableGigs.length;
  const hasActiveDelivery = !!store.activeGigId;

  const TAB_CLEAR = 84; // keep floating UI above bottom tabs
  const cashoutBarVisible = seg === "Overview" && payoutOk && available > 0 && pastTierB;
  const bottomPad = 16 + TAB_CLEAR + insets.bottom + (cashoutBarVisible ? 54 : 0);

  useEffect(() => {
    // Prevent the cash-out bar from showing immediately when returning to Overview.
    setPastTierB(false);
  }, [seg]);

  const onScrollY = (y: number) => {
    lastY.current = y;
    if (!compressed && y > 18) setCompressed(true);
    if (compressed && y < 6) setCompressed(false);
    if (seg === "Overview" && tierBHeight > 0) {
      if (!pastTierB && y > tierBHeight + 6) setPastTierB(true);
      if (pastTierB && y < Math.max(0, tierBHeight - 24)) setPastTierB(false);
    }
  };

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: (e: any) => onScrollY(e?.nativeEvent?.contentOffset?.y ?? 0),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seg, tierBHeight, pastTierB, compressed]
  );

  const collapseT = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Stronger “big → compact” collapse: big number fades out while compact “This week $X” fades in.
  const weekScale = collapseT.interpolate({ inputRange: [0, 1], outputRange: [1, 0.92] });
  const weekTranslateY = collapseT.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const bigOpacity = collapseT.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const compactOpacity = collapseT.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const availScale = collapseT.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] });
  const segScaleY = collapseT.interpolate({ inputRange: [0, 1], outputRange: [1, 0.90] });

  const filteredGigs = useMemo(() => {
    let gigs = store.gigs.filter((g) => g.state !== "Completed");

    if (fNearby) gigs = gigs.filter((g) => g.distanceToPickupKm <= 3.5);
    if (fSize !== "Any") gigs = gigs.filter((g) => g.itemSize === fSize);
    if (fTime === "≤30m") gigs = gigs.filter((g) => g.etaMins <= 30);
    if (fTime === "≤45m") gigs = gigs.filter((g) => g.etaMins <= 45);

    if (fFit && driver.vehicleType) {
      const vt = driver.vehicleType;
      gigs = gigs.filter((g) => {
        if (g.vehicleFit === "Sedan ok") return true;
        if (g.vehicleFit === "SUV recommended") return vt === "SUV" || vt === "Truck" || vt === "Van";
        return vt === "Truck" || vt === "Van";
      });
    }

    if (fPayHigh) {
      gigs = [...gigs].sort((a, b) => b.net - a.net);
    }

    return gigs;
  }, [driver.vehicleType, fFit, fNearby, fPayHigh, fSize, fTime, store.gigs]);

  const filtersDirty =
    fNearby !== DEFAULT_NEARBY ||
    fPayHigh !== DEFAULT_PAYHIGH ||
    fFit !== DEFAULT_FIT ||
    fSize !== DEFAULT_SIZE ||
    fTime !== DEFAULT_TIME;

  const clearFilters = () => {
    setFNearby(DEFAULT_NEARBY);
    setFPayHigh(DEFAULT_PAYHIGH);
    setFFit(DEFAULT_FIT);
    setFSize(DEFAULT_SIZE);
    setFTime(DEFAULT_TIME);
  };

  // One list per segment to avoid nested scroll
  if (seg === "Gigs") {
    const showCosts = !!driver.vehicleType && !!driver.fuelEconomyLPer100Km && !!driver.gasPricePerLiter;
    const data = store.online ? (store.gigsLoading ? (gigSkeleton as any) : filteredGigs) : [];

    return (
      <SafeAreaView style={styles.safe}>
        <HeaderSticky
          seg={seg}
          onSeg={setSeg}
          weekTotal={weekTotal}
          available={available}
          insetsTop={insets.top}
          compressed={compressed}
          collapseT={collapseT}
          weekScale={weekScale}
          weekTranslateY={weekTranslateY}
          availScale={availScale}
          segScaleY={segScaleY}
        />

        <Animated.FlatList
          data={data as any[]}
          keyExtractor={(x: any) => x.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: HAULSY.spacing.md, paddingBottom: bottomPad }}
          ListHeaderComponent={
            <View style={styles.gigsStickyWrap}>
              <GoOnlineBar
                online={store.online}
                loading={store.gigsLoading}
                onToggle={(v) => setEarnState({ online: v })}
                onRefresh={() => refreshGigs()}
              />
              <GigFiltersBar
                nearby={fNearby}
                onNearby={() => setFNearby((v) => !v)}
                payHigh={fPayHigh}
                onPay={() => setFPayHigh((v) => !v)}
                fit={fFit}
                onFit={() => setFFit((v) => !v)}
                size={fSize}
                onSize={() =>
                  setFSize((s) =>
                    s === "Any" ? "Small" : s === "Small" ? "Medium" : s === "Medium" ? "Large" : "Any"
                  )
                }
                time={fTime}
                onTime={() => setFTime((t) => (t === "Any" ? "≤30m" : t === "≤30m" ? "≤45m" : "Any"))}
                showClear={filtersDirty}
                onClear={clearFilters}
              />
            </View>
          }
          stickyHeaderIndices={[0]}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }: any) =>
            item?.__sk ? (
              <GigSkeletonCard />
            ) : (
              <GigCard
                gig={item as Gig}
                driverHasCosts={showCosts}
                onPress={() => router.push({ pathname: "/(tabs)/earn/gig/[gigId]", params: { gigId: item.id } } as any)}
              />
            )
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            store.online ? (
              <EmptyCard
                icon="flash-outline"
                title="No gigs right now"
                body="Stay online and we’ll show nearby gigs as they appear."
                cta="Refresh"
                onPress={() => refreshGigs()}
              />
            ) : (
              <EmptyCard
                icon="radio-outline"
                title="You’re offline"
                body="Go online to see gigs near you."
                cta="Go online"
                onPress={() => setEarnState({ online: true })}
              />
            )
          }
        />
      </SafeAreaView>
    );
  }

  if (seg === "Rewards") {
    return (
      <SafeAreaView style={styles.safe}>
        <HeaderSticky
          seg={seg}
          onSeg={setSeg}
          weekTotal={weekTotal}
          available={available}
          insetsTop={insets.top}
          compressed={compressed}
          collapseT={collapseT}
          weekScale={weekScale}
          weekTranslateY={weekTranslateY}
          availScale={availScale}
          segScaleY={segScaleY}
        />

        <Animated.FlatList
          data={[1]}
          keyExtractor={(x) => String(x)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: HAULSY.spacing.md, paddingBottom: bottomPad }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={() => (
            <View style={{ gap: 12 }}>
              <Card>
                <Text style={styles.cardTitle}>Referral</Text>
                <Text style={styles.sub}>Invite a friend — you both get $10</Text>
                <View style={styles.codeRow}>
                  <Pressable
                    onPress={async () => {
                      await Clipboard.setStringAsync(REWARDS.referralCode);
                      Alert.alert("Copied", "Referral code copied.");
                    }}
                    style={({ pressed }) => [styles.codePill, pressed && styles.codePillPressed]}
                  >
                    <Text style={styles.codeText}>{REWARDS.referralCode}</Text>
                  </Pressable>
                  <Pressable
                    onPress={async () => {
                      await Clipboard.setStringAsync(REWARDS.referralCode);
                      Alert.alert("Copied", "Referral code copied.");
                    }}
                    hitSlop={10}
                    style={({ pressed }) => [styles.iconAction, pressed && { opacity: 0.92 }]}
                  >
                    <Ionicons name="copy-outline" size={18} color={HAULSY.colors.text} />
                  </Pressable>
                  <Pressable
                    onPress={async () => {
                      await Share.share({
                        message: `Use my Haulsy referral code ${REWARDS.referralCode} — we both get $10.`,
                      });
                    }}
                    hitSlop={10}
                    style={({ pressed }) => [styles.iconAction, pressed && { opacity: 0.92 }]}
                  >
                    <Ionicons name="share-outline" size={18} color={HAULSY.colors.text} />
                  </Pressable>
                </View>
                <Pressable
                  onPress={async () => {
                    await Share.share({
                      message: `Use my Haulsy referral code ${REWARDS.referralCode} — we both get $10.`,
                    });
                  }}
                  style={({ pressed }) => [styles.primaryBtn, { marginTop: 12 }, pressed && { opacity: 0.92 }]}
                >
                  <Text style={styles.primaryBtnText}>Invite</Text>
                </Pressable>
                <Text style={styles.sub2}>{REWARDS.invited} invited • {REWARDS.completed} completed</Text>
              </Card>

              <Card>
                <Text style={styles.cardTitle}>Bonuses</Text>
                <Text style={styles.sub}>{REWARDS.streakTitle}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round(REWARDS.streakProgress * 100)}%` }]} />
                </View>
                <Text style={styles.sub2}>{Math.round(REWARDS.streakProgress * 3)}/3 completed</Text>
              </Card>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  // Overview
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderSticky
        seg={seg}
        onSeg={setSeg}
        weekTotal={weekTotal}
        available={available}
        insetsTop={insets.top}
        compressed={compressed}
        collapseT={collapseT}
        weekScale={weekScale}
        weekTranslateY={weekTranslateY}
        availScale={availScale}
        segScaleY={segScaleY}
      />

      <Animated.FlatList
        data={[1]}
        keyExtractor={(x) => String(x)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: HAULSY.spacing.md, paddingBottom: bottomPad }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <TierBOverview
            available={available}
            pending={pending}
            deliveriesThisWeek={deliveriesThisWeek}
            nextPayout={EARNINGS.nextPayout}
            payoutOk={payoutOk}
            onHeight={(h) => setTierBHeight(h)}
          />
        }
        renderItem={() => (
          <View style={{ gap: 12 }}>
            {showPayoutHero && (
              <>
                <HeroCard
                  title="Add payout method to cash out instantly"
                  cta="Add payout method"
                  onPress={() => router.push({ pathname: "/(tabs)/profile", params: { focus: "payout" } } as any)}
                />
                <Pressable
                  onPress={() => setSeg("Gigs")}
                  hitSlop={10}
                  style={({ pressed }) => [styles.altLinkRow, pressed && { opacity: 0.92 }]}
                >
                  <Text style={styles.altLinkText}>Or earn now</Text>
                  <Text style={styles.altLinkChevron}>→</Text>
                  <Text style={styles.altLinkText}>View gigs</Text>
                </Pressable>
              </>
            )}

            {!showPayoutHero && (
              <EarnNowCard
                online={store.online}
                hasActiveDelivery={hasActiveDelivery}
                gigsNearby={availableGigCount}
                onGoOnline={() => setEarnState({ online: true })}
                onViewGigs={() => setSeg("Gigs")}
                onOpenDelivery={() =>
                  store.activeGigId
                    ? router.push({ pathname: "/(tabs)/earn/gig/[gigId]", params: { gigId: store.activeGigId } } as any)
                    : Alert.alert("Active delivery", "Coming soon.")
                }
                onRefresh={() => refreshGigs()}
              />
            )}

            <Card>
              <View style={styles.missionsHeader}>
                <Text style={styles.cardTitle}>Missions</Text>
                <Text style={styles.sub2}>{completedCount}/4 completed • Earn up to ${earningUpTo}</Text>
              </View>
              <View style={styles.missionGrid}>
                {missions.map((m) => (
                  <MissionCard
                    key={m.id}
                    mission={m}
                    onPress={() => {
                      if (m.status === "Completed") return;
                      if (m.onTap === "verify") router.push({ pathname: "/(tabs)/profile", params: { focus: "verify" } } as any);
                      if (m.onTap === "payout") router.push({ pathname: "/(tabs)/profile", params: { focus: "payout" } } as any);
                      if (m.onTap === "gigs") setSeg("Gigs");
                      if (m.onTap === "rewards") setSeg("Rewards");
                    }}
                  />
                ))}
              </View>
            </Card>

            <Card>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Recent activity</Text>
                <Pressable onPress={() => router.push("/(tabs)/earn/history")} hitSlop={10}>
                  <Text style={styles.link}>View all</Text>
                </Pressable>
              </View>
              <View style={{ marginTop: 10, gap: 10 }}>
                {RECENT_ACTIVITY.slice(0, 5).map((a) => (
                  <View key={a.id} style={styles.activityRow}>
                    <Text style={styles.activityText}>{a.text}</Text>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.activityAmt}>{a.amountLabel}</Text>
                      <Text style={styles.sub2}>{a.when}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}
      />

      {cashoutBarVisible && (
        <View style={[styles.cashoutBar, { bottom: TAB_CLEAR + Math.max(insets.bottom, 0) }]}>
          <Text style={styles.cashoutLeft}>Available {formatMoney(available)}</Text>
          <Pressable
            disabled={!canCashOut}
            onPress={() => console.log("Cash out")}
            style={({ pressed }) => [
              styles.cashoutBtnCompact,
              !canCashOut && { opacity: 0.5 },
              pressed && canCashOut && { opacity: 0.92 },
            ]}
          >
            <Text style={styles.cashoutBtnText}>Cash out</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function HeaderSticky({
  seg,
  onSeg,
  weekTotal,
  available,
  insetsTop,
  compressed,
  collapseT,
  weekScale,
  weekTranslateY,
  availScale,
  segScaleY,
}: {
  seg: EarnSegment;
  onSeg: (s: EarnSegment) => void;
  weekTotal: number;
  available: number;
  insetsTop: number;
  compressed: boolean;
  collapseT: Animated.AnimatedInterpolation<number>;
  weekScale: Animated.AnimatedInterpolation<number>;
  weekTranslateY: Animated.AnimatedInterpolation<number>;
  availScale: Animated.AnimatedInterpolation<number>;
  segScaleY: Animated.AnimatedInterpolation<number>;
}) {
  const bigOpacity = collapseT.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const compactOpacity = collapseT.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={[styles.headerWrap, { paddingTop: Math.max(insetsTop, 10) }]}>
      <Animated.View style={[styles.tierA, { transform: [{ translateY: collapseT.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) }] }]}>
        <Text style={styles.hTitle}>Earn</Text>
        <View style={styles.moneyRow}>
          <View style={styles.weekWrap}>
            <Animated.Text
              style={[
                styles.weekValue,
                { opacity: bigOpacity, transform: [{ translateY: weekTranslateY }, { scale: weekScale }] },
              ]}
            >
              {formatMoney(weekTotal)}
            </Animated.Text>
            <Animated.Text style={[styles.weekCompact, { opacity: compactOpacity }]}>
              This week {formatMoney(weekTotal)}
            </Animated.Text>
          </View>
          <Animated.View style={[styles.availPill, { transform: [{ scale: availScale }] }]}>
            <Text style={styles.availPillText}>Available {formatMoney(available)}</Text>
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.segmentBar, { transform: [{ scaleY: segScaleY }] }]}>
        {SEGMENTS.map((s) => {
          const active = seg === s;
          return (
            <Pressable key={s} onPress={() => onSeg(s)} style={({ pressed }) => [styles.segBtn, active && styles.segBtnActive, pressed && { opacity: 0.92 }]}>
              <Text style={[styles.segText, active ? styles.segTextActive : styles.segTextInactive]}>{s}</Text>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

function EarnNowCard({
  online,
  hasActiveDelivery,
  gigsNearby,
  onGoOnline,
  onViewGigs,
  onOpenDelivery,
  onRefresh,
}: {
  online: boolean;
  hasActiveDelivery: boolean;
  gigsNearby: number;
  onGoOnline: () => void;
  onViewGigs: () => void;
  onOpenDelivery: () => void;
  onRefresh: () => void;
}) {
  let title = "Earn now";
  let body = "Check nearby gigs and accept what fits your schedule.";
  let cta = "View gigs";
  let icon: React.ComponentProps<typeof Ionicons>["name"] = "flash-outline";
  let onPress = onViewGigs;

  if (!online) {
    body = "You’re offline — go online to see gigs nearby.";
    cta = "Go online";
    icon = "radio-outline";
    onPress = onGoOnline;
  } else if (hasActiveDelivery) {
    body = "Active delivery in progress.";
    cta = "Open delivery";
    icon = "navigate-outline";
    onPress = onOpenDelivery;
  } else if (gigsNearby > 0) {
    body = `${gigsNearby} gig${gigsNearby === 1 ? "" : "s"} nearby.`;
    cta = "View gigs";
    icon = "cube-outline";
    onPress = onViewGigs;
  } else {
    body = "No gigs right now—stay online or expand filters.";
    cta = "Refresh";
    icon = "refresh-outline";
    onPress = onRefresh;
  }

  return (
    <View style={[styles.earnNowCard, shadow()]}>
      <View style={styles.earnNowLeft}>
        <View style={styles.earnNowIcon}>
          <Ionicons name={icon} size={18} color={HAULSY.colors.primary} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.earnNowTitle}>{title}</Text>
          <Text style={styles.earnNowBody} numberOfLines={2}>
            {body}
          </Text>
        </View>
      </View>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.earnNowBtn, pressed && { opacity: 0.92 }]}>
        <Text style={styles.earnNowBtnText}>{cta}</Text>
      </Pressable>
    </View>
  );
}

function TierBOverview({
  available,
  pending,
  deliveriesThisWeek,
  nextPayout,
  payoutOk,
  onHeight,
}: {
  available: number;
  pending: number;
  deliveriesThisWeek: number;
  nextPayout: string;
  payoutOk: boolean;
  onHeight: (h: number) => void;
}) {
  return (
    <View
      style={{ marginTop: 12, marginBottom: 12 }}
      onLayout={(e) => onHeight(Math.round(e.nativeEvent.layout.height))}
    >
      <Card>
        <View style={styles.breakRow}>
          <BreakItem label="Available" value={formatMoney(available)} />
          <BreakItem label="Pending" value={formatMoney(pending)} />
          <BreakItem label="Deliveries" value={`${deliveriesThisWeek}`} />
        </View>
        <Text style={styles.sub2}>Next payout: {nextPayout}</Text>

        <View style={styles.breakFootRow}>
          {!payoutOk ? (
            <View style={styles.breakHintRow}>
              <Ionicons name="card-outline" size={16} color={HAULSY.colors.icon} />
              <Text style={styles.breakHint}>Payout method not set</Text>
              <Pressable onPress={() => router.push({ pathname: "/(tabs)/profile", params: { focus: "payout" } } as any)} hitSlop={10}>
                <Text style={styles.link}>Add</Text>
              </Pressable>
            </View>
          ) : available <= 0 ? (
            <Text style={styles.breakHint}>No funds available yet</Text>
          ) : (
            <Text style={styles.breakHint}>Cash out available</Text>
          )}

          <Pressable onPress={() => router.push("/(tabs)/earn/history")} hitSlop={10}>
            <Text style={styles.link}>View history</Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
}

function BreakItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.breakLabel}>{label}</Text>
      <Text style={styles.breakValue}>{value}</Text>
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={[styles.card, shadow()]}>
      {children}
    </View>
  );
}

function HeroCard({ title, cta, onPress }: { title: string; cta: string; onPress: () => void }) {
  return (
    <View style={[styles.hero, shadow()]}>
      <Text style={styles.heroTitle}>{title}</Text>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.heroBtn, pressed && { opacity: 0.92 }]}>
        <Text style={styles.heroBtnText}>{cta}</Text>
        <Ionicons name="chevron-forward" size={16} color="#fff" />
      </Pressable>
    </View>
  );
}

function MissionCard({ mission, onPress }: { mission: Mission; onPress: () => void }) {
  const done = mission.status === "Completed";
  return (
    <Pressable disabled={done} onPress={onPress} style={({ pressed }) => [styles.missionCard, done && { opacity: 0.75 }, pressed && !done && { opacity: 0.94 }]}>
      <View style={styles.missionTop}>
        <View style={styles.missionIcon}>
          <Ionicons name={mission.icon as any} size={18} color={HAULSY.colors.primary} />
        </View>
        <View style={styles.rewardPill}>
          <Text style={styles.rewardText}>{mission.rewardLabel}</Text>
        </View>
      </View>
      <Text style={styles.missionTitle}>{mission.title}</Text>
      <Text style={styles.missionStatus}>{done ? "Completed ✅" : mission.status}</Text>
    </Pressable>
  );
}

function GoOnlineBar({
  online,
  loading,
  onToggle,
  onRefresh,
}: {
  online: boolean;
  loading: boolean;
  onToggle: (v: boolean) => void;
  onRefresh: () => void;
}) {
  return (
    <View style={[styles.onlineBarSlim, shadow()]}>
      <View style={styles.onlineLeft}>
        <View style={[styles.statusDot, online ? styles.statusDotOn : styles.statusDotOff]} />
        <Text style={styles.onlineTitleSlim}>{online ? "Online" : "Offline"}</Text>
        <Text style={styles.onlineNote}>Shows gigs near you</Text>
      </View>

      <View style={styles.onlineRight}>
        <Switch
          value={online}
          onValueChange={onToggle}
          trackColor={{ false: "rgba(17,17,17,0.12)", true: "rgba(37,99,255,0.18)" }}
          thumbColor={online ? HAULSY.colors.primary : "#F3F4F6"}
        />
        <Pressable onPress={onRefresh} hitSlop={10} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.92 }]}>
          <Ionicons name="refresh-outline" size={18} color={HAULSY.colors.icon} />
        </Pressable>
      </View>
    </View>
  );
}

function GigFiltersBar({
  nearby,
  onNearby,
  payHigh,
  onPay,
  fit,
  onFit,
  size,
  onSize,
  time,
  onTime,
  showClear,
  onClear,
}: {
  nearby: boolean;
  onNearby: () => void;
  payHigh: boolean;
  onPay: () => void;
  fit: boolean;
  onFit: () => void;
  size: "Any" | Gig["itemSize"];
  onSize: () => void;
  time: "Any" | "≤30m" | "≤45m";
  onTime: () => void;
  showClear: boolean;
  onClear: () => void;
}) {
  return (
    <View style={styles.filtersRow}>
      <Chip label="Nearby" active={nearby} onPress={onNearby} />
      <Chip label="Pay high→low" active={payHigh} onPress={onPay} />
      <Chip label="Vehicle fit" active={fit} onPress={onFit} />
      <Chip label={`Size: ${size}`} active={size !== "Any"} onPress={onSize} />
      <Chip label={`Time: ${time}`} active={time !== "Any"} onPress={onTime} />
      {showClear && (
        <Pressable onPress={onClear} hitSlop={10} style={({ pressed }) => [styles.clearWrap, pressed && { opacity: 0.92 }]}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.92 }]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function GigCard({ gig, driverHasCosts, onPress }: { gig: Gig; driverHasCosts: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.gigCard, pressed && { opacity: 0.94 }]}>
      <View style={styles.gigTop}>
        <Text style={styles.net}>Net {formatMoney(driverHasCosts ? gig.net : gig.payout)}</Text>
        <Text style={styles.sub2}>
          {driverHasCosts ? `Pays ${formatMoney(gig.payout)} • Est. gas ${formatMoney(gig.estGas)}` : "Set vehicle to see gas estimate"}
        </Text>
      </View>
      <View style={styles.gigMetaRow}>
        <MetaItem icon="location-outline" text={`${gig.distanceToPickupKm.toFixed(1)} km to pickup`} />
        <MetaItem icon="map-outline" text={`Total ${gig.routeDistanceKm.toFixed(1)} km`} />
        <MetaItem icon="time-outline" text={`~${gig.etaMins} min`} />
      </View>
      <Text style={styles.gigRoute}>{gig.routeLabel}</Text>
      <View style={styles.badgeRow}>
        <Pill text={gig.itemSize} />
        <Pill text={gig.vehicleFit} />
        {gig.twoPersonLift && <Pill text="2-person lift" tone="warn" />}
      </View>
    </Pressable>
  );
}

function MetaItem({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
}) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={13} color={HAULSY.colors.icon} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

function GigSkeletonCard() {
  return (
    <View style={styles.gigCard}>
      <View style={[styles.skLine, { width: "48%" }]} />
      <View style={[styles.skLine, { width: "74%", marginTop: 8 }]} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
        <View style={[styles.skLine, { width: "34%" }]} />
        <View style={[styles.skLine, { width: "28%" }]} />
      </View>
      <View style={[styles.skLine, { width: "88%", marginTop: 12 }]} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <View style={styles.skPill} />
        <View style={styles.skPill} />
        <View style={styles.skPill} />
      </View>
    </View>
  );
}

function Pill({ text, tone }: { text: string; tone?: "warn" }) {
  return (
    <View style={[styles.pill, tone === "warn" && styles.pillWarn]}>
      {tone === "warn" && <Ionicons name="alert-circle-outline" size={14} color="#9A3412" />}
      <Text style={[styles.pillText, tone === "warn" && styles.pillTextWarn]}>{text}</Text>
    </View>
  );
}

function EmptyCard({ icon, title, body, cta, onPress }: { icon: any; title: string; body: string; cta: string; onPress: () => void }) {
  return (
    <View style={[styles.empty, shadow()]}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={22} color={HAULSY.colors.icon} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.sub2}>{body}</Text>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryBtn, { marginTop: 12 }, pressed && { opacity: 0.92 }]}>
        <Text style={styles.primaryBtnText}>{cta}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: HAULSY.colors.bg },

  headerWrap: { paddingHorizontal: HAULSY.spacing.md, paddingBottom: HAULSY.spacing.sm, backgroundColor: HAULSY.colors.bg },
  tierA: { paddingTop: 6 },
  hTitle: { color: HAULSY.colors.text, fontSize: 18, fontWeight: "900" },
  moneyRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  weekValue: { color: HAULSY.colors.text, fontSize: 32, fontWeight: "900" },
  availPill: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: HAULSY.radius.pill,
    backgroundColor: "rgba(37,99,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(37,99,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  availPillText: { color: HAULSY.colors.primary, fontSize: 11, fontWeight: "900" },
  weekWrap: { flex: 1, minWidth: 0 },
  weekCompact: { color: HAULSY.colors.text, fontSize: 14, fontWeight: "900" },

  segmentBar: {
    marginTop: 10,
    padding: 3,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    flexDirection: "row",
    gap: 6,
  },
  segBtn: { flex: 1, height: 34, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  segBtnActive: { backgroundColor: HAULSY.colors.card, borderWidth: 1, borderColor: HAULSY.colors.border, ...shadow() },
  segText: { fontSize: 12, fontWeight: "900" },
  segTextActive: { color: HAULSY.colors.text },
  segTextInactive: { color: HAULSY.colors.subtext },

  breakRow: { flexDirection: "row", gap: 10 },
  breakLabel: { color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  breakValue: { color: HAULSY.colors.text, fontWeight: "900", marginTop: 4 },
  sub: { color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  sub2: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },
  helper: { marginTop: 8, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },
  breakFootRow: { marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  breakHintRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 },
  breakHint: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },

  btnRow: { marginTop: 12, flexDirection: "row", gap: 10 },
  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: HAULSY.radius.md,
    backgroundColor: HAULSY.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", ...HAULSY.typography.button },
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
  secondaryBtnText: { color: HAULSY.colors.text, ...HAULSY.typography.button },

  card: {
    backgroundColor: HAULSY.colors.card,
    borderRadius: HAULSY.radius.lg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    padding: HAULSY.spacing.md,
  },
  cardTitle: { color: HAULSY.colors.text, ...HAULSY.typography.h2 },
  link: { color: HAULSY.colors.primary, fontSize: 12, fontWeight: "900" },
  rowBetween: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  altLinkRow: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  altLinkText: { color: HAULSY.colors.primary, fontSize: 12, fontWeight: "900" },
  altLinkChevron: { color: HAULSY.colors.primary, fontSize: 12, fontWeight: "900" },

  hero: {
    backgroundColor: HAULSY.colors.primary,
    borderRadius: 16,
    padding: 18,
  },
  heroTitle: { color: "#fff", fontSize: 16, fontWeight: "900", lineHeight: 22 },
  heroBtn: {
    marginTop: 12,
    height: 42,
    borderRadius: HAULSY.radius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  heroBtnText: { color: "#fff", fontSize: 13, fontWeight: "900" },

  missionsHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  missionGrid: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 12 },
  missionCard: {
    width: "48%",
    borderRadius: HAULSY.radius.lg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: HAULSY.colors.bg,
    padding: 12,
  },
  missionTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  missionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: HAULSY.colors.card,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardPill: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: HAULSY.radius.pill,
    backgroundColor: HAULSY.colors.primarySoft,
    borderWidth: 1,
    borderColor: "rgba(37,99,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardText: { color: HAULSY.colors.primary, fontSize: 11, fontWeight: "900" },
  missionTitle: { marginTop: 10, color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },
  missionStatus: { marginTop: 6, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },

  activityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  activityText: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "800" },
  activityAmt: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },

  cashoutBar: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: HAULSY.spacing.md,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderTopWidth: 1,
    borderTopColor: HAULSY.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    ...(Platform.OS === "ios" ? HAULSY.shadow.ios : { elevation: 10 }),
  },
  cashoutLeft: { color: HAULSY.colors.text, fontWeight: "900" },
  cashoutBtnCompact: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: HAULSY.radius.md,
    backgroundColor: HAULSY.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cashoutBtnText: { color: "#fff", fontWeight: "900" },

  gigsStickyWrap: { paddingTop: 10, paddingBottom: 10, backgroundColor: HAULSY.colors.bg },
  onlineBarSlim: {
    backgroundColor: HAULSY.colors.card,
    borderRadius: HAULSY.radius.lg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  onlineLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 },
  onlineRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  onlineTitleSlim: { color: HAULSY.colors.text, fontWeight: "900", fontSize: 13 },
  onlineNote: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusDotOn: { backgroundColor: "rgba(37,99,255,0.62)" },
  statusDotOff: { backgroundColor: "rgba(17,17,17,0.18)" },

  filtersRow: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  chip: {
    height: 26,
    paddingHorizontal: 9,
    borderRadius: HAULSY.radius.pill,
    backgroundColor: HAULSY.colors.card,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: "rgba(37,99,255,0.06)", borderColor: "rgba(37,99,255,0.14)" },
  chipText: { color: HAULSY.colors.text, fontSize: 10, fontWeight: "900" },
  chipTextActive: { color: HAULSY.colors.primary },
  clearWrap: { height: 26, justifyContent: "center", paddingHorizontal: 4 },
  clearText: { color: HAULSY.colors.primary, fontSize: 12, fontWeight: "900" },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  gigCard: {
    backgroundColor: HAULSY.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    padding: HAULSY.spacing.md,
    ...(Platform.OS === "ios" ? HAULSY.shadow.ios : HAULSY.shadow.android),
  },
  skLine: { height: 12, borderRadius: 8, backgroundColor: "rgba(17,17,17,0.08)" },
  skPill: { width: 72, height: 24, borderRadius: 999, backgroundColor: "rgba(17,17,17,0.06)" },
  gigTop: { gap: 4 },
  net: { color: HAULSY.colors.text, fontSize: 18, fontWeight: "900" },
  gigMetaRow: { marginTop: 8, flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: HAULSY.colors.subtext, fontSize: 11, fontWeight: "700" },
  gigRoute: { marginTop: 10, color: HAULSY.colors.text, fontSize: 13, fontWeight: "700", opacity: 0.86 },
  badgeRow: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: HAULSY.radius.pill,
    backgroundColor: "rgba(17,17,17,0.04)",
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  pillText: { color: HAULSY.colors.text, fontSize: 11, fontWeight: "900" },
  pillWarn: { backgroundColor: "rgba(255,149,0,0.14)", borderColor: "rgba(255,149,0,0.32)" },
  pillTextWarn: { color: "#9A3412" },

  earnNowCard: {
    backgroundColor: HAULSY.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  earnNowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  earnNowIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: HAULSY.colors.primarySoft,
    borderWidth: 1,
    borderColor: "rgba(37,99,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  earnNowTitle: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },
  earnNowBody: { marginTop: 2, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700", lineHeight: 16 },
  earnNowBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: HAULSY.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  earnNowBtnText: { color: "#fff", fontSize: 12, fontWeight: "900" },

  iconAction: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    marginTop: 16,
    backgroundColor: HAULSY.colors.card,
    borderRadius: HAULSY.radius.lg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    padding: HAULSY.spacing.lg,
    alignItems: "center",
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(17,17,17,0.04)",
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { marginTop: 12, color: HAULSY.colors.text, fontWeight: "900" },

  codeRow: { marginTop: 12, flexDirection: "row", gap: 10, alignItems: "center" },
  codePill: {
    flex: 1,
    height: 44,
    borderRadius: HAULSY.radius.md,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: HAULSY.colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  codePillPressed: { opacity: 0.92, backgroundColor: "rgba(17,17,17,0.04)" },
  codeText: { color: HAULSY.colors.text, fontWeight: "900" },
  progressTrack: { marginTop: 12, height: 10, borderRadius: 999, backgroundColor: "rgba(17,17,17,0.06)", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: HAULSY.colors.primary, borderRadius: 999 },
});

