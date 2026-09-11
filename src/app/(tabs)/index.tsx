import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { EmptyState, ScreenContainer } from '@/components';
import { Spacing } from '@/core/theme';
import { useAuthUser } from '@/domain/store/authStore';

export default function AnnouncementsScreen() {
  const user = useAuthUser();
  const firstName = user?.name.split(' ')[0];

  return (
    <ScreenContainer>
      <Text variant="headlineSmall" style={styles.greeting}>
        Hi {firstName}
      </Text>
      <EmptyState
        icon="bullhorn-outline"
        title="Announcements coming soon"
        description="Pinned notices and updates from your society admin will show up here."
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greeting: {
    marginBottom: Spacing.three,
  },
});
