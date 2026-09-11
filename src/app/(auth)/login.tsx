import { useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { HelperText, Text } from 'react-native-paper';

import { AppButton, AppTextField, Card, ScreenContainer } from '@/components';
import { DEMO_ACCOUNTS } from '@/core/constants';
import { Spacing } from '@/core/theme';
import { validateEmail, validatePassword } from '@/core/utils/validation';
import { useAuthActions, useAuthError, useAuthStatus } from '@/domain/store/authStore';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const { login, clearError } = useAuthActions();
  const status = useAuthStatus();
  const serverError = useAuthError();
  const isSubmitting = status === 'loading';

  function handleSubmit() {
    const nextErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      return;
    }
    login({ email: email.trim(), password });
  }

  function fillDemoAccount(demoEmail: string, demoPassword: string) {
    clearError();
    setErrors({});
    setEmail(demoEmail);
    setPassword(demoPassword);
  }

  return (
    <ScreenContainer>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome back
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Sign in to manage your society
      </Text>

      <AppTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        errorText={errors.email}
      />
      <AppTextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        errorText={errors.password}
      />

      <HelperText type="error" visible={!!serverError} style={styles.serverError}>
        {serverError}
      </HelperText>

      <AppButton onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
        Log in
      </AppButton>

      <View style={styles.registerLinkWrapper}>
        <Link href="/register">
          <Text variant="bodyMedium">New resident? Create an account</Text>
        </Link>
      </View>

      <Card style={styles.demoCard}>
        <Card.Title title="Demo accounts" subtitle="Tap one to autofill" />
        <Card.Content style={styles.demoList}>
          {DEMO_ACCOUNTS.map((account) => (
            <AppButton
              key={account.email}
              variant="outline"
              onPress={() => fillDemoAccount(account.email, account.password)}>
              {account.label} · {account.email}
            </AppButton>
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
  serverError: {
    marginBottom: Spacing.one,
  },
  registerLinkWrapper: {
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  demoCard: {
    marginTop: Spacing.five,
  },
  demoList: {
    gap: Spacing.two,
  },
});
