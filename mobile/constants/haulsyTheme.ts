import type { TextStyle, ViewStyle } from "react-native";

export const HAULSY = {
  colors: {
    bg: "#F6F8FC",
    card: "#FFFFFF",
    text: "#0B1220",
    subtext: "#6B7280",
    border: "#E6EAF2",
    primary: "#2563FF", // primary blue
    primarySoft: "#EAF0FF",
    accent: "#7C3AED", // accent purple
    icon: "#9AA4B2",
  },
  radius: { lg: 18, md: 14, sm: 12, pill: 999 },
  shadow: {
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    } satisfies ViewStyle,
    android: { elevation: 3 },
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  typography: {
    h1: { fontSize: 22, fontWeight: "800", lineHeight: 28 } satisfies TextStyle,
    h2: { fontSize: 18, fontWeight: "800", lineHeight: 24 } satisfies TextStyle,
    body: { fontSize: 14, fontWeight: "600", lineHeight: 20 } satisfies TextStyle,
    caption: { fontSize: 12, fontWeight: "600", lineHeight: 16 } satisfies TextStyle,
    button: { fontSize: 14, fontWeight: "800", lineHeight: 18 } satisfies TextStyle,
  },
} as const;
