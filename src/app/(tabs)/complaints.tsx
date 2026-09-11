import { EmptyState, ScreenContainer } from '@/components';
import { Role } from '@/core/constants';
import { useAuthUser } from '@/domain/store/authStore';

export default function ComplaintsScreen() {
  const user = useAuthUser();
  const isAdmin = user?.role === Role.ADMIN;

  return (
    <ScreenContainer>
      <EmptyState
        icon="clipboard-text-outline"
        title="Complaints coming soon"
        description={
          isAdmin
            ? 'Review resident complaints and update their status here.'
            : 'Raise a complaint and track its status here.'
        }
      />
    </ScreenContainer>
  );
}
