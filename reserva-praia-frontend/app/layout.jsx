import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Isso força o uso do grupo (tabs) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
