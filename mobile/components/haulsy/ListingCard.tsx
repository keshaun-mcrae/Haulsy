import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "./Card";

// Brand palette (strict roles)
const INK = "#111111";
const GRAY = "#6B7280";
const META = "#7A7F87";
const BORDER = "#EEF2F7";

export type Listing = {
  id: string;
  title: string;
  price: number;
  city: string;
  minutesAgo: number;
  image: ImageSourcePropType | string;
  badge?: string;
};

function formatMoney(n: number) {
  return n.toLocaleString();
}

export function ListingCard({ item, onPress }: { item: Listing; onPress?: () => void }) {
  const uri = typeof item.image === "string" ? { uri: item.image } : item.image;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.95 }]}>
      <Card style={styles.card}>
        <Image source={uri} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${formatMoney(item.price)}</Text>
            <Text style={styles.meta}>
              {item.city} • {item.minutesAgo}m
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>
          {!!item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  card: {
    overflow: "hidden",
    padding: 0,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
  },
  image: {
    height: 132,
    width: "100%",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  body: { padding: 12, gap: 8 },
  priceRow: { gap: 2 },
  price: { color: INK, fontSize: 18, fontWeight: "900" },
  meta: { color: META, fontSize: 12, fontWeight: "600", lineHeight: 16 },
  title: { color: INK, fontWeight: "700", lineHeight: 18 },
  badge: {
    alignSelf: "flex-start",
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: INK, fontWeight: "700", fontSize: 11 },
});
