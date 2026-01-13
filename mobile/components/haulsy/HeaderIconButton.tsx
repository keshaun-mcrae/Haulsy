import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HAULSY } from "@/constants/haulsyTheme";

// Brand palette (strict roles)
const INK = "#111111";
const BORDER = "#EEF2F7";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
  badge?: boolean;
  size?: number;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  children?: ReactNode;
};

export function HeaderIconButton({
  icon,
  onPress,
  badge,
  size = 34,
  iconSize = 17,
  iconColor = INK,
  backgroundColor = "#FFFFFF",
  borderColor = BORDER,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.btn,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor,
        },
        pressed && { opacity: 0.9 },
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      {!!badge && <View style={styles.badge} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  badge: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
