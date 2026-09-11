import { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

import { Card, EmptyState, ErrorState, LoadingState, ScreenContainer } from '@/components';
import { AnnouncementCategory } from '@/core/constants';
import { Spacing } from '@/core/theme';
import { formatDateTime } from '@/core/utils/date';
import { useResponsiveColumns } from '@/core/utils/responsive';
import {
  useAnnouncementsActions,
  useAnnouncementsCategory,
  useAnnouncementsData,
  useAnnouncementsError,
  useAnnouncementsStatus,
} from '@/domain/store/announcementsStore';

const CATEGORIES: { value: AnnouncementCategory; label: string }[] = [
  { value: AnnouncementCategory.GENERAL, label: 'General' },
  { value: AnnouncementCategory.MAINTENANCE, label: 'Maintenance' },
  { value: AnnouncementCategory.EVENT, label: 'Event' },
  { value: AnnouncementCategory.EMERGENCY, label: 'Emergency' },
  { value: AnnouncementCategory.BILLING, label: 'Billing' },
];

export default function AnnouncementsScreen() {
  const numColumns = useResponsiveColumns();
  const announcements = useAnnouncementsData();
  const status = useAnnouncementsStatus();
  const error = useAnnouncementsError();
  const selectedCategory = useAnnouncementsCategory();
  const { fetch, filterByCategory, retry } = useAnnouncementsActions();

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isEmpty = announcements.length === 0 && status === 'success';

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading && announcements.length === 0) {
    return <LoadingState message="Loading announcements…" />;
  }

  if (isError) {
    return <ErrorState message={error || 'Failed to load announcements.'} onRetry={retry} />;
  }

  if (isEmpty) {
    return <EmptyState icon="bullhorn-outline" title="No announcements" />;
  }

  return (
    <ScreenContainer scrollable={false} refreshing={isLoading} onRefresh={fetch}>
      <View style={styles.categoryRow}>
        <Chip
          selected={!selectedCategory}
          onPress={() => filterByCategory(null)}
          style={styles.chip}
          mode={!selectedCategory ? 'flat' : 'outlined'}>
          All
        </Chip>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.value}
            selected={selectedCategory === cat.value}
            onPress={() => filterByCategory(cat.value)}
            style={styles.chip}
            mode={selectedCategory === cat.value ? 'flat' : 'outlined'}>
            {cat.label}
          </Chip>
        ))}
      </View>

      <FlatList
        key={numColumns}
        data={announcements}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={[styles.announcementCard, numColumns > 1 && styles.gridItem]}>
            <Card.Content>
              <View style={styles.header}>
                <Text variant="titleMedium" style={styles.title}>
                  {item.title}
                </Text>
                {item.pinned && <Text style={styles.pinnedBadge}>📌</Text>}
              </View>
              <Text variant="bodySmall" style={styles.meta}>
                {formatDateTime(item.createdAt)} • {item.createdByName}
              </Text>
              <Text variant="bodyMedium" style={styles.body}>
                {item.body}
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  categoryRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    flexWrap: 'wrap',
  },
  chip: {
    marginBottom: Spacing.one,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  columnWrapper: {
    gap: Spacing.two,
  },
  announcementCard: {
    marginBottom: Spacing.two,
  },
  gridItem: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.one,
    gap: Spacing.one,
  },
  title: {
    flex: 1,
  },
  pinnedBadge: {
    fontSize: 16,
  },
  meta: {
    opacity: 0.6,
    marginBottom: Spacing.two,
  },
  body: {
    lineHeight: 22,
  },
});
