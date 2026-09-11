import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { AppButton, Card, ScreenContainer } from '@/components';
import { Spacing } from '@/core/theme';
import { useAuthActions, useAuthUser } from '@/domain/store/authStore';

const FIELDS: { label: string; key: 'name' | 'email' | 'phone' | 'flatNumber' | 'role' }[] = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Phone', key: 'phone' },
  { label: 'Flat number', key: 'flatNumber' },
  { label: 'Role', key: 'role' },
];

export default function ProfileScreen() {
  const user = useAuthUser();
  const { logout } = useAuthActions();

  if (!user) {
    return null;
  }

  return (
    <ScreenContainer>
      <Card>
        <Card.Content style={styles.fieldList}>
          {FIELDS.map((field) => (
            <View key={field.key} style={styles.field}>
              <Text variant="labelMedium" style={styles.fieldLabel}>
                {field.label}
              </Text>
              <Text variant="bodyLarge">{user[field.key]}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <AppButton variant="outline" onPress={logout} style={styles.logoutButton}>
        Log out
      </AppButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fieldList: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.half,
  },
  fieldLabel: {
    opacity: 0.6,
  },
  logoutButton: {
    marginTop: Spacing.four,
  },
});
