import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chip, FAB, Modal, Portal, SegmentedButtons, Text, useTheme } from 'react-native-paper';

import { AppButton, AppTextField, Card, EmptyState, ErrorState, LoadingState, ScreenContainer, StatusChip } from '@/components';
import { ComplaintCategory, ComplaintPriority, Role } from '@/core/constants';
import { Spacing } from '@/core/theme';
import { formatDateTime } from '@/core/utils/date';
import { useResponsiveColumns } from '@/core/utils/responsive';
import {
  getComplaintCategoryLabel,
  getComplaintPriorityLabel,
  getComplaintPriorityTone,
  getComplaintStatusLabel,
  getComplaintStatusTone,
  getNextComplaintStatus,
} from '@/core/utils/status';
import { validateRequired } from '@/core/utils/validation';
import { useAuthUser } from '@/domain/store/authStore';
import {
  useComplaintsActionError,
  useComplaintsActions,
  useComplaintsActionStatus,
  useComplaintsData,
  useComplaintsError,
  useComplaintsStatus,
} from '@/domain/store/complaintsStore';
import type { Complaint } from '@/domain/models';

const CATEGORIES = Object.values(ComplaintCategory).map((value) => ({
  value,
  label: getComplaintCategoryLabel(value),
}));

const PRIORITIES = Object.values(ComplaintPriority).map((value) => ({
  value,
  label: getComplaintPriorityLabel(value),
}));

interface FormState {
  title: string;
  category: ComplaintCategory;
  description: string;
  priority: ComplaintPriority;
}

interface FormErrors {
  title?: string;
  description?: string;
}

const initialForm: FormState = {
  title: '',
  category: ComplaintCategory.MAINTENANCE,
  description: '',
  priority: ComplaintPriority.MEDIUM,
};

