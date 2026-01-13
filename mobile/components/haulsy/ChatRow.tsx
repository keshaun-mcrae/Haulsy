import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "./Card";

export type ChatThread = {
  id: string;
  name: string;
  lastMessage: string;
  minutesAgo: number;
  unread?: number;
  avatar?: ImageSourcePropType | string;
};

export function ChatRow({ item, onPress }: { item: ChatThread; onPress?: () => void }) {
  const initial = item.name.trim().slice(0, 1).toUpperCase();
  const avatarUri = item.avatar ? (typeof item.avatar === "string" ? { uri: item.avatar } : item.avatar) : null;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.95 }]}>
      <Card variant="surface" style={styles.row}>
        <View style={styles.avatar}>
          {avatarUri ? (
            <Image source={avatarUri} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>

        <View style={styles.mid}>
          <View style={styles.topLine}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            <Text style={styles.time}>{item.minutesAgo}m</Text>
          </View>
          <Text numberOfLines={1} style={styles.preview}>
            {item.lastMessage}
          </Text>
        </View>

        {!!item.unread && item.unread > 0 && (
          <View style={styles.unread}>
            <Text style={styles.unreadText}>{item.unread > 99 ? "99+" : item.unread}</Text>
          </View>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: HAULSY.spacing.md,
    paddingVertical: HAULSY.spacing.sm,
    borderRadius: HAULSY.radius.lg,
    backgroundColor: HAULSY.colors.card,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: HAULSY.colors.primarySoft,
    borderWidth: 1,
    borderColor: HAULSY.colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: HAULSY.spacing.sm,
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarText: { color: HAULSY.colors.primary, fontWeight: "900", fontSize: 16 },
  mid: { flex: 1, gap: 4 },
  topLine: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 10 },
  name: { color: HAULSY.colors.text, fontWeight: "900", flex: 1 },
  time: { color: HAULSY.colors.subtext, ...HAULSY.typography.caption },
  preview: { color: HAULSY.colors.subtext, ...HAULSY.typography.body },
  unread: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: HAULSY.radius.pill,
    backgroundColor: HAULSY.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: HAULSY.spacing.sm,
  },
  unreadText: { color: "#fff", fontWeight: "900", fontSize: 12 },
});
