import React from "react";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function ProfileStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="driver" />
      <Stack.Screen name="driver-hq" />
      <Stack.Screen name="seller-hq" />
      <Stack.Screen name="seller-settings" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="account" />
      <Stack.Screen name="security" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="rewards" />
      <Stack.Screen name="about" />
    </Stack>
  );
}

