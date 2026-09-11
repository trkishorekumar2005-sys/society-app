import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

/** Full-space placeholder shown when a list has no items. */
export function EmptyState({ title, description, icon = 'tray-outline' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Icon source={icon} size={48} />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      {!!description && (
        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>
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
  description: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
