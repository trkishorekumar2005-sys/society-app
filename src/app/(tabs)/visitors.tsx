import { EmptyState, ScreenContainer } from '@/components';
import { Role } from '@/core/constants';
import { useAuthUser } from '@/domain/store/authStore';

const DESCRIPTION_BY_ROLE: Record<string, string> = {
  [Role.RESIDENT]: 'Pre-approve a visitor and get a pass code to share with them here.',
  [Role.SECURITY]: 'Verify a visitor pass code and log check-in/check-out here.',
  [Role.ADMIN]: 'View the visitor log for the whole society here.',
};

export default function VisitorsScreen() {
  const user = useAuthUser();
  const description = user ? DESCRIPTION_BY_ROLE[user.role] : undefined;

  return (
    <ScreenContainer>
      <EmptyState icon="account-group-outline" title="Visitor management coming soon" description={description} />
    </ScreenContainer>
  );
}
