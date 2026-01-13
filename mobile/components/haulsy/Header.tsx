import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { HAULSY } from "@/constants/haulsyTheme";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function Header({ title, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {!!right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: HAULSY.spacing.md,
    paddingTop: HAULSY.spacing.sm,
    paddingBottom: HAULSY.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: HAULSY.colors.bg,
  },
  left: { flex: 1, paddingRight: HAULSY.spacing.sm },
  right: { alignItems: "flex-end" },
  title: { color: HAULSY.colors.text, ...HAULSY.typography.h1 },
  subtitle: { color: HAULSY.colors.subtext, marginTop: 2, ...HAULSY.typography.caption },
});
