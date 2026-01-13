import React, { useMemo, useState } from "react";
import { Platform, Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PAGE_BG = "#F6F7FB";
const CARD_BG = "#FFFFFF";
const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";
const BLUE = "#1F67FF";
const PURPLE = "#7C3AED";

function shadow() {
  if (Platform.OS === "android") return { elevation: 1 };
  return { shadowColor: "#0B1220", shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } };
}

type Mode = "seller" | "buyer";

export function HaulsyIQRulesScreen() {
  const insets = useSafeAreaInsets();
  const { threadId, role } = useLocalSearchParams<{ threadId?: string; role?: "buying" | "selling" }>();

  const mode: Mode = useMemo(() => {
    if (role === "selling") return "seller";
    if (role === "buying") return "buyer";
    return String(threadId ?? "").startsWith("m") ? "seller" : "buyer";
  }, [role, threadId]);

  const [assistantOn, setAssistantOn] = useState(true);
  const [autoReplyAvailable, setAutoReplyAvailable] = useState(true);
  const [autoAnswerCommon, setAutoAnswerCommon] = useState(true);
  const [notifyWhenSerious, setNotifyWhenSerious] = useState(true);
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);

  const [guardrail, setGuardrail] = useState(mode === "seller" ? 440 : 420);
  const label = mode === "seller" ? "Never go below" : "Never go above";

  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart] = useState("10:00 PM");
  const [quietEnd] = useState("7:00 AM");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.9 }]}>
          <Ionicons name="close" size={20} color={TEXT} />
        </Pressable>

        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={styles.titleRow}>
            <View style={styles.sparkleDot}>
              <Ionicons name="sparkles" size={14} color="#fff" />
            </View>
            <Text style={styles.title}>HaulsyIQ Rules</Text>
          </View>
          <Text style={styles.sub}>You can override anytime.</Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <RuleRow title="Assistant On" value={assistantOn} onChange={setAssistantOn} />
          <RuleRow title='Auto-reply to "Is this still available?"' value={autoReplyAvailable} onChange={setAutoReplyAvailable} />
          <RuleRow title="Auto-answer common questions from listing details" value={autoAnswerCommon} onChange={setAutoAnswerCommon} />
          <RuleRow title="Notify me when buyer is serious" value={notifyWhenSerious} onChange={setNotifyWhenSerious} />
          <RuleRow title="Auto-schedule pickup/delivery suggestions" value={autoSchedule} onChange={setAutoSchedule} />
          <RuleRow title="Require approval before sending offers" value={requireApproval} onChange={setRequireApproval} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{label}</Text>
          <Text style={styles.cardSub}>
            {mode === "seller" ? "Assistant will not accept offers below this amount." : "Assistant will not send offers above this amount."}
          </Text>

          <View style={styles.stepperRow}>
            <StepperButton icon="remove" onPress={() => setGuardrail((p) => Math.max(0, p - 10))} />
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>${guardrail.toLocaleString()}</Text>
            </View>
            <StepperButton icon="add" onPress={() => setGuardrail((p) => p + 10)} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.quietHeader}>
            <Text style={styles.cardTitle}>Quiet hours</Text>
            <Switch
              value={quietHoursEnabled}
              onValueChange={setQuietHoursEnabled}
              trackColor={{ false: "rgba(17,17,17,0.12)", true: "rgba(31,103,255,0.35)" }}
              thumbColor={quietHoursEnabled ? BLUE : "#F3F4F6"}
            />
          </View>
          <Text style={styles.cardSub}>Optional — avoid auto-actions during quiet hours.</Text>
          <View style={styles.quietRow}>
            <QuietPill label="Start" value={quietStart} />
            <QuietPill label="End" value={quietEnd} />
          </View>
          <Text style={styles.hint}>Beta: rules apply to drafts and auto-replies only.</Text>
        </View>

        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.doneBtn, pressed && { opacity: 0.92 }]}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function RuleRow({ title, value, onChange }: { title: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "rgba(17,17,17,0.12)", true: "rgba(31,103,255,0.35)" }}
        thumbColor={value ? BLUE : "#F3F4F6"}
      />
    </View>
  );
}

function StepperButton({ icon, onPress }: { icon: "add" | "remove"; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.9 }]}>
      <Ionicons name={icon} size={18} color={TEXT} />
    </Pressable>
  );
}

function QuietPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.quietPill}>
      <Text style={styles.quietLabel}>{label}</Text>
      <Text style={styles.quietValue}>{value}</Text>
      <Ionicons name="chevron-down" size={16} color={MUTED} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PAGE_BG },
  header: { paddingHorizontal: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(),
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sparkleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: PURPLE, alignItems: "center", justifyContent: "center" },
  title: { color: TEXT, fontSize: 15, fontWeight: "900" },
  sub: { marginTop: 6, color: MUTED, fontSize: 12, fontWeight: "700" },

  content: { paddingHorizontal: 16, paddingTop: 8 },
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 14,
    ...shadow(),
    marginBottom: 12,
  },
  cardTitle: { color: TEXT, fontSize: 14, fontWeight: "900" },
  cardSub: { marginTop: 6, color: MUTED, fontSize: 12, fontWeight: "600", lineHeight: 17 },

  row: { paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  rowTitle: { flex: 1, color: TEXT, fontSize: 13, fontWeight: "800", lineHeight: 18 },

  stepperRow: { marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  pricePill: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(31,103,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(31,103,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: { color: BLUE, fontSize: 15, fontWeight: "900" },

  quietHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  quietRow: { marginTop: 12, flexDirection: "row", gap: 10 },
  quietPill: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  quietLabel: { color: MUTED, fontSize: 12, fontWeight: "800" },
  quietValue: { color: TEXT, fontSize: 13, fontWeight: "900" },
  hint: { marginTop: 12, color: MUTED, fontSize: 12, fontWeight: "600", lineHeight: 16 },

  doneBtn: {
    height: 52,
    borderRadius: 18,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    ...shadow(),
  },
  doneText: { color: "#fff", fontSize: 14, fontWeight: "900" },
});

