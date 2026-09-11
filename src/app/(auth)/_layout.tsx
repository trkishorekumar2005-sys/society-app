import { Redirect, Stack } from 'expo-router';

import { LoadingState } from '@/components';
import { useAuthHasHydrated, useAuthUser } from '@/domain/store/authStore';

export default function AuthLayout() {
  const hasHydrated = useAuthHasHydrated();
  const user = useAuthUser();

  if (!hasHydrated) {
    return <LoadingState message="Loading…" />;
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
