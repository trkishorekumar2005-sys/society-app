import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/core/theme';

export interface ScreenContainerProps {
  children: ReactNode;
  /** Wraps children in a ScrollView. Set to false for screens that manage their own scrolling (e.g. FlatList). */
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentPadding?: boolean;
}

/** Standard screen wrapper: safe-area insets, centered max width on web, and pull-to-refresh support. */
export function ScreenContainer({
  children,
  scrollable = true,
  refreshing = false,
  onRefresh,
  contentPadding = true,
}: ScreenContainerProps) {
  const innerStyle = [styles.inner, contentPadding && styles.padded];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {scrollable ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}>
          <View style={innerStyle}>{children}</View>
        </ScrollView>
      ) : (
        <View style={styles.scrollContent}>
          <View style={innerStyle}>{children}</View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flex: 1,
  },
  padded: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
});
