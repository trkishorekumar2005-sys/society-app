import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { LoadingState } from '@/components';
import { Role } from '@/core/constants';
import { useAuthHasHydrated, useAuthUser } from '@/domain/store/authStore';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function makeTabBarIcon(name: IconName, focusedName: IconName) {
  function TabBarIcon({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
    return <MaterialCommunityIcons name={focused ? focusedName : name} color={color} size={size} />;
  }
  return TabBarIcon;
}

export default function TabsLayout() {
  const hasHydrated = useAuthHasHydrated();
  const user = useAuthUser();

  if (!hasHydrated) {
    return <LoadingState message="Loading…" />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  const isSecurity = user.role === Role.SECURITY;

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Announcements',
          tabBarIcon: makeTabBarIcon('bullhorn-outline', 'bullhorn'),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Complaints',
          href: isSecurity ? null : undefined,
          tabBarIcon: makeTabBarIcon('clipboard-text-outline', 'clipboard-text'),
        }}
      />
      <Tabs.Screen
        name="visitors"
        options={{
          title: 'Visitors',
          tabBarIcon: makeTabBarIcon('account-group-outline', 'account-group'),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarIcon: makeTabBarIcon('phone-alert-outline', 'phone-alert'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: makeTabBarIcon('account-circle-outline', 'account-circle'),
        }}
      />
    </Tabs>
  );
}
