import React from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { HaulsyIQState, Role } from "../types";

const CARD_BG = "#FFFFFF";
const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";
const BLUE = "#1F67FF";
const PURPLE = "#7C3AED";

function shadow() {
  if (Platform.OS === "android") return { elevation: 12 };
  return { shadowColor: "#0B1220", shadowOpacity: 0.12, shadowRadius: 22, shadowOffset: { width: 0, height: 14 } };
}

export function HaulsyIQSheet({
  visible,
  role,
  state,
  onClose,
  onChange,
  onOpenRules,
  onReviewDrafts,
  onPause,
}: {
  visible: boolean;
  role: Role;
  state: HaulsyIQState;
  onClose: () => void;
  onChange: (next: Partial<HaulsyIQState>) => void;
  onOpenRules: () => void;
  onReviewDrafts: () => void;
  onPause: () => void;
}) {
  const active = state.assistantOn && !state.pausedForChat;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <View style={styles.header}>
          <View style={styles.hLeft}>
            <View style={styles.sparkle}>
              <Ionicons name="sparkles" size={14} color="#fff" />
            </View>
            <Text style={styles.title}>HaulsyIQ</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={10} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.9 }]}>
            <Ionicons name="close" size={18} color={TEXT} />
          </Pressable>
        </View>

        <Text style={styles.copy}>
          Auto-replies and negotiates within your rules.
        </Text>

        <ScrollView
          style={{ maxHeight: 320 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <ToggleRow title="Assistant On" value={active} onChange={(v) => onChange({ assistantOn: v, pausedForChat: false })} />
            <ToggleRow
              title='Reply to "Is this still available?"'
              value={state.autoReplyAvailable}
              onChange={(v) => onChange({ autoReplyAvailable: v })}
            />
            <ToggleRow
              title="Notify me when buyer is serious"
              value={state.notifyWhenSerious}
              onChange={(v) => onChange({ notifyWhenSerious: v })}
            />
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onOpenRules} style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}>
              <Text style={styles.primaryText}>Rules</Text>
            </Pressable>
            <Pressable onPress={onReviewDrafts} style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.92 }]}>
              <Text style={styles.pillText}>Review drafts</Text>
            </Pressable>
            <Pressable onPress={onPause} style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.92 }]}>
              <Text style={styles.pillText}>Pause</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Switch to manual?",
                  "HaulsyIQ will stop auto-replies for this chat.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Switch",
                      style: "destructive",
                      onPress: () => onPause(),
                    },
                  ]
                );
              }}
              style={({ pressed }) => [styles.pillBtn, pressed && { opacity: 0.92 }]}
            >
              <Text style={styles.pillText}>Switch to manual</Text>
            </Pressable>

            <Text style={styles.hint}>
              Offer guardrails ({role === "selling" ? "Never go below" : "Never go above"}) and approvals live in Rules.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function ToggleRow({ title, value, onChange }: { title: string; value: boolean; onChange: (v: boolean) => void }) {
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

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(11,18,32,0.30)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    ...shadow(),
  },
  grabber: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(17,17,17,0.16)",
    marginBottom: 10,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  hLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sparkle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: TEXT, fontSize: 14, fontWeight: "900" },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { marginTop: 10, color: MUTED, fontSize: 12, fontWeight: "600", lineHeight: 17 },
  card: {
    marginTop: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "rgba(231,234,240,0.9)",
    borderRadius: 18,
    padding: 12,
  },
  row: { paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  rowTitle: { flex: 1, color: TEXT, fontSize: 12, fontWeight: "800", lineHeight: 16 },

  actions: { marginTop: 12, gap: 10 },
  primaryBtn: {
    height: 44,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", fontSize: 13, fontWeight: "900" },
  pillBtn: {
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(31,103,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(31,103,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { color: BLUE, fontSize: 12, fontWeight: "900" },
  hint: { marginTop: 6, color: MUTED, fontSize: 11, fontWeight: "600", lineHeight: 15 },
});

