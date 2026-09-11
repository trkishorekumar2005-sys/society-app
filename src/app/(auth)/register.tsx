import { useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { HelperText, Text } from 'react-native-paper';

import { AppButton, AppTextField, ScreenContainer } from '@/components';
import { Spacing } from '@/core/theme';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
} from '@/core/utils/validation';
import { useAuthActions, useAuthError, useAuthStatus } from '@/domain/store/authStore';

interface FormState {
  name: string;
  email: string;
  phone: string;
  flatNumber: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  flatNumber: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterScreen() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const { register, clearError } = useAuthActions();
  const status = useAuthStatus();
  const serverError = useAuthError();
  const isSubmitting = status === 'loading';

  function updateField<K extends keyof FormState>(field: K, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit() {
    const nextErrors: FormErrors = {
      name: validateRequired(form.name, 'Name'),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      flatNumber: validateRequired(form.flatNumber, 'Flat number'),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    clearError();
    register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      flatNumber: form.flatNumber.trim(),
      password: form.password,
    });
  }

  return (
    <ScreenContainer>
      <Text variant="headlineMedium" style={styles.title}>
        Create your account
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Register as a resident to raise complaints and manage visitors
      </Text>

      <AppTextField label="Full name" value={form.name} onChangeText={(value) => updateField('name', value)} errorText={errors.name} />
      <AppTextField
        label="Email"
        value={form.email}
        onChangeText={(value) => updateField('email', value)}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        errorText={errors.email}
      />
      <AppTextField
        label="Phone number"
        value={form.phone}
        onChangeText={(value) => updateField('phone', value)}
        keyboardType="phone-pad"
        errorText={errors.phone}
      />
      <AppTextField
        label="Flat number"
        value={form.flatNumber}
        onChangeText={(value) => updateField('flatNumber', value)}
        placeholder="e.g. A-204"
        errorText={errors.flatNumber}
      />
      <AppTextField
        label="Password"
        value={form.password}
        onChangeText={(value) => updateField('password', value)}
        secureTextEntry
        errorText={errors.password}
      />
      <AppTextField
        label="Confirm password"
        value={form.confirmPassword}
        onChangeText={(value) => updateField('confirmPassword', value)}
        secureTextEntry
        errorText={errors.confirmPassword}
      />

      <HelperText type="error" visible={!!serverError} style={styles.serverError}>
        {serverError}
      </HelperText>

      <AppButton onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
        Create account
      </AppButton>

      <View style={styles.loginLinkWrapper}>
        <Link href="/login">
          <Text variant="bodyMedium">Already have an account? Log in</Text>
        </Link>
      </View>
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
  serverError: {
    marginBottom: Spacing.one,
  },
  loginLinkWrapper: {
    alignItems: 'center',
    marginTop: Spacing.three,
    marginBottom: Spacing.five,
  },
});
