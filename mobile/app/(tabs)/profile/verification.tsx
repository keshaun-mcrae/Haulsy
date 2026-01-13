import React from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "@/components/haulsy";
import { setAccountTrust, useAccountTrust } from "@/src/features/profile/accountStore";

export default function VerificationStatusScreen() {
  const trust = useAccountTrust();

  const label =
    trust.idStatus === "ID_VERIFIED"
      ? "Verified"
      : trust.idStatus === "ID_PENDING" || trust.idStatus === "ID_IN_REVIEW"
        ? "Pending"
        : "Not started";

  const icon: React.ComponentProps<typeof Ionicons>["name"] =
    trust.idStatus === "ID_VERIFIED" ? "shield-checkmark" : trust.idStatus === "ID_PENDING" || trust.idStatus === "ID_IN_REVIEW" ? "time" : "shield-outline";

  const tone =
    trust.idStatus === "ID_VERIFIED" ? "good" : trust.idStatus === "ID_PENDING" || trust.idStatus === "ID_IN_REVIEW" ? "amber" : "neutral";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.9 }]}>
          <Ionicons name="chevron-back" size={22} color={HAULSY.colors.text} />
        </Pressable>
        <Text style={styles.title}>Verification status</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.dot, tone === "good" ? styles.dotGood : tone === "amber" ? styles.dotAmber : styles.dotNeutral]}>
              <Ionicons name={icon} size={18} color={tone === "good" ? "#fff" : tone === "amber" ? "#111" : HAULSY.colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>ID verification</Text>
              <Text style={styles.sub}>Status: {label}</Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              if (trust.idStatus === "ID_NOT_STARTED") {
                Alert.alert("Start verification", "MVP placeholder. Mark as pending?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Continue", onPress: () => setAccountTrust({ idStatus: "ID_PENDING" }) },
                ]);
                return;
              }
              if (trust.idStatus === "ID_PENDING" || trust.idStatus === "ID_IN_REVIEW") {
                Alert.alert("Verification", "MVP placeholder. Mark as verified?", [
                  { text: "Not yet", style: "cancel" },
                  { text: "Mark verified", onPress: () => setAccountTrust({ idStatus: "ID_VERIFIED" }) },
                ]);
                return;
              }
              Alert.alert("Verified", "Your ID is verified.");
            }}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
          >
            <Text style={styles.primaryText}>
              {trust.idStatus === "ID_NOT_STARTED" ? "Verify now" : trust.idStatus === "ID_VERIFIED" ? "View details" : "Continue"}
            </Text>
          </Pressable>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Why verify your ID?</Text>
          <Bullet icon="shield-checkmark-outline" text="Build trust with buyers and sellers." />
          <Bullet icon="lock-closed-outline" text="Unlock safer checkout and stronger account protection." />
          <Bullet icon="car-outline" text="Smoother deliveries and payouts when issues arise." />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>What happens next?</Text>
          <Step n="1" text="Upload ID" />
          <Step n="2" text="Selfie check" />
          <Step n="3" text="Review" />
          <Text style={styles.sub}>Typical time: a few minutes to a few hours (demo).</Text>
        </Card>

        <Pressable onPress={() => console.log("Need help")} style={({ pressed }) => [styles.helpRow, pressed && { opacity: 0.92 }]}>
          <View style={styles.helpIcon}>
            <Ionicons name="help-circle-outline" size={18} color={HAULSY.colors.icon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <Text style={styles.helpSub}>Go to Help & support</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={HAULSY.colors.icon} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Bullet({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>["name"]; text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletIcon}>
        <Ionicons name={icon} size={16} color={HAULSY.colors.icon} />
      </View>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepDot}>
        <Text style={styles.stepDotText}>{n}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
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
  content: { paddingHorizontal: HAULSY.spacing.md, paddingTop: 8, gap: 12 },
  card: { padding: HAULSY.spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  dot: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  dotGood: { backgroundColor: "#16A34A" },
  dotAmber: { backgroundColor: "#F59E0B" },
  dotNeutral: { backgroundColor: "rgba(17,17,17,0.06)" },
  cardTitle: { color: HAULSY.colors.text, ...HAULSY.typography.h2 },
  sub: { marginTop: 4, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  primaryBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: HAULSY.radius.md,
    backgroundColor: HAULSY.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", ...HAULSY.typography.button },

  sectionTitle: { color: HAULSY.colors.text, fontSize: 14, fontWeight: "900" },
  bulletRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  bulletIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletText: { flex: 1, color: HAULSY.colors.text, fontSize: 13, fontWeight: "700", lineHeight: 18 },

  stepRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: HAULSY.colors.primarySoft,
    borderWidth: 1,
    borderColor: "rgba(37,99,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotText: { color: HAULSY.colors.primary, fontSize: 12, fontWeight: "900" },
  stepText: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "800" },

  helpRow: {
    backgroundColor: HAULSY.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    paddingHorizontal: HAULSY.spacing.md,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  helpIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: HAULSY.colors.bg,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  helpTitle: { color: HAULSY.colors.text, fontWeight: "900" },
  helpSub: { marginTop: 4, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
});

