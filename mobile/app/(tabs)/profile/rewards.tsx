import React, { useMemo } from "react";
import { FlatList, Pressable, SafeAreaView, Share, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "@/components/haulsy";

type RewardEvent = {
  id: string;
  title: string;
  amount: string; // "+$10"
  status: "Pending" | "Earned" | "Redeemed";
  when: string;
};

const REFERRAL_CODE = "HAULSY-WES-21";

const HISTORY: RewardEvent[] = [
  { id: "r1", title: "Invite friend bonus", amount: "+$10", status: "Earned", when: "Today" },
  { id: "r2", title: "First listing bonus", amount: "+$5", status: "Pending", when: "Yesterday" },
  { id: "r3", title: "Secure checkout bonus", amount: "+$8", status: "Redeemed", when: "Dec 29" },
];

export default function RewardsScreen() {
  const balance = 18;

  const howToEarn = useMemo(
    () => [
      { icon: "people-outline" as const, title: "Invite friends", sub: "You both earn credits." },
      { icon: "pricetag-outline" as const, title: "List your first item", sub: "Get a one-time bonus." },
      { icon: "bicycle-outline" as const, title: "Complete your first delivery", sub: "Earn a driver reward." },
      { icon: "lock-closed-outline" as const, title: "Use secure checkout", sub: "Rewards for escrow usage." },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.9 }]}>
          <Ionicons name="chevron-back" size={22} color={HAULSY.colors.text} />
        </Pressable>
        <Text style={styles.title}>Rewards</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={HISTORY}
        keyExtractor={(x) => x.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: HAULSY.spacing.md, paddingBottom: 110 }}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Haulsy credits</Text>
              <Text style={styles.balance}>${balance}</Text>
              <Text style={styles.sub}>Credits can be applied to delivery fees and eligible services.</Text>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>How to earn</Text>
              <View style={{ marginTop: 12, gap: 10 }}>
                {howToEarn.map((x) => (
                  <View key={x.title} style={styles.howRow}>
                    <View style={styles.howIcon}>
                      <Ionicons name={x.icon} size={18} color={HAULSY.colors.icon} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.howTitle}>{x.title}</Text>
                      <Text style={styles.howSub}>{x.sub}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Referral</Text>
              <Text style={styles.sub}>Share your code to earn rewards when friends join.</Text>
              <View style={styles.refRow}>
                <View style={styles.refPill}>
                  <Text style={styles.refText}>{REFERRAL_CODE}</Text>
                </View>
                <Pressable
                  onPress={async () => {
                    await Share.share({ message: `Use my Haulsy referral code ${REFERRAL_CODE} to earn rewards.` });
                  }}
                  style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
                >
                  <Text style={styles.primaryText}>Share</Text>
                </Pressable>
              </View>
            </Card>

            <Text style={styles.section}>History</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Card variant="surface" style={styles.historyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.historySub}>{item.when} • {item.status}</Text>
            </View>
            <Text style={styles.historyAmt}>{item.amount}</Text>
          </Card>
        )}
      />
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

  card: { padding: HAULSY.spacing.md },
  cardTitle: { color: HAULSY.colors.text, ...HAULSY.typography.h2 },
  sub: { marginTop: 6, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  balance: { marginTop: 8, color: HAULSY.colors.text, fontSize: 34, fontWeight: "900" },

  howRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  howIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  howTitle: { color: HAULSY.colors.text, fontWeight: "900" },
  howSub: { marginTop: 4, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },

  refRow: { marginTop: 12, flexDirection: "row", gap: 10, alignItems: "center" },
  refPill: {
    flex: 1,
    height: 44,
    borderRadius: HAULSY.radius.md,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: HAULSY.colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  refText: { color: HAULSY.colors.text, fontWeight: "900" },
  primaryBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: HAULSY.radius.md,
    backgroundColor: HAULSY.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", ...HAULSY.typography.button },

  section: { marginTop: 4, color: HAULSY.colors.text, ...HAULSY.typography.h2 },
  historyRow: { paddingHorizontal: HAULSY.spacing.md, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  historyTitle: { color: HAULSY.colors.text, fontWeight: "900" },
  historySub: { marginTop: 4, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  historyAmt: { color: HAULSY.colors.text, fontWeight: "900" },
});

