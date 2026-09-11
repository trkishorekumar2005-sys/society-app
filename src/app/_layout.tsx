import { Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationDarkTheme, NavigationLightTheme, PaperDarkTheme, PaperLightTheme } from '@/core/theme';

export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';

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
