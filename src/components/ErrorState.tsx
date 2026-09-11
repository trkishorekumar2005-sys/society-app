import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { AppButton } from '@/components/AppButton';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Full-space error placeholder with an optional Retry action, shown when a fetch fails. */
export function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Icon source="alert-circle-outline" size={48} />
      <Text variant="titleMedium" style={styles.title}>
        Unable to load
      </Text>
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
      {!!onRetry && (
        <AppButton variant="outline" onPress={onRetry} style={styles.retryButton}>
          Retry
        </AppButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
  },
  retryButton: {
    marginTop: 12,
  },
});
