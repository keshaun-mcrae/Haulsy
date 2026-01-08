import React from "react";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HAULSY } from "@/constants/haulsyTheme";

function TabIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: HAULSY.colors.primary,
          tabBarInactiveTintColor: HAULSY.colors.icon,
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: HAULSY.colors.border,
          backgroundColor: HAULSY.colors.card,
        },
        tabBarLabelStyle: { fontSize: 12, marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} />,
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <TabIcon name="chatbubble-outline" color={color} />,
        }}
      />

      <Tabs.Screen
        name="haulsyiq"
        options={{
          title: "",
          tabBarButton: (props) => (
            <Pressable
              {...(props as any)}
              style={({ pressed }) => ({
                width: 56,
                height: 56,
                marginTop: -18,
                borderRadius: 16,
                backgroundColor: HAULSY.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.9 : 1,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 8 },
                elevation: 6,
              })}
            >
              <Ionicons name="sparkles" size={24} color="#fff" />
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="earn"
        options={{
          title: "Earn",
          tabBarIcon: ({ color }) => <TabIcon name="cash-outline" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
