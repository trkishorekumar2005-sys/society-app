import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { Card, ScreenContainer, StatusChip } from '@/components';
import { DEMO_ACCOUNTS } from '@/core/constants';
import { Spacing } from '@/core/theme';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <Text variant="headlineMedium" style={styles.title}>
        Society Management
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Component library and mock data are ready. Auth, navigation, and feature screens land in
        the next phase.
      </Text>

      <Card>
        <Card.Title title="Demo accounts" />
        <Card.Content style={styles.accountsList}>
          {DEMO_ACCOUNTS.map((account) => (
            <Card key={account.email} style={styles.accountRow}>
              <Card.Content style={styles.accountRowContent}>
                <Text variant="bodyMedium">{account.email}</Text>
                <StatusChip label={account.label} tone="info" />
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: Spacing.one,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: Spacing.four,
  },
  accountsList: {
    gap: Spacing.two,
  },
  accountRow: {
    marginBottom: 0,
  },
  accountRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
