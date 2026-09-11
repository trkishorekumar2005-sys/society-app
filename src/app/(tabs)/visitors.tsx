import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB, Modal, Portal, Text, useTheme } from 'react-native-paper';

import {
  AppButton,
  AppTextField,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenContainer,
  StatusChip,
} from '@/components';
import { Role, VisitorStatus } from '@/core/constants';
import { Spacing } from '@/core/theme';
import { formatDate, formatDateTime } from '@/core/utils/date';
import { useResponsiveColumns } from '@/core/utils/responsive';
import { getVisitorStatusLabel, getVisitorStatusTone } from '@/core/utils/status';
import { validatePhone, validateRequired } from '@/core/utils/validation';
import { useAuthUser } from '@/domain/store/authStore';
import {
  useVerifiedVisitor,
  useVisitorsActionError,
  useVisitorsActions,
  useVisitorsActionStatus,
  useVisitorsData,
  useVisitorsError,
  useVisitorsStatus,
} from '@/domain/store/visitorsStore';
import type { Visitor } from '@/domain/models';

interface FormState {
  name: string;
  phone: string;
  purpose: string;
  visitDate: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  purpose?: string;
  visitDate?: string;
}

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

const initialForm: FormState = { name: '', phone: '', purpose: '', visitDate: todayDateOnly() };

