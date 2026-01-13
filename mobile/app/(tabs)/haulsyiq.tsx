import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "@/components/haulsy";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDriverSettings } from "@/src/features/driver/settingsStore";
import { useAccountTrust } from "@/src/features/profile/accountStore";

const PURPLE = HAULSY.colors.accent; // HaulsyIQ accent

type WorkflowKey = "list" | "scan" | "price" | "safety" | "negotiate" | "delivery" | "verify";

type WorkflowTile = {
  key: WorkflowKey;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

const WORKFLOWS: WorkflowTile[] = [
  { key: "list", title: "List an item", subtitle: "Scan or manual", icon: "pricetag-outline" },
  { key: "price", title: "Price check", subtitle: "Range + strategy", icon: "trending-up-outline" },
  { key: "safety", title: "Safety check", subtitle: "Scam signals", icon: "shield-outline" },
  { key: "negotiate", title: "Negotiate", subtitle: "Draft replies", icon: "chatbubble-ellipses-outline" },
  { key: "delivery", title: "Delivery helper", subtitle: "ETA + handoff", icon: "car-outline" },
  { key: "verify", title: "Verify user", subtitle: "Trust status", icon: "person-circle-outline" },
];

type MyAiCard = {
  id: string;
  title: string;
  subtitle: string;
  key: WorkflowKey;
  prompt: string;
};

const MY_AI: MyAiCard[] = [
  { id: "m1", title: "Continue chat", subtitle: "Last HaulsyIQ thread", key: "negotiate", prompt: "Continue my last negotiation draft." },
  { id: "m2", title: "Draft listing", subtitle: "Sofa • photos ready", key: "list", prompt: "Draft a listing for a modern grey sectional sofa." },
  { id: "m3", title: "Active negotiation", subtitle: "Counter at $1700", key: "negotiate", prompt: "Write a polite counteroffer at $1700." },
  { id: "m4", title: "Open delivery", subtitle: "Quote + route", key: "delivery", prompt: "Estimate delivery cost and ETA for this listing." },
];

type InsightCard = {
  id: string;
  insight: string;
  why: string;
  action: { label: string; mode: WorkflowKey };
  tag: "Pricing" | "Safety" | "Selling";
};

const INSIGHTS: InsightCard[] = [
  {
    id: "i1",
    tag: "Pricing",
    insight: "Try listing 8–12% above your floor price.",
    why: "Gives room to negotiate while staying in the common buyer search band.",
    action: { label: "Apply", mode: "price" },
  },
  {
    id: "i2",
    tag: "Safety",
    insight: "Avoid off‑platform payments and rushed meetups.",
    why: "Scammers often push urgency and move to external apps.",
    action: { label: "Run", mode: "safety" },
  },
  {
    id: "i3",
    tag: "Selling",
    insight: "Add 3 photos + pickup window to sell faster.",
    why: "Clear photos and availability reduce back‑and‑forth and drop‑offs.",
    action: { label: "Improve", mode: "list" },
  },
];

export default function HaulsyIQScreen() {
  const insets = useSafeAreaInsets();
  const driver = useDriverSettings();
  const trust = useAccountTrust();

  const [prompt, setPrompt] = useState("");
  const [intent, setIntent] = useState<"ask" | "price" | "list" | "negotiate">("ask");
  const [attached, setAttached] = useState<{ photos: boolean; listing: boolean; chat: boolean; location: boolean }>({
    photos: false,
    listing: false,
    chat: false,
    location: false,
  });

  const [workspace, setWorkspace] = useState<WorkflowKey | null>(null);
  const [scanStep, setScanStep] = useState<1 | 2 | 3>(1);
  const [scanAnalyzing, setScanAnalyzing] = useState(false);
  const [scanTab, setScanTab] = useState<"Listing" | "Pricing" | "Safety">("Listing");
  const [aggressive, setAggressive] = useState<"Fast sale" | "Balanced" | "Max profit">("Balanced");

  const tabBarHeight = 74 + Math.max(insets.bottom, 10);
  const collapsedPeek = 64; // 56–72px per spec

  const onOpenWorkspace = (k: WorkflowKey, seededPrompt?: string) => {
    if (seededPrompt) setPrompt(seededPrompt);
    setWorkspace(k);
    if (k === "scan") {
      setScanStep(1);
      setScanTab("Listing");
      setScanAnalyzing(false);
    }
  };

  const intentConfig = useMemo(() => {
    if (intent === "price") return { icon: "trending-up-outline" as const, label: "Price check", placeholder: "Price check for…" };
    if (intent === "list") return { icon: "pricetag-outline" as const, label: "Listing", placeholder: "Write a listing for…" };
    if (intent === "negotiate") return { icon: "chatbubble-ellipses-outline" as const, label: "Negotiate", placeholder: "Negotiate for…" };
    return { icon: "sparkles-outline" as const, label: "Ask", placeholder: "Ask HaulsyIQ…" };
  }, [intent]);

  const exampleChips = useMemo(() => {
    // Lightly adapt examples based on attached context (mock).
    if (attached.chat) return ["Draft reply", "Counteroffer", "Set rules"];
    if (attached.photos) return ["What is this item?", "Price it", "Write title"];
    if (attached.listing) return ["Improve listing", "Price check", "Safety scan"];
    return ["Price check", "Listing", "Negotiate"];
  }, [attached.chat, attached.listing, attached.photos]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {/* Title row */}
        <View style={[styles.topTitleRow, { paddingTop: Math.max(insets.top, 10) }]}>
          <View style={styles.sparkDot}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>HaulsyIQ</Text>
            <Text style={styles.topSub}>AI Command Center</Text>
          </View>
        </View>

        {/* Universal Command Bar (always visible) */}
        <View style={styles.commandBarWrap}>
          <View style={styles.commandRow}>
            <View style={styles.commandInputWrap}>
              <Ionicons name={intentConfig.icon} size={18} color={PURPLE} />
              <TextInput
                value={prompt}
                onChangeText={setPrompt}
                placeholder={intentConfig.placeholder}
                placeholderTextColor={HAULSY.colors.subtext}
                style={styles.commandInput}
                multiline
              />
            </View>

            <Pressable onPress={() => console.log("Generate")} style={({ pressed }) => [styles.generateBtn, pressed && { opacity: 0.92 }]}>
              <Text style={styles.generateText}>Generate</Text>
            </Pressable>
          </View>

          <View style={styles.commandExamples}>
            <Text style={styles.exLabel}>Try:</Text>
            <Pressable
              onPress={() => {
                setIntent("price");
                setPrompt("Price check for ");
              }}
              style={({ pressed }) => [styles.exChip, pressed && { opacity: 0.92 }]}
            >
              <Text style={styles.exText}>Price check</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIntent("list");
                setPrompt("Write a listing for ");
              }}
              style={({ pressed }) => [styles.exChip, pressed && { opacity: 0.92 }]}
            >
              <Text style={styles.exText}>Listing</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIntent("negotiate");
                setPrompt("Negotiate for ");
              }}
              style={({ pressed }) => [styles.exChip, pressed && { opacity: 0.92 }]}
            >
              <Text style={styles.exText}>Negotiate</Text>
            </Pressable>
          </View>

          <View style={styles.attachRow}>
            <Text style={styles.attachLabel}>Attach context</Text>
            <AttachPill
              label="Photos"
              icon="image-outline"
              active={attached.photos}
              onPress={() => setAttached((s) => ({ ...s, photos: !s.photos }))}
            />
            <AttachPill
              label="Listing"
              icon="pricetag-outline"
              active={attached.listing}
              onPress={() => setAttached((s) => ({ ...s, listing: !s.listing }))}
            />
            <AttachPill
              label="Chat"
              icon="chatbubble-ellipses-outline"
              active={attached.chat}
              onPress={() => setAttached((s) => ({ ...s, chat: !s.chat }))}
            />
            <AttachPill
              label="Location"
              icon="location-outline"
              active={attached.location}
              onPress={() => setAttached((s) => ({ ...s, location: !s.location }))}
            />
          </View>

          <View style={styles.commandActions}>
            <Pressable onPress={() => console.log("Voice")} style={({ pressed }) => [styles.cmdIconBtn, pressed && { opacity: 0.92 }]}>
              <Ionicons name="mic-outline" size={18} color={HAULSY.colors.text} />
            </Pressable>
            <Pressable onPress={() => console.log("Templates")} style={({ pressed }) => [styles.cmdIconBtn, pressed && { opacity: 0.92 }]}>
              <Ionicons name="grid-outline" size={18} color={HAULSY.colors.text} />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable onPress={() => onOpenWorkspace("scan")} style={({ pressed }) => [styles.scanBtn, pressed && { opacity: 0.92 }]}>
              <Ionicons name="sparkles" size={16} color="#fff" />
              <Text style={styles.scanText}>Scan</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: HAULSY.spacing.md,
            paddingBottom: tabBarHeight + 24 + (workspace ? collapsedPeek : 0),
          }}
        >
          {/* AI Workflows */}
          <Text style={styles.sectionTitle}>AI Workflows</Text>
          <View style={styles.workflowGrid}>
            {WORKFLOWS.map((w) => (
              <Pressable
                key={w.key}
                onPress={() => onOpenWorkspace(w.key)}
                style={({ pressed }) => [styles.workflowTile, pressed && { opacity: 0.94 }]}
              >
                <View style={[styles.workflowIcon, w.key === "verify" && { backgroundColor: "rgba(124,58,237,0.10)", borderColor: "rgba(124,58,237,0.18)" }]}>
                  <Ionicons name={w.icon} size={18} color={w.key === "verify" ? PURPLE : HAULSY.colors.text} />
                </View>
                <Text style={styles.workflowTitle}>{w.title}</Text>
                <Text style={styles.workflowSub}>{w.subtitle}</Text>
              </Pressable>
            ))}
          </View>

          {/* My AI */}
          <Text style={styles.sectionTitle}>My AI</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }} style={{ marginHorizontal: -HAULSY.spacing.md }}>
            <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: HAULSY.spacing.md }}>
              {MY_AI.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => onOpenWorkspace(c.key, c.prompt)}
                  style={({ pressed }) => [styles.myCard, pressed && { opacity: 0.94 }]}
                >
                  <Text style={styles.myTitle}>{c.title}</Text>
                  <Text style={styles.mySub}>{c.subtitle}</Text>
                  <Text numberOfLines={2} style={styles.myPrompt}>{c.prompt}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* AI Insights carousel */}
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }} style={{ marginHorizontal: -HAULSY.spacing.md }}>
            <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: HAULSY.spacing.md }}>
              {INSIGHTS.map((i) => (
                <View key={i.id} style={styles.insightCard}>
                  <View style={styles.insightTop}>
                    <View style={styles.insightTag}>
                      <Text style={styles.insightTagText}>{i.tag}</Text>
                    </View>
                    <Pressable onPress={() => console.log("Why", i.id)} hitSlop={10}>
                      <Text style={styles.why}>Why?</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.insightLine} numberOfLines={2}>{i.insight}</Text>
                  <Pressable onPress={() => onOpenWorkspace(i.action.mode)} style={({ pressed }) => [styles.insightBtn, pressed && { opacity: 0.92 }]}>
                    <Text style={styles.insightBtnText}>{i.action.label}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={{ height: 8 }} />
        </ScrollView>

        {!!workspace && (
          <WorkspaceSheet
            bottomOffset={tabBarHeight}
            title={`Workspace: ${workspaceTitle(workspace)}`}
            onClose={() => setWorkspace(null)}
            collapsedPeek={collapsedPeek}
            attached={attached}
          >
            {workspace === "scan" ? (
              <ScanWorkspace
                step={scanStep}
                analyzing={scanAnalyzing}
                tab={scanTab}
                setTab={setScanTab}
                aggressive={aggressive}
                setAggressive={setAggressive}
                onTakePhoto={() => console.log("Take photo")}
                onUpload={() => console.log("Upload")}
                onTryDemo={() => {
                  setScanAnalyzing(true);
                  setTimeout(() => {
                    setScanAnalyzing(false);
                    setScanStep(2);
                  }, 1200);
                }}
                onCreateDraft={() => {
                  console.log("Create listing draft");
                  setScanStep(3);
                }}
                onSendSellerHq={() => console.log("Send to Seller HQ")}
                onChip={(text) => setPrompt(text)}
              />
            ) : (
              <GenericWorkspace
                mode={workspace}
                driverFuel={driver.fuelEconomyLPer100Km}
                driverGas={driver.gasPricePerLiter}
                idStatus={trust.idStatus}
                onFillPrompt={(t) => setPrompt(t)}
              />
            )}
          </WorkspaceSheet>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function workspaceTitle(k: WorkflowKey | null) {
  if (!k) return "";
  if (k === "list") return "Listing draft";
  if (k === "scan") return "Smart Scan";
  if (k === "price") return "Price check";
  if (k === "safety") return "Safety check";
  if (k === "negotiate") return "Negotiation";
  if (k === "delivery") return "Delivery helper";
  return "Verify user";
}

function Segmented({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (v: string) => void;
  items: string[];
}) {
  return (
    <View style={segStyles.wrap}>
      {items.map((it) => {
        const active = it === value;
        return (
          <Pressable key={it} onPress={() => onChange(it)} style={({ pressed }) => [segStyles.btn, active && segStyles.btnOn, pressed && { opacity: 0.92 }]}>
            <Text style={[segStyles.text, active ? segStyles.textOn : segStyles.textOff]}>{it}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const segStyles = StyleSheet.create({
  wrap: {
    padding: 3,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    flexDirection: "row",
    gap: 6,
  },
  btn: { flex: 1, height: 34, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  btnOn: { backgroundColor: "#fff", borderWidth: 1, borderColor: HAULSY.colors.border },
  text: { fontSize: 12, fontWeight: "900" },
  textOn: { color: HAULSY.colors.text },
  textOff: { color: HAULSY.colors.subtext },
});

function ScanWorkspace({
  step,
  analyzing,
  tab,
  setTab,
  aggressive,
  setAggressive,
  onTakePhoto,
  onUpload,
  onTryDemo,
  onCreateDraft,
  onSendSellerHq,
  onChip,
}: {
  step: 1 | 2 | 3;
  analyzing: boolean;
  tab: "Listing" | "Pricing" | "Safety";
  setTab: (t: "Listing" | "Pricing" | "Safety") => void;
  aggressive: "Fast sale" | "Balanced" | "Max profit";
  setAggressive: (v: "Fast sale" | "Balanced" | "Max profit") => void;
  onTakePhoto: () => void;
  onUpload: () => void;
  onTryDemo: () => void;
  onCreateDraft: () => void;
  onSendSellerHq: () => void;
  onChip: (text: string) => void;
}) {
  if (step === 1) {
    return (
      <View style={{ gap: 12 }}>
        <Text style={styles.stepMini}>Step 1 of 3</Text>
        <Text style={styles.sheetTitle}>Scan an item</Text>
        <Text style={styles.sheetSub}>Take a photo or upload one to generate a listing draft and checks.</Text>
        <YoullGet />
        <View style={styles.sheetBtnRow}>
          <SheetBtn icon="camera-outline" label="Take photo" onPress={onTakePhoto} />
          <SheetBtn icon="image-outline" label="Upload" onPress={onUpload} />
          <SheetBtn icon="sparkles" label="Try demo" primary onPress={onTryDemo} />
        </View>
        {analyzing && <ScanSkeleton />}
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={{ gap: 12 }}>
        <Text style={styles.stepMini}>Step 3 of 3</Text>
        <Text style={styles.sheetTitle}>Draft ready</Text>
        <Text style={styles.sheetSub}>Your listing draft and checks are ready to review.</Text>
        <View style={styles.sheetCtas}>
          <Pressable onPress={onCreateDraft} style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.92 }]}>
            <Text style={styles.primaryCtaText}>Open draft</Text>
          </Pressable>
          <Pressable onPress={onSendSellerHq} style={({ pressed }) => [styles.secondaryCta, pressed && { opacity: 0.92 }]}>
            <Text style={styles.secondaryCtaText}>Send to Seller HQ</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.stepMini}>Step 2 of 3</Text>
      <View style={styles.stepRow}>
        <View style={styles.stepDot}>
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
        <Text style={styles.stepText}>Results ready</Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Detected</Text>
        <Text style={styles.resultBig}>Modern grey sectional sofa</Text>
        <Text style={styles.resultMeta}>Condition: Good • Category: Furniture • Tags: Sectional, Grey</Text>
      </View>

      <Segmented value={tab} onChange={(v) => setTab(v as any)} items={["Listing", "Pricing", "Safety"]} />

      {tab === "Listing" && (
        <View style={styles.sheetBlock}>
          <Text style={styles.blockTitle}>Listing</Text>
          <Text style={styles.blockSub}>Suggested title + description draft ready.</Text>
          <View style={styles.actionChips}>
            <ActionChip label="Make it sell faster" onPress={() => onChip("Make this sell faster: sectional sofa")} />
            <ActionChip label="Add delivery estimate" onPress={() => onChip("Add a delivery estimate for this sectional sofa")} />
          </View>
        </View>
      )}

      {tab === "Pricing" && (
        <View style={styles.sheetBlock}>
          <Text style={styles.blockTitle}>Pricing</Text>
          <Text style={styles.blockSub}>Range: $380–$520 • Suggested list: $469 • Floor: $410</Text>
          <Text style={[styles.blockTitle, { marginTop: 10 }]}>Aggressiveness</Text>
          <View style={styles.pillRow}>
            {(["Fast sale", "Balanced", "Max profit"] as const).map((x) => (
              <Pressable key={x} onPress={() => setAggressive(x)} style={({ pressed }) => [styles.pill, aggressive === x && styles.pillOn, pressed && { opacity: 0.92 }]}>
                <Text style={[styles.pillText, aggressive === x && styles.pillTextOn]}>{x}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {tab === "Safety" && (
        <View style={styles.sheetBlock}>
          <Text style={styles.blockTitle}>Safety</Text>
          <Text style={styles.blockSub}>No strong scam signals detected. Keep payment in‑app and confirm meetup details.</Text>
          <View style={styles.actionChips}>
            <ActionChip label="Check scam signals" onPress={() => onChip("Safety check this deal: sectional sofa")} />
            <ActionChip label="Write negotiation replies" onPress={() => onChip("Write negotiation replies for this listing")} />
          </View>
        </View>
      )}

      <View style={styles.sheetCtas}>
        <Pressable
          onPress={() => {
            onCreateDraft();
            // move to step 3 for a v1 completion state
          }}
          style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.92 }]}
        >
          <Text style={styles.primaryCtaText}>Create listing draft</Text>
        </Pressable>
        <Pressable onPress={onSendSellerHq} style={({ pressed }) => [styles.secondaryCta, pressed && { opacity: 0.92 }]}>
          <Text style={styles.secondaryCtaText}>Send to Seller HQ</Text>
        </Pressable>
      </View>
    </View>
  );
}

function YoullGet() {
  return (
    <View style={styles.youGetRow}>
      <Text style={styles.youGetLabel}>You’ll get</Text>
      <View style={styles.youGetItems}>
        <YouGetPill icon="text-outline" label="Title" />
        <YouGetPill icon="cash-outline" label="Price" />
        <YouGetPill icon="document-text-outline" label="Description" />
        <YouGetPill icon="shield-outline" label="Safety" />
      </View>
    </View>
  );
}

function YouGetPill({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.youGetPill}>
      <Ionicons name={icon} size={14} color={HAULSY.colors.icon} />
      <Text style={styles.youGetText}>{label}</Text>
    </View>
  );
}

function ScanSkeleton() {
  return (
    <View style={styles.skelCard}>
      <View style={[styles.skelLine, { width: "62%" }]} />
      <View style={[styles.skelLine, { width: "84%", marginTop: 10 }]} />
      <View style={[styles.skelLine, { width: "70%", marginTop: 10 }]} />
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <View style={styles.skelPill} />
        <View style={styles.skelPill} />
        <View style={styles.skelPill} />
      </View>
      <View style={[styles.skelLine, { width: "92%", marginTop: 14, height: 44, borderRadius: 12 }]} />
    </View>
  );
}

function SheetBtn({ icon, label, onPress, primary }: { icon: any; label: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.sheetBtn, primary && styles.sheetBtnPrimary, pressed && { opacity: 0.92 }]}>
      <Ionicons name={icon} size={18} color={primary ? "#fff" : HAULSY.colors.text} />
      <Text style={[styles.sheetBtnText, primary && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

function ActionChip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.actionChip, pressed && { opacity: 0.92 }]}>
      <Text style={styles.actionChipText}>{label}</Text>
    </Pressable>
  );
}

function AttachPill({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.attachPill, active && styles.attachPillOn, pressed && { opacity: 0.92 }]}
    >
      <Ionicons name={icon} size={14} color={active ? PURPLE : HAULSY.colors.icon} />
      <Text style={[styles.attachText, active && styles.attachTextOn]}>{label}</Text>
    </Pressable>
  );
}

function GenericWorkspace({
  mode,
  driverFuel,
  driverGas,
  idStatus,
  onFillPrompt,
}: {
  mode: WorkflowKey | null;
  driverFuel: number | null;
  driverGas: number | null;
  idStatus: string;
  onFillPrompt: (t: string) => void;
}) {
  if (!mode) return null;
  if (mode === "delivery") {
    const canEstimate = !!driverFuel && !!driverGas;
    const distanceKm = 18.2;
    const liters = canEstimate ? distanceKm * (driverFuel! / 100) : null;
    const gasCost = liters != null ? liters * driverGas! : null;
    return (
      <View style={{ gap: 12 }}>
        <Text style={styles.sheetTitle}>Delivery helper</Text>
        <Text style={styles.sheetSub}>Route, ETA, and handoff steps for delivery-first experiences.</Text>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Estimate</Text>
          <Text style={styles.resultBig}>~45–75 min ETA</Text>
          <Text style={styles.resultMeta}>
            Route distance: {distanceKm.toFixed(1)} km • {canEstimate ? `Est. gas ${gasCost!.toFixed(2)}` : "Set vehicle to estimate gas"}
          </Text>
        </View>
        <View style={styles.actionChips}>
          <ActionChip label="Add handoff steps" onPress={() => onFillPrompt("Add handoff steps for this delivery")} />
          <ActionChip label="Quote message to buyer" onPress={() => onFillPrompt("Write a delivery quote message")} />
        </View>
      </View>
    );
  }

  if (mode === "verify") {
    return (
      <View style={{ gap: 12 }}>
        <Text style={styles.sheetTitle}>Verify user</Text>
        <Text style={styles.sheetSub}>Trust signals: ID first, then phone/email.</Text>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Current trust</Text>
          <Text style={styles.resultBig}>{idStatus.replace("ID_", "").replace("_", " ")}</Text>
          <Text style={styles.resultMeta}>Tip: Verified ID reduces risk and improves outcomes.</Text>
        </View>
        <Pressable onPress={() => onFillPrompt("Explain why verifying ID matters")} style={({ pressed }) => [styles.secondaryCta, pressed && { opacity: 0.92 }]}>
          <Text style={styles.secondaryCtaText}>Ask why</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.sheetTitle}>{workspaceTitle(mode)}</Text>
      <Text style={styles.sheetSub}>This workspace will run an AI task with context from your command bar.</Text>
      <View style={styles.skelCard}>
        <View style={[styles.skelLine, { width: "66%" }]} />
        <View style={[styles.skelLine, { width: "90%", marginTop: 10 }]} />
        <View style={[styles.skelLine, { width: "78%", marginTop: 10 }]} />
      </View>
      <Pressable onPress={() => onFillPrompt(`Run ${workspaceTitle(mode)} for: `)} style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.92 }]}>
        <Text style={styles.primaryCtaText}>Start</Text>
      </Pressable>
    </View>
  );
}

type SheetSnap = "collapsed" | "mid" | "expanded";

function WorkspaceSheet({
  title,
  onClose,
  bottomOffset,
  collapsedPeek,
  attached,
  children,
}: {
  title: string;
  onClose: () => void;
  bottomOffset: number;
  collapsedPeek: number;
  attached: { photos: boolean; listing: boolean; chat: boolean; location: boolean };
  children: React.ReactNode;
}) {
  const { height } = Dimensions.get("window");
  const sheetH = Math.max(1, height - bottomOffset);
  const collapsedH = collapsedPeek;
  const midH = Math.round(sheetH * 0.55);
  const expandedH = Math.round(sheetH * 0.90);

  const yCollapsed = sheetH - collapsedH;
  const yMid = sheetH - midH;
  const yExpanded = sheetH - expandedH;

  const translateY = useRef(new Animated.Value(yCollapsed)).current;
  const currentY = useRef(yCollapsed);
  const [snap, setSnap] = useState<SheetSnap>("collapsed");
  const lastNonCollapsed = useRef<SheetSnap>("mid");

  useEffect(() => {
    const id = translateY.addListener(({ value }) => {
      currentY.current = value;
    });
    return () => translateY.removeListener(id);
  }, [translateY]);

  useEffect(() => {
    // Mount behavior: start at collapsed then snap to mid for real work.
    setSnap("mid");
    lastNonCollapsed.current = "mid";
    Animated.spring(translateY, { toValue: yMid, useNativeDriver: true, bounciness: 0 }).start();
  }, [translateY, yMid]);

  const snapTo = (next: SheetSnap) => {
    setSnap(next);
    const target = next === "expanded" ? yExpanded : next === "mid" ? yMid : yCollapsed;
    if (next !== "collapsed") lastNonCollapsed.current = next;
    Animated.spring(translateY, { toValue: target, useNativeDriver: true, bounciness: 0 }).start();
  };

  const dragStartY = useRef(yCollapsed);
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        dragStartY.current = currentY.current;
      },
      onPanResponderMove: (_, g) => {
        const next = clamp(yExpanded, yCollapsed, dragStartY.current + g.dy);
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const v = g.vy;
        const endY = currentY.current;

        // Strong snapping: always snap to one of 3 points.
        if (v > 0.7) return snapTo("collapsed");
        if (v < -0.7) return snapTo("expanded");

        const nearest = [
          { s: "collapsed" as const, d: Math.abs(endY - yCollapsed) },
          { s: "mid" as const, d: Math.abs(endY - yMid) },
          { s: "expanded" as const, d: Math.abs(endY - yExpanded) },
        ].sort((a, b) => a.d - b.d)[0].s;
        snapTo(nearest);
      },
    })
  ).current;

  // Collapsed should not block the tab bar: sheet sits above bottomOffset.
  const showBackdrop = snap !== "collapsed";

  return (
    <>
      {showBackdrop && (
        <Pressable onPress={() => snapTo("collapsed")} style={styles.backdrop} />
      )}

      <Animated.View style={[styles.sheet, { height: sheetH, bottom: bottomOffset, transform: [{ translateY }] }]}>
        <View {...pan.panHandlers} style={[styles.sheetHandleArea, snap === "collapsed" && styles.sheetHandleAreaCollapsed]}>
          <View style={styles.handle} />

          {snap === "collapsed" ? (
            <View style={styles.collapsedBarRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={styles.sheetHeaderTitle}>{title}</Text>
                <View style={styles.ctxRow}>
                  {attached.photos && <CtxChip label="Photos" />}
                  {attached.listing && <CtxChip label="Listing" />}
                  {attached.chat && <CtxChip label="Chat" />}
                  {attached.location && <CtxChip label="Location" />}
                </View>
              </View>
              <View style={styles.collapsedRight}>
                <Pressable onPress={() => snapTo(lastNonCollapsed.current)} style={({ pressed }) => [styles.openPill, pressed && { opacity: 0.92 }]}>
                  <Text style={styles.openPillText}>Open</Text>
                </Pressable>
                <Pressable onPress={onClose} hitSlop={10} style={({ pressed }) => [styles.closeIconBtn, pressed && { opacity: 0.92 }]}>
                  <Ionicons name="close" size={18} color={HAULSY.colors.text} />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.sheetHeaderRow}>
              <Text numberOfLines={1} style={styles.sheetHeaderTitle}>{title}</Text>
              <Pressable
                onPress={() => {
                  if (snap === "expanded") return snapTo("mid");
                  return snapTo("collapsed");
                }}
                hitSlop={10}
                style={({ pressed }) => [pressed && { opacity: 0.92 }]}
              >
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={snap !== "collapsed"}
          contentContainerStyle={styles.sheetContent}
        >
          {snap === "collapsed" ? null : children}
        </ScrollView>
      </Animated.View>
    </>
  );
}

function clamp(min: number, max: number, v: number) {
  return Math.max(min, Math.min(max, v));
}

function CtxChip({ label }: { label: string }) {
  return (
    <View style={styles.ctxChip}>
      <Text style={styles.ctxChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: HAULSY.colors.bg },

  topTitleRow: { paddingHorizontal: HAULSY.spacing.md, paddingBottom: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  sparkDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: PURPLE, alignItems: "center", justifyContent: "center" },
  topTitle: { color: HAULSY.colors.text, fontSize: 16, fontWeight: "900" },
  topSub: { marginTop: 2, color: HAULSY.colors.subtext, ...HAULSY.typography.caption },

  commandBarWrap: { paddingHorizontal: HAULSY.spacing.md, paddingBottom: 12 },
  commandRow: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  commandInputWrap: {
    flex: 1,
    minHeight: 44,
    maxHeight: 90,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  commandInput: { flex: 1, color: HAULSY.colors.text, fontSize: 14, fontWeight: "700", paddingVertical: 0 },
  generateBtn: { height: 44, paddingHorizontal: 14, borderRadius: 16, backgroundColor: PURPLE, alignItems: "center", justifyContent: "center" },
  generateText: { color: "#fff", fontSize: 12, fontWeight: "900" },

  commandExamples: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  exLabel: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800" },
  exChip: { height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "rgba(124,58,237,0.08)", borderWidth: 1, borderColor: "rgba(124,58,237,0.14)", alignItems: "center", justifyContent: "center" },
  exText: { color: PURPLE, fontSize: 11, fontWeight: "900" },

  commandActions: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  cmdIconBtn: { width: 36, height: 36, borderRadius: 14, backgroundColor: HAULSY.colors.card, borderWidth: 1, borderColor: HAULSY.colors.border, alignItems: "center", justifyContent: "center" },
  scanBtn: { height: 36, paddingHorizontal: 12, borderRadius: 14, backgroundColor: PURPLE, flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" },
  scanText: { color: "#fff", fontSize: 12, fontWeight: "900" },

  sectionTitle: { marginTop: 14, marginBottom: 10, color: HAULSY.colors.text, ...HAULSY.typography.h2 },

  workflowGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  workflowTile: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    borderRadius: 16,
    padding: 12,
  },
  workflowIcon: { width: 32, height: 32, borderRadius: 12, backgroundColor: HAULSY.colors.bg, borderWidth: 1, borderColor: HAULSY.colors.border, alignItems: "center", justifyContent: "center" },
  workflowTitle: { marginTop: 10, color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },
  workflowSub: { marginTop: 4, color: HAULSY.colors.subtext, fontSize: 11, fontWeight: "700", lineHeight: 14 },

  myCard: {
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: "#fff",
    padding: 12,
  },
  myTitle: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },
  mySub: { marginTop: 4, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700" },
  myPrompt: { marginTop: 10, color: HAULSY.colors.text, fontSize: 12, fontWeight: "700", lineHeight: 16, opacity: 0.85 },

  insightCard: {
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    backgroundColor: "#fff",
    padding: 12,
  },
  insightTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  insightTag: { height: 22, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "rgba(124,58,237,0.08)", borderWidth: 1, borderColor: "rgba(124,58,237,0.14)", alignItems: "center", justifyContent: "center" },
  insightTagText: { color: PURPLE, fontSize: 11, fontWeight: "900" },
  why: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800" },
  insightLine: { marginTop: 10, color: HAULSY.colors.text, fontSize: 13, fontWeight: "800", lineHeight: 18 },
  insightBtn: { marginTop: 12, height: 36, borderRadius: 14, backgroundColor: "rgba(124,58,237,0.10)", borderWidth: 1, borderColor: "rgba(124,58,237,0.18)", alignItems: "center", justifyContent: "center" },
  insightBtnText: { color: PURPLE, fontSize: 12, fontWeight: "900" },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.10)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    overflow: "hidden",
  },
  sheetHandleArea: { paddingTop: 8, paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: HAULSY.colors.border, backgroundColor: "#fff" },
  sheetHandleAreaCollapsed: { paddingBottom: 8 },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: "rgba(17,17,17,0.14)", alignSelf: "center" },
  sheetHeaderRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  sheetHeaderTitle: { flex: 1, color: HAULSY.colors.text, fontSize: 14, fontWeight: "900" },
  collapsedBarRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  collapsedRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  openPill: { height: 30, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "rgba(124,58,237,0.10)", borderWidth: 1, borderColor: "rgba(124,58,237,0.18)", alignItems: "center", justifyContent: "center" },
  openPillText: { color: PURPLE, fontSize: 12, fontWeight: "900" },
  closeIconBtn: { width: 30, height: 30, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(17,17,17,0.04)", borderWidth: 1, borderColor: HAULSY.colors.border },
  ctxRow: { marginTop: 6, flexDirection: "row", gap: 6, flexWrap: "wrap" },
  ctxChip: { height: 20, paddingHorizontal: 8, borderRadius: 999, backgroundColor: "rgba(17,17,17,0.04)", borderWidth: 1, borderColor: HAULSY.colors.border, alignItems: "center", justifyContent: "center" },
  ctxChipText: { color: HAULSY.colors.subtext, fontSize: 10, fontWeight: "900" },
  sheetContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  doneText: { color: HAULSY.colors.text, fontSize: 12, fontWeight: "900" },

  sheetTitle: { color: HAULSY.colors.text, fontSize: 16, fontWeight: "900" },
  sheetSub: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700", lineHeight: 16 },
  stepMini: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800" },
  youGetRow: { marginTop: 2, gap: 8 },
  youGetLabel: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800" },
  youGetItems: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  youGetPill: { height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: HAULSY.colors.bg, borderWidth: 1, borderColor: HAULSY.colors.border, flexDirection: "row", alignItems: "center", gap: 6 },
  youGetText: { color: HAULSY.colors.text, fontSize: 11, fontWeight: "900" },
  sheetBtnRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  sheetBtn: { height: 42, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: HAULSY.colors.border, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  sheetBtnPrimary: { backgroundColor: PURPLE, borderColor: "rgba(124,58,237,0.25)" },
  sheetBtnText: { color: HAULSY.colors.text, fontSize: 12, fontWeight: "900" },

  skelCard: { borderRadius: 16, borderWidth: 1, borderColor: HAULSY.colors.border, backgroundColor: "#fff", padding: 12 },
  skelLine: { height: 12, borderRadius: 8, backgroundColor: "rgba(17,17,17,0.08)" },
  skelPill: { width: 74, height: 24, borderRadius: 999, backgroundColor: "rgba(17,17,17,0.06)" },

  stepRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: PURPLE, alignItems: "center", justifyContent: "center" },
  stepText: { color: HAULSY.colors.text, fontSize: 12, fontWeight: "900" },

  resultCard: { borderRadius: 16, borderWidth: 1, borderColor: HAULSY.colors.border, backgroundColor: HAULSY.colors.bg, padding: 12 },
  resultTitle: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800" },
  resultBig: { marginTop: 6, color: HAULSY.colors.text, fontSize: 16, fontWeight: "900" },
  resultMeta: { marginTop: 6, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700", lineHeight: 16 },

  sheetBlock: { borderRadius: 16, borderWidth: 1, borderColor: HAULSY.colors.border, backgroundColor: "#fff", padding: 12 },
  blockTitle: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },
  blockSub: { marginTop: 6, color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "700", lineHeight: 16 },
  pillRow: { marginTop: 10, flexDirection: "row", gap: 8, flexWrap: "wrap" },
  pill: { height: 30, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: HAULSY.colors.border, alignItems: "center", justifyContent: "center" },
  pillOn: { backgroundColor: "rgba(124,58,237,0.10)", borderColor: "rgba(124,58,237,0.18)" },
  pillText: { color: HAULSY.colors.text, fontSize: 11, fontWeight: "900" },
  pillTextOn: { color: PURPLE },

  actionChips: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionChip: { height: 30, paddingHorizontal: 10, borderRadius: 999, backgroundColor: HAULSY.colors.bg, borderWidth: 1, borderColor: HAULSY.colors.border, alignItems: "center", justifyContent: "center" },
  actionChipText: { color: HAULSY.colors.text, fontSize: 11, fontWeight: "900" },

  sheetCtas: { marginTop: 4, gap: 10 },
  primaryCta: { height: 46, borderRadius: 16, backgroundColor: PURPLE, alignItems: "center", justifyContent: "center" },
  primaryCtaText: { color: "#fff", fontSize: 13, fontWeight: "900" },
  secondaryCta: { height: 46, borderRadius: 16, borderWidth: 1, borderColor: HAULSY.colors.border, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  secondaryCtaText: { color: HAULSY.colors.text, fontSize: 13, fontWeight: "900" },

  attachRow: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  attachLabel: { color: HAULSY.colors.subtext, fontSize: 12, fontWeight: "800", marginRight: 2 },
  attachPill: { height: 28, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: HAULSY.colors.border, flexDirection: "row", alignItems: "center", gap: 6 },
  attachPillOn: { backgroundColor: "rgba(124,58,237,0.08)", borderColor: "rgba(124,58,237,0.14)" },
  attachText: { color: HAULSY.colors.text, fontSize: 11, fontWeight: "900" },
  attachTextOn: { color: PURPLE },
});
