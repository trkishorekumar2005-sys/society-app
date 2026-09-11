import { useWindowDimensions } from 'react-native';

import { WideLayoutBreakpoint } from '@/core/theme';

/** Returns 2 on wide viewports (tablet/web) for a two-column card grid, 1 otherwise. */
export function useResponsiveColumns(): 1 | 2 {
  const { width } = useWindowDimensions();
  return width >= WideLayoutBreakpoint ? 2 : 1;
}
