import { DarkTheme as RouterDarkTheme, DefaultTheme as RouterDefaultTheme } from 'expo-router';
import { Platform } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1E6F5C',
    secondary: '#F2A541',
    error: '#B3261E',
  },
};

export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#5FCBA8',
    secondary: '#F2B766',
    error: '#F2B8B5',
  },
};

// expo-router (SDK 57) vendors its own navigation theme types rather than depending on
// @react-navigation/native, so react-native-paper's adaptNavigationTheme (typed against that
// external package) can't be used here. Build matching Theme objects from the Paper palette instead.
export const NavigationLightTheme = {
  ...RouterDefaultTheme,
  dark: false,
  colors: {
    ...RouterDefaultTheme.colors,
    primary: PaperLightTheme.colors.primary,
    background: PaperLightTheme.colors.background,
    card: PaperLightTheme.colors.elevation.level2,
    text: PaperLightTheme.colors.onBackground,
    border: PaperLightTheme.colors.outlineVariant,
    notification: PaperLightTheme.colors.error,
  },
};

export const NavigationDarkTheme = {
  ...RouterDarkTheme,
  dark: true,
  colors: {
    ...RouterDarkTheme.colors,
    primary: PaperDarkTheme.colors.primary,
    background: PaperDarkTheme.colors.background,
    card: PaperDarkTheme.colors.elevation.level2,
    text: PaperDarkTheme.colors.onBackground,
    border: PaperDarkTheme.colors.outlineVariant,
    notification: PaperDarkTheme.colors.error,
  },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
