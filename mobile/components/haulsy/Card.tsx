import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";
import { HAULSY } from "@/constants/haulsyTheme";

// Brand palette (strict roles)
const BORDER = "#EEF2F7";

type Props = ViewProps & {
  variant?: "card" | "surface";
};

export function Card({ variant = "card", style, ...props }: Props) {
  return <View {...props} style={[styles.base, variant === "card" ? styles.card : styles.surface, style]} />;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  surface: {
    // no shadow (use when nesting inside lists)
  },
});
