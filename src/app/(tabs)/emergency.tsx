import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { AppButton, Card, ScreenContainer } from '@/components';
import { EMERGENCY_CONTACTS } from '@/core/constants';
import { Spacing } from '@/core/theme';

export default function EmergencyScreen() {
  async function callNumber(phone: string) {
    try {
      await Linking.openURL(`tel:${phone}`);
    } catch (error) {
      console.error('Failed to open dialer:', error);
    }
  }

  const groupedByCategory: Record<string, typeof EMERGENCY_CONTACTS> = {};
  for (const contact of EMERGENCY_CONTACTS) {
    if (!groupedByCategory[contact.category]) {
      groupedByCategory[contact.category] = [];
    }
    groupedByCategory[contact.category].push(contact);
  }

  return (
    <ScreenContainer>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedByCategory).map(([category, contacts]) => (
          <View key={category} style={styles.section}>
            <Text variant="labelLarge" style={styles.categoryHeader}>
              {category}
            </Text>
            <View style={styles.contactsList}>
              {contacts.map((contact) => (
                <Card key={contact.id} style={styles.contactCard}>
                  <Card.Content>
                    <View style={styles.contactHeader}>
                      <Icon source="phone" size={20} />
                      <Text variant="titleSmall" style={styles.contactName}>
                        {contact.name}
                      </Text>
                    </View>
                    <Text variant="bodyMedium" style={styles.phone}>
                      {contact.phone}
                    </Text>
                    <AppButton
                      onPress={() => callNumber(contact.phone)}
                      style={styles.callButton}
                      icon="phone">
                      Call
                    </AppButton>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: Spacing.three,
  },
  section: {
    marginBottom: Spacing.four,
  },
  categoryHeader: {
    marginBottom: Spacing.two,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactsList: {
    gap: Spacing.two,
  },
  contactCard: {
    marginBottom: 0,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  contactName: {
    flex: 1,
  },
  phone: {
    fontFamily: 'monospace',
    marginBottom: Spacing.two,
    opacity: 0.8,
  },
  callButton: {
    marginTop: Spacing.one,
  },
});
