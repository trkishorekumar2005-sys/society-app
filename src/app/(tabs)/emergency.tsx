import { EmptyState, ScreenContainer } from '@/components';

export default function EmergencyScreen() {
  return (
    <ScreenContainer>
      <EmptyState
        icon="phone-alert-outline"
        title="Emergency contacts coming soon"
        description="A tap-to-call list of police, fire, ambulance, and society contacts will show up here."
      />
    </ScreenContainer>
  );
}
