import { useEffect } from 'react';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationDarkTheme, NavigationLightTheme, PaperDarkTheme, PaperLightTheme } from '@/core/theme';
import { useAuthActions, useAuthHasHydrated } from '@/domain/store/authStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';
  const hasHydrated = useAuthHasHydrated();
  const { restoreSession } = useAuthActions();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [hasHydrated]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={isDark ? PaperDarkTheme : PaperLightTheme}>
        <ThemeProvider value={isDark ? NavigationDarkTheme : NavigationLightTheme}>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
