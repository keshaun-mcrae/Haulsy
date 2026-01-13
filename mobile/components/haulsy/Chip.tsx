import type { PressableProps } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import { HAULSY } from "@/constants/haulsyTheme";

type Props = PressableProps & {
  label: string;
  active?: boolean;
};

export function Chip({ label, active = false, style, ...props }: Props) {
  return (
    <Pressable
      {...props}
      style={(state) => [
        styles.base,
        active ? styles.active : styles.inactive,
        state.pressed && { opacity: 0.9 },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: HAULSY.radius.pill,
    borderWidth: 1,
    marginRight: 8,
  },
  inactive: { backgroundColor: HAULSY.colors.card, borderColor: HAULSY.colors.border },
  active: { backgroundColor: HAULSY.colors.primarySoft, borderColor: HAULSY.colors.primary },
  text: { ...HAULSY.typography.caption },
  textInactive: { color: HAULSY.colors.subtext },
  textActive: { color: HAULSY.colors.primary },
});
