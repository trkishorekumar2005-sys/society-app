import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

export type StatusTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger';

export interface StatusChipProps {
  label: string;
  tone?: StatusTone;
}

const TONE_COLORS: Record<StatusTone, { background: string; text: string }> = {
  neutral: { background: '#E2E3E7', text: '#3B3F45' },
  info: { background: '#DCEAFB', text: '#1A5AA8' },
  warning: { background: '#FDEBD0', text: '#9C5B00' },
  success: { background: '#DDF3E4', text: '#1E7A3D' },
  danger: { background: '#FBDEDE', text: '#B3261E' },
};

/** A small color-coded label used to show status (complaint status, visitor status, etc.). */
export function StatusChip({ label, tone = 'neutral' }: StatusChipProps) {
  const colors = TONE_COLORS[tone];
  return (
    <Chip
      compact
      style={[styles.chip, { backgroundColor: colors.background }]}
      textStyle={[styles.text, { color: colors.text }]}>
      {label}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
