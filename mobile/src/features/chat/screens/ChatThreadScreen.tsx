import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ListingContextCard } from "../components/ListingContextCard";
import { HaulsyIQStrip } from "../components/HaulsyIQStrip";
import { HaulsyIQSheet } from "../components/HaulsyIQSheet";
import { DEFAULT_HIQ, getMessages, getThread } from "../mockData";
import type { HaulsyIQState, Message } from "../types";

const PAGE_BG = "#F6F7FB";
const CARD_BG = "#FFFFFF";
const TEXT = "#0B1220";
const MUTED = "#6B7280";
const BORDER = "#E7EAF0";
const BLUE = "#1F67FF";

function shadow(level: "cta") {
  if (Platform.OS === "android") return { elevation: 8 };
  return { shadowColor: "#0B1220", shadowOpacity: 0.10, shadowRadius: 18, shadowOffset: { width: 0, height: 12 } };
}

export function ChatThreadScreen() {
  const insets = useSafeAreaInsets();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();

  const thread = useMemo(() => getThread(String(threadId)), [threadId]);
  const messages = useMemo(() => getMessages(String(threadId)), [threadId]);

  const [hiq, setHiq] = useState<HaulsyIQState>(() => {
    // per-thread default
    return {
      ...DEFAULT_HIQ,
      guardrailValue: thread?.role === "selling" ? 440 : 420,
      lastAction: thread?.actionReason === "approval" ? "Waiting for your approval" : DEFAULT_HIQ.lastAction,
    };
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [composerText, setComposerText] = useState("");

  const listRef = useRef<FlatList<Message>>(null);

  if (!thread) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={{ padding: 16 }}>
          <Text style={{ color: TEXT, fontSize: 16, fontWeight: "900" }}>Chat not found</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 10 }}>
            <Text style={{ color: BLUE, fontWeight: "900" }}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const assistantActive = hiq.assistantOn && !hiq.pausedForChat;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.hIcon, pressed && { opacity: 0.9 }]}>
            <Ionicons name="chevron-back" size={22} color={TEXT} />
          </Pressable>

          <View style={styles.hCenter}>
            <Text numberOfLines={1} style={styles.hTitle}>
              {thread.name}
            </Text>
            <Text numberOfLines={1} style={styles.hSub}>
              {thread.listingTitle}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable onPress={() => console.log("Info")} hitSlop={10} style={({ pressed }) => [styles.hIcon, pressed && { opacity: 0.9 }]}>
              <Ionicons name="information-circle-outline" size={20} color={TEXT} />
            </Pressable>
            <Pressable onPress={() => console.log("Menu")} hitSlop={10} style={({ pressed }) => [styles.hIcon, pressed && { opacity: 0.9 }]}>
              <Ionicons name="ellipsis-horizontal" size={20} color={TEXT} />
            </Pressable>
          </View>
        </View>

        {/* Listing context (pinned under header) */}
        <ListingContextCard thread={thread} />

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={[...messages].reverse()}
          inverted
          keyExtractor={(m) => m.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 9 }} />}
          renderItem={({ item }) => {
            const out = item.direction === "out";
            return (
              <View style={[styles.msgRow, out ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
                <View style={[styles.bubble, out ? styles.bubbleOut : styles.bubbleIn]}>
                  <Text style={[styles.bubbleText, out ? styles.bubbleTextOut : styles.bubbleTextIn]}>{item.text}</Text>
                  <Text style={[styles.timeSmall, out ? styles.timeSmallOut : styles.timeSmallIn]}>{item.timeLabel}</Text>
                </View>
              </View>
            );
          }}
        />

        {/* HaulsyIQ strip (collapsed) */}
        <HaulsyIQStrip
          state={hiq}
          onPress={() => setSheetOpen(true)}
        />

        {/* Micro banner when user takes over */}
        {hiq.pausedForChat && composerText.trim().length > 0 && (
          <View style={styles.handoffBanner}>
            <Text style={styles.handoffText}>You’re replying — assistant paused for this chat</Text>
          </View>
        )}

        {/* Composer */}
        <View style={[styles.composer, { paddingBottom: insets.bottom + 10 }]}>
          <Pressable onPress={() => console.log("Attach")} hitSlop={10} style={({ pressed }) => [styles.attachBtn, pressed && { opacity: 0.9 }]}>
            <Ionicons name="add" size={20} color={TEXT} />
          </Pressable>

          <View style={styles.inputWrap}>
            <TextInput
              value={composerText}
              onChangeText={(t) => {
                setComposerText(t);
                if (assistantActive && t.trim().length > 0) {
                  setHiq((s) => ({ ...s, assistantOn: false, pausedForChat: true, lastAction: "Paused for this chat" }));
                }
              }}
              placeholder="Message…"
              placeholderTextColor={MUTED}
              style={styles.input}
              multiline
            />
          </View>

          <Pressable
            onPress={() => console.log("Send", composerText)}
            hitSlop={10}
            style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.92 }]}
          >
            <Ionicons name="paper-plane" size={18} color="#fff" />
          </Pressable>
        </View>

        {/* HaulsyIQ modal sheet (does not affect list scroll when closed) */}
        <HaulsyIQSheet
          visible={sheetOpen}
          role={thread.role}
          state={hiq}
          onClose={() => setSheetOpen(false)}
          onChange={(next) => setHiq((s) => ({ ...s, ...next }))}
          onOpenRules={() => {
            setSheetOpen(false);
            router.push({ pathname: "/(tabs)/chat/rules", params: { threadId: thread.id, role: thread.role } } as any);
          }}
          onReviewDrafts={() => setHiq((s) => ({ ...s, lastAction: "Waiting for your approval" }))}
          onPause={() => setHiq((s) => ({ ...s, assistantOn: false, pausedForChat: true, lastAction: "Paused for this chat" }))}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PAGE_BG },
  header: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: PAGE_BG,
  },
  hIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  hCenter: { flex: 1, paddingHorizontal: 8, minWidth: 0 },
  hTitle: { color: TEXT, fontSize: 15, fontWeight: "900" },
  hSub: { marginTop: 4, color: MUTED, fontSize: 12, fontWeight: "700" },

  msgRow: { flexDirection: "row" },
  bubble: { maxWidth: "80%", paddingHorizontal: 11, paddingVertical: 9, borderRadius: 18, borderWidth: 1 },
  bubbleIn: { backgroundColor: "#F3F4F6", borderColor: "rgba(231,234,240,0.9)" },
  bubbleOut: { backgroundColor: BLUE, borderColor: "rgba(31,103,255,0.35)" },
  bubbleText: { fontSize: 14, fontWeight: "600", lineHeight: 19 },
  bubbleTextIn: { color: TEXT },
  bubbleTextOut: { color: "#fff" },
  timeSmall: { marginTop: 5, fontSize: 11, fontWeight: "700" },
  timeSmallIn: { color: MUTED },
  timeSmallOut: { color: "rgba(255,255,255,0.86)" },

  handoffBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(31,103,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(31,103,255,0.18)",
  },
  handoffText: { color: BLUE, fontSize: 12, fontWeight: "800" },

  composer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    ...shadow("cta"),
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { color: TEXT, fontSize: 14, fontWeight: "600", minHeight: 20, maxHeight: 110 },
  sendBtn: { width: 42, height: 42, borderRadius: 16, backgroundColor: BLUE, alignItems: "center", justifyContent: "center" },
});

