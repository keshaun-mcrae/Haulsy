import type { TextInputProps } from "react-native";
import { StyleSheet, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HAULSY } from "@/constants/haulsyTheme";
import { Card } from "./Card";

type Props = TextInputProps & {
  containerStyle?: any;
};

export function SearchBar({ containerStyle, style, ...props }: Props) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      <Card variant="surface" style={styles.card}>
        <Ionicons name="search-outline" size={18} color={HAULSY.colors.icon} />
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor={HAULSY.colors.subtext}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: HAULSY.spacing.md, paddingTop: 4, paddingBottom: HAULSY.spacing.sm },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: HAULSY.spacing.md,
    height: 46,
    borderRadius: HAULSY.radius.md,
  },
  input: {
    flex: 1,
    color: HAULSY.colors.text,
    ...HAULSY.typography.body,
  },
});