export default function VisitorsScreen() {
  const theme = useTheme();
  const user = useAuthUser();
  const isResident = user?.role === Role.RESIDENT;
  const isSecurity = user?.role === Role.SECURITY;

  const numColumns = useResponsiveColumns();

  const allVisitors = useVisitorsData();
  const status = useVisitorsStatus();
  const error = useVisitorsError();
  const actionStatus = useVisitorsActionStatus();
  const actionError = useVisitorsActionError();
  const verifiedVisitor = useVerifiedVisitor();
  const { fetch, retry, create, verifyPassCode, checkIn, checkOut, clearVerified, clearActionError } =
    useVisitorsActions();

  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [newPassCode, setNewPassCode] = useState<string | null>(null);
  const [passCodeInput, setPassCodeInput] = useState('');

  useEffect(() => {
    fetch();
  }, [fetch]);

  const visitors = isResident ? allVisitors.filter((v) => v.residentId === user?.id) : allVisitors;
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isEmpty = visitors.length === 0 && status === 'success';
  const isSubmitting = actionStatus === 'loading';

  function openForm() {
    setForm(initialForm);
    setFormErrors({});
    setNewPassCode(null);
    clearActionError();
    setFormVisible(true);
  }

  function updateField<K extends keyof FormState>(field: K, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit() {
    const nextErrors: FormErrors = {
      name: validateRequired(form.name, 'Name'),
      phone: validatePhone(form.phone),
      purpose: validateRequired(form.purpose, 'Purpose'),
      visitDate: validateRequired(form.visitDate, 'Visit date'),
    };
    setFormErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !user) {
      return;
    }

    const created = await create({
      name: form.name.trim(),
      phone: form.phone.trim(),
      purpose: form.purpose.trim(),
      visitDate: form.visitDate.trim(),
      residentId: user.id,
      residentName: user.name,
      flatNumber: user.flatNumber,
    });
    if (created) {
      setNewPassCode(created.passCode);
    }
  }

  async function handleVerify() {
    if (!passCodeInput.trim()) return;
    await verifyPassCode(passCodeInput.trim());
  }

  async function handleCheckIn(visitor: Visitor) {
    await checkIn(visitor.id);
  }

  async function handleCheckOut(visitor: Visitor) {
    await checkOut(visitor.id);
  }

  if (isLoading && visitors.length === 0) {
    return <LoadingState message="Loading visitors…" />;
  }

  if (isError) {
    return <ErrorState message={error || 'Failed to load visitors.'} onRetry={retry} />;
  }

  return (
    <>
      <ScreenContainer scrollable={false} refreshing={isLoading} onRefresh={fetch}>
        <View style={styles.listArea}>
          {isSecurity && (
            <Card style={styles.verifyCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.verifyTitle}>
                  Verify a pass code
                </Text>
                <View style={styles.verifyRow}>
                  <View style={styles.verifyInput}>
                    <AppTextField
                      label="6-digit code"
                      value={passCodeInput}
                      onChangeText={(value) => {
                        setPassCodeInput(value);
                        if (verifiedVisitor) clearVerified();
                      }}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                  <AppButton onPress={handleVerify} loading={isSubmitting} disabled={isSubmitting}>
                    Verify
                  </AppButton>
                </View>

                {!!actionError && (
                  <Text variant="bodySmall" style={[styles.verifyError, { color: theme.colors.error }]}>
                    {actionError}
                  </Text>
                )}

                {!!verifiedVisitor && (
                  <Card style={styles.verifiedCard} mode="outlined">
                    <Card.Content>
                      <View style={styles.headerRow}>
                        <Text variant="titleSmall" style={styles.title}>
                          {verifiedVisitor.name}
                        </Text>
                        <StatusChip
                          label={getVisitorStatusLabel(verifiedVisitor.status)}
                          tone={getVisitorStatusTone(verifiedVisitor.status)}
                        />
                      </View>
                      <Text variant="bodySmall" style={styles.meta}>
                        {verifiedVisitor.purpose} · Visiting {verifiedVisitor.residentName} ({verifiedVisitor.flatNumber})
                      </Text>
                      {verifiedVisitor.status === VisitorStatus.PENDING && (
                        <AppButton onPress={() => handleCheckIn(verifiedVisitor)} style={styles.actionButton}>
                          Check in
                        </AppButton>
                      )}
                      {verifiedVisitor.status === VisitorStatus.CHECKED_IN && (
                        <AppButton onPress={() => handleCheckOut(verifiedVisitor)} style={styles.actionButton}>
                          Check out
                        </AppButton>
                      )}
                    </Card.Content>
                  </Card>
                )}
              </Card.Content>
            </Card>
          )}

          {isEmpty ? (
            <EmptyState
              icon="account-group-outline"
              title="No visitors"
              description={isResident ? 'Pre-approve a visitor using the button below.' : 'No visitor passes yet.'}
            />
          ) : (
            <FlatList
              key={numColumns}
              data={visitors}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              numColumns={numColumns}
              columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={numColumns > 1 ? styles.gridItem : undefined}>
                  <Card style={styles.card}>
                    <Card.Content>
                      <View style={styles.headerRow}>
                        <Text variant="titleMedium" style={styles.title}>
                          {item.name}
                        </Text>
                        <StatusChip label={getVisitorStatusLabel(item.status)} tone={getVisitorStatusTone(item.status)} />
                      </View>

                      <Text variant="bodySmall" style={styles.meta}>
                        {item.purpose} · {formatDate(item.visitDate)}
                      </Text>

                      {!isResident && (
                        <Text variant="bodySmall" style={styles.meta}>
                          {item.residentName} · {item.flatNumber}
                        </Text>
                      )}

                      <Text variant="bodySmall" style={styles.meta}>
                        {item.phone}
                      </Text>

                      {isResident && (
                        <View style={styles.passCodeRow}>
                          <Text variant="labelMedium" style={styles.passCodeLabel}>
                            Pass code
                          </Text>
                          <Text variant="titleLarge" style={styles.passCode}>
                            {item.passCode}
                          </Text>
                        </View>
                      )}

                      {item.checkInTime && (
                        <Text variant="bodySmall" style={styles.meta}>
                          Checked in: {formatDateTime(item.checkInTime)}
                        </Text>
                      )}
                      {item.checkOutTime && (
                        <Text variant="bodySmall" style={styles.meta}>
                          Checked out: {formatDateTime(item.checkOutTime)}
                        </Text>
                      )}

                      {isSecurity && item.status === VisitorStatus.PENDING && (
                        <AppButton onPress={() => handleCheckIn(item)} style={styles.actionButton}>
                          Check in
                        </AppButton>
                      )}
                      {isSecurity && item.status === VisitorStatus.CHECKED_IN && (
                        <AppButton onPress={() => handleCheckOut(item)} style={styles.actionButton}>
                          Check out
                        </AppButton>
                      )}
                    </Card.Content>
                  </Card>
                </View>
              )}
            />
          )}
        </View>
      </ScreenContainer>

      {isResident && <FAB icon="plus" style={styles.fab} onPress={openForm} label="Pre-approve visitor" />}

      <Portal>
        <Modal
          visible={formVisible}
          onDismiss={() => setFormVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.elevation.level2 }]}>
          {newPassCode ? (
            <View style={styles.successBlock}>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Visitor pre-approved
              </Text>
              <Text variant="bodyMedium" style={styles.successMessage}>
                Share this pass code with your visitor:
              </Text>
              <Text variant="displaySmall" style={styles.successPassCode}>
                {newPassCode}
              </Text>
              <AppButton onPress={() => setFormVisible(false)} style={styles.submitButton}>
                Done
              </AppButton>
            </View>
          ) : (
            <>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Pre-approve a visitor
              </Text>

              <AppTextField
                label="Visitor name"
                value={form.name}
                onChangeText={(value) => updateField('name', value)}
                errorText={formErrors.name}
              />
              <AppTextField
                label="Phone number"
                value={form.phone}
                onChangeText={(value) => updateField('phone', value)}
                keyboardType="phone-pad"
                errorText={formErrors.phone}
              />
              <AppTextField
                label="Purpose of visit"
                value={form.purpose}
                onChangeText={(value) => updateField('purpose', value)}
                errorText={formErrors.purpose}
              />
              <AppTextField
                label="Visit date (YYYY-MM-DD)"
                value={form.visitDate}
                onChangeText={(value) => updateField('visitDate', value)}
                errorText={formErrors.visitDate}
              />

              {!!actionError && (
                <Text variant="bodySmall" style={[styles.actionError, { color: theme.colors.error }]}>
                  {actionError}
                </Text>
              )}

              <AppButton onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting} style={styles.submitButton}>
                Generate pass code
              </AppButton>
            </>
          )}
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  listArea: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  columnWrapper: {
    gap: Spacing.two,
  },
  gridItem: {
    flex: 1,
  },
  verifyCard: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  verifyTitle: {
    marginBottom: Spacing.two,
  },
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  verifyInput: {
    flex: 1,
  },
  verifyError: {
    marginTop: Spacing.one,
  },
  verifiedCard: {
    marginTop: Spacing.two,
  },
  card: {
    marginBottom: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  title: {
    flex: 1,
  },
  meta: {
    opacity: 0.7,
    marginBottom: Spacing.half,
  },
  passCodeRow: {
    alignItems: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  passCodeLabel: {
    opacity: 0.6,
  },
  passCode: {
    letterSpacing: 4,
    fontWeight: '700',
  },
  actionButton: {
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
  actionError: {
    marginBottom: Spacing.two,
  },
  submitButton: {
    marginTop: Spacing.two,
  },
  successBlock: {
    alignItems: 'center',
  },
  successMessage: {
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  successPassCode: {
    letterSpacing: 8,
    fontWeight: '700',
    marginBottom: Spacing.four,
  },
});