export default function ComplaintsScreen() {
  const theme = useTheme();
  const numColumns = useResponsiveColumns();
  const user = useAuthUser();
  const isAdmin = user?.role === Role.ADMIN;

  const allComplaints = useComplaintsData();
  const status = useComplaintsStatus();
  const error = useComplaintsError();
  const actionStatus = useComplaintsActionStatus();
  const actionError = useComplaintsActionError();
  const { fetch, retry, create, updateStatus, clearActionError } = useComplaintsActions();

  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const complaints = isAdmin ? allComplaints : allComplaints.filter((c) => c.raisedBy === user?.id);

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isEmpty = complaints.length === 0 && status === 'success';
  const isSubmitting = actionStatus === 'loading';

  function openForm() {
    setForm(initialForm);
    setFormErrors({});
    clearActionError();
    setFormVisible(true);
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit() {
    const nextErrors: FormErrors = {
      title: validateRequired(form.title, 'Title'),
      description: validateRequired(form.description, 'Description'),
    };
    setFormErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !user) {
      return;
    }

    const ok = await create({
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      priority: form.priority,
      raisedBy: user.id,
      raisedByName: user.name,
      flatNumber: user.flatNumber,
    });
    if (ok) {
      setFormVisible(false);
    }
  }

  async function handleAdvanceStatus(complaint: Complaint) {
    const next = getNextComplaintStatus(complaint.status);
    if (!next) return;
    await updateStatus(complaint.id, next);
  }

  if (isLoading && complaints.length === 0) {
    return <LoadingState message="Loading complaints…" />;
  }

  if (isError) {
    return <ErrorState message={error || 'Failed to load complaints.'} onRetry={retry} />;
  }

  return (
    <>
      <ScreenContainer scrollable={false} refreshing={isLoading} onRefresh={fetch}>
        {isEmpty ? (
          <EmptyState
            icon="clipboard-text-outline"
            title="No complaints"
            description={
              isAdmin ? 'No complaints have been raised yet.' : 'Raise a complaint using the button below.'
            }
          />
        ) : (
          <FlatList
            key={numColumns}
            data={complaints}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isExpanded = expandedId === item.id;
              const nextStatus = getNextComplaintStatus(item.status);
              return (
                <Card style={[styles.card, numColumns > 1 && styles.gridItem]}>
                  <Card.Content>
                    <View style={styles.headerRow}>
                      <Text variant="titleMedium" style={styles.title}>
                        {item.title}
                      </Text>
                      <StatusChip
                        label={getComplaintStatusLabel(item.status)}
                        tone={getComplaintStatusTone(item.status)}
                      />
                    </View>

                    <View style={styles.metaRow}>
                      <StatusChip label={getComplaintCategoryLabel(item.category)} tone="neutral" />
                      <StatusChip
                        label={getComplaintPriorityLabel(item.priority)}
                        tone={getComplaintPriorityTone(item.priority)}
                      />
                    </View>

                    {isAdmin && (
                      <Text variant="bodySmall" style={styles.raisedBy}>
                        {item.raisedByName} · {item.flatNumber}
                      </Text>
                    )}

                    <Text variant="bodyMedium" style={styles.description}>
                      {item.description}
                    </Text>

                    <AppButton
                      variant="text"
                      onPress={() => setExpandedId(isExpanded ? null : item.id)}
                      style={styles.timelineToggle}>
                      {isExpanded ? 'Hide timeline' : 'View timeline'}
                    </AppButton>

                    {isExpanded && (
                      <View style={[styles.timeline, { borderLeftColor: theme.colors.outlineVariant }]}>
                        {item.statusHistory.map((event) => (
                          <View key={`${event.status}-${event.timestamp}`} style={styles.timelineEvent}>
                            <Text variant="labelMedium">
                              {getComplaintStatusLabel(event.status)} · {formatDateTime(event.timestamp)}
                            </Text>
                            {!!event.note && (
                              <Text variant="bodySmall" style={styles.timelineNote}>
                                {event.note}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    )}

                    {isAdmin && nextStatus && (
                      <AppButton
                        onPress={() => handleAdvanceStatus(item)}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        style={styles.advanceButton}>
                        Mark as {getComplaintStatusLabel(nextStatus)}
                      </AppButton>
                    )}
                  </Card.Content>
                </Card>
              );
            }}
          />
        )}
      </ScreenContainer>

      {!isAdmin && <FAB icon="plus" style={styles.fab} onPress={openForm} label="Raise complaint" />}

      <Portal>
        <Modal
          visible={formVisible}
          onDismiss={() => setFormVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.elevation.level2 }]}>
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Raise a complaint
          </Text>

          <AppTextField
            label="Title"
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
            errorText={formErrors.title}
          />

          <Text variant="labelLarge" style={styles.fieldLabel}>
            Category
          </Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.value}
                selected={form.category === cat.value}
                onPress={() => updateField('category', cat.value)}
                style={styles.chip}
                mode={form.category === cat.value ? 'flat' : 'outlined'}>
                {cat.label}
              </Chip>
            ))}
          </View>

          <Text variant="labelLarge" style={styles.fieldLabel}>
            Priority
          </Text>
          <SegmentedButtons
            value={form.priority}
            onValueChange={(value) => updateField('priority', value as ComplaintPriority)}
            buttons={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
            style={styles.segmented}
          />

          <AppTextField
            label="Description"
            value={form.description}
            onChangeText={(value) => updateField('description', value)}
            errorText={formErrors.description}
            multiline
            numberOfLines={4}
          />

          {!!actionError && (
            <Text variant="bodySmall" style={[styles.actionError, { color: theme.colors.error }]}>
              {actionError}
            </Text>
          )}

          <AppButton onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting} style={styles.submitButton}>
            Submit
          </AppButton>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  columnWrapper: {
    gap: Spacing.two,
  },
  card: {
    marginBottom: Spacing.two,
  },
  gridItem: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  title: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  raisedBy: {
    opacity: 0.6,
    marginBottom: Spacing.one,
  },
  description: {
    marginBottom: Spacing.two,
  },
  timelineToggle: {
    alignSelf: 'flex-start',
  },
  timeline: {
    marginTop: Spacing.one,
    paddingLeft: Spacing.two,
    borderLeftWidth: 2,
    gap: Spacing.two,
  },
  timelineEvent: {
    gap: 2,
  },
  timelineNote: {
    opacity: 0.7,
  },
  advanceButton: {
    marginTop: Spacing.two,
  },
  fab: {
    position: 'absolute',
    right: Spacing.three,
    bottom: Spacing.three,
  },
  modal: {
    marginHorizontal: Spacing.three,
    padding: Spacing.four,
    borderRadius: 16,
    maxHeight: '85%',
  },
  modalTitle: {
    marginBottom: Spacing.three,
  },
  fieldLabel: {
    marginBottom: Spacing.one,
    marginTop: Spacing.one,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  chip: {
    marginBottom: Spacing.one,
  },
  segmented: {
    marginBottom: Spacing.three,
  },
  actionError: {
    marginBottom: Spacing.two,
  },
  submitButton: {
    marginTop: Spacing.two,
  },
});
