import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts
} from '@expo-google-fonts/manrope';
import {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold
} from '@expo-google-fonts/public-sans';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f4f6f3' },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add"
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'New Transaction',
          headerTitleStyle: {
            fontFamily: 'Manrope_700Bold',
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#191c1b',
        }}
      />
    </Stack>
  );
}
