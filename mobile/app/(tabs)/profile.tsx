import React from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card, Header } from "@/components/haulsy";

type SettingRow = {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

const SETTINGS: SettingRow[] = [
  { id: "s1", title: "Account", subtitle: "Personal info, payout, security", icon: "person-circle-outline" },
  { id: "s2", title: "Delivery", subtitle: "Availability, vehicle, zones", icon: "bicycle-outline" },
  { id: "s3", title: "Notifications", subtitle: "Messages, offers, pickups", icon: "notifications-outline" },
  { id: "s4", title: "Help & support", subtitle: "FAQs and contact", icon: "help-circle-outline" },
];

export default function ProfileScreen() {
  const user = { name: "Wes", handle: "@weshaulsy", rating: 4.9, sales: 12, deliveries: 6 };

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
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.handle}>{user.handle}</Text>
                </View>
                <Pressable style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.92 }]}>
                  <Ionicons name="create-outline" size={16} color={HAULSY.colors.primary} />
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </View>

              <View style={styles.statsRow}>
                <Stat label="Rating" value={user.rating.toFixed(1)} icon="star" />
                <View style={styles.divider} />
                <Stat label="Sales" value={`${user.sales}`} icon="pricetag" />
                <View style={styles.divider} />
                <Stat label="Deliveries" value={`${user.deliveries}`} icon="bicycle" />
              </View>
            </Card>

            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: HAULSY.spacing.sm }} />}
        renderItem={({ item }) => (
          <Pressable style={({ pressed }) => [pressed && { opacity: 0.95 }]}>
            <Card variant="surface" style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Ionicons name={item.icon} size={18} color={HAULSY.colors.icon} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                {!!item.subtitle && <Text style={styles.settingSub}>{item.subtitle}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={18} color={HAULSY.colors.icon} />
            </Card>
          </Pressable>
        )}
        ListFooterComponent={
          <View style={{ paddingTop: HAULSY.spacing.lg }}>
            <Pressable style={({ pressed }) => [styles.logout, pressed && { opacity: 0.92 }]}>
              <Ionicons name="log-out-outline" size={18} color={HAULSY.colors.accent} />
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
            <Text style={styles.footerText}>Haulsy • Demo build</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: HAULSY.colors.primarySoft,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: HAULSY.colors.primary, fontWeight: "900", fontSize: 18 },
  name: { color: HAULSY.colors.text, ...HAULSY.typography.h2 },
  handle: { color: HAULSY.colors.subtext, marginTop: 2, ...HAULSY.typography.caption },
  editBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: HAULSY.radius.pill,
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
    borderColor: HAULSY.colors.border,
    backgroundColor: HAULSY.colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: { color: HAULSY.colors.accent, ...HAULSY.typography.button },
  footerText: { textAlign: "center", color: HAULSY.colors.subtext, marginTop: 10, ...HAULSY.typography.caption },
});
