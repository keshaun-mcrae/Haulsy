import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { Listing } from "@/lib/mockListings";

// Brand tokens
const BG = "#FFFFFF";
const INK = "#111111";
const SUB = "#7A7F87";
const BORDER = "#EEF2F7";
const BLUE = "#1E6BFF";

function sanitizeTitle(raw: string) {
  return raw
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\bdelivery\s*avail\.?\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Props = {
  listing: Listing;
  onPress?: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
};

export function ListingCard({ listing, onPress, isSaved, onToggleSave }: Props) {
  const title = sanitizeTitle(listing.title);
  const imageUri = listing.images?.[0];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.97 }]}
    >
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          {!!imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}

          {!!listing.deliveryAvailable && (
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryText}>Delivery</Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${listing.price.toLocaleString()}</Text>

            <Pressable
              onPress={onToggleSave}
              hitSlop={10}
              style={({ pressed }) => [styles.heartBtn, pressed && { opacity: 0.8 }]}
            >
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={19}
                color={isSaved ? BLUE : "#6B7280"}
              />
            </Pressable>
          </View>

          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>

          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.meta}>
            {listing.city} • {listing.timeAgo}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },

  card: {
    backgroundColor: BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },

  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { width: "100%", height: "100%", backgroundColor: "#F3F4F6" },

  deliveryBadge: {
    position: "absolute",
    left: 8,
    top: 8,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: Platform.OS === "ios" ? 0.5 : 1,
    borderColor: "rgba(30,107,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  deliveryText: { color: BLUE, fontSize: 11, fontWeight: "600" },

  details: { padding: 12, gap: 6 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { color: INK, fontSize: 17, fontWeight: "800" },
  heartBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  title: { color: INK, fontSize: 14, fontWeight: "600" },
  meta: { color: SUB, fontSize: 12 },
});
