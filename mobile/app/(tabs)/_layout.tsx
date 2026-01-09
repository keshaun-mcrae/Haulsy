import React from "react";
import { Tabs } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Brand palette (strict roles)
const INK = "#111111";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";
const BLUE = "#1E6BFF";
const PURPLE = "#7C3AED";

function TabIcon({
  focused,
  activeName,
  inactiveName,
  color,
}: {
  focused: boolean;
  activeName: React.ComponentProps<typeof Ionicons>["name"];
  inactiveName: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons name={focused ? activeName : inactiveName} size={24} color={color} />;
}

function CenterTabButton(props: any) {
  const selected = !!props?.accessibilityState?.selected;

  const SLOT_W = 84;
  const FAB_SIZE = 52;
  const LIFT_Y = -14;
  const ICON_SIZE = 19;

  return (
    <View style={[props.style, styles.centerSlot]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={props.accessibilityState}
        accessibilityLabel={props.accessibilityLabel}
        testID={props.testID}
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        hitSlop={16}
        style={({ pressed }) => [styles.centerWrap, { width: SLOT_W }, pressed && { opacity: 0.95 }]}
      >
        <View
          style={[
            styles.fab,
            {
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: FAB_SIZE / 2,
              transform: [{ translateY: LIFT_Y }],
              backgroundColor: PURPLE,
            },
          ]}
        >
          <Ionicons name="sparkles" size={ICON_SIZE} color="#fff" />
        </View>
        <Text style={[styles.centerLabel, { color: selected ? PURPLE : GRAY }]}>HaulsyIQ</Text>
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);
  const BAR_HEIGHT = 74 + bottomPad;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: "#9AA0A6",
        tabBarStyle: {
          height: BAR_HEIGHT,
          paddingTop: 8,
          paddingBottom: bottomPad,
          borderTopWidth: 1,
          borderTopColor: BORDER,
          backgroundColor: "#FFFFFF",
          overflow: "visible",
          ...(Platform.OS === "ios"
            ? { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: -6 } }
            : { elevation: 10 }),
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeName="home" inactiveName="home-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              activeName="chatbubble-ellipses"
              inactiveName="chatbubble-ellipses-outline"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="haulsyiq"
        options={{
          title: "HaulsyIQ",
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <CenterTabButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="earn"
        options={{
          title: "Earn",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeName="car" inactiveName="car-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeName="person" inactiveName="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerSlot: {
    flex: 1,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  centerWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "visible",
  },
  fab: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  centerLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
