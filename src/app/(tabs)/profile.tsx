import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { AppButton, AppTextField, Card, ScreenContainer } from '@/components';
import { Spacing } from '@/core/theme';
import { validatePhone, validateRequired } from '@/core/utils/validation';
import { useAuthActions, useAuthError, useAuthStatus, useAuthUser } from '@/domain/store/authStore';

interface FormState {
  name: string;
  phone: string;
  flatNumber: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  flatNumber?: string;
}

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthUser();
  const { logout, updateProfile, clearError } = useAuthActions();
  const status = useAuthStatus();
  const error = useAuthError();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    flatNumber: user?.flatNumber ?? '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const isSaving = status === 'loading';

  if (!user) {
    return null;
  }

  function startEditing() {
    setForm({ name: user!.name, phone: user!.phone, flatNumber: user!.flatNumber });
    setFormErrors({});
    clearError();
    setIsEditing(true);
  }

  function updateField<K extends keyof FormState>(field: K, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSave() {
    const nextErrors: FormErrors = {
      name: validateRequired(form.name, 'Name'),
      phone: validatePhone(form.phone),
      flatNumber: validateRequired(form.flatNumber, 'Flat number'),
    };
    setFormErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const ok = await updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      flatNumber: form.flatNumber.trim(),
    });
    if (ok) {
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <ScreenContainer>
        <Card>
          <Card.Content>
            <AppTextField
              label="Name"
              value={form.name}
              onChangeText={(value) => updateField('name', value)}
              errorText={formErrors.name}
            />
            <AppTextField
              label="Phone"
              value={form.phone}
              onChangeText={(value) => updateField('phone', value)}
              keyboardType="phone-pad"
              errorText={formErrors.phone}
            />
            <AppTextField
              label="Flat number"
              value={form.flatNumber}
              onChangeText={(value) => updateField('flatNumber', value)}
              errorText={formErrors.flatNumber}
            />

            {!!error && (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}

            <View style={styles.editActions}>
              <AppButton variant="outline" onPress={() => setIsEditing(false)} style={styles.editButton}>
                Cancel
              </AppButton>
              <AppButton onPress={handleSave} loading={isSaving} disabled={isSaving} style={styles.editButton}>
                Save
              </AppButton>
            </View>
          </Card.Content>
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Card>
        <Card.Content style={styles.fieldList}>
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.fieldLabel}>
              Name
            </Text>
            <Text variant="bodyLarge">{user.name}</Text>
          </View>
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.fieldLabel}>
              Email
            </Text>
            <Text variant="bodyLarge">{user.email}</Text>
          </View>
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.fieldLabel}>
              Phone
            </Text>
            <Text variant="bodyLarge">{user.phone}</Text>
          </View>
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.fieldLabel}>
              Flat number
            </Text>
            <Text variant="bodyLarge">{user.flatNumber}</Text>
          </View>
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.fieldLabel}>
              Role
            </Text>
            <Text variant="bodyLarge">{user.role}</Text>
          </View>
        </Card.Content>
      </Card>

      <AppButton variant="outline" onPress={startEditing} style={styles.editProfileButton}>
        Edit profile
      </AppButton>
      <AppButton variant="text" onPress={logout} style={styles.logoutButton}>
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
  editProfileButton: {
    marginTop: Spacing.four,
  },
  logoutButton: {
    marginTop: Spacing.two,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  editButton: {
    flex: 1,
  },
  errorText: {
    marginBottom: Spacing.two,
  },
});
