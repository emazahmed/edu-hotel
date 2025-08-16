import { Stack } from 'expo-router/stack';

export default function BookingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Book Room' }} />
    </Stack>
  );
}