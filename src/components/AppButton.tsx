import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

type PaperButtonProps = ComponentProps<typeof PaperButton>;
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

export interface AppButtonProps extends Omit<PaperButtonProps, 'mode'> {
  variant?: ButtonVariant;
}

const VARIANT_TO_MODE: Record<ButtonVariant, PaperButtonProps['mode']> = {
  primary: 'contained',
  secondary: 'contained-tonal',
  outline: 'outlined',
  text: 'text',
};

/** Standard app button with consistent sizing/radius across the app, built on Paper's Button. */
export function AppButton({ variant = 'primary', style, contentStyle, ...rest }: AppButtonProps) {
  return (
    <PaperButton
      mode={VARIANT_TO_MODE[variant]}
      style={[styles.button, style]}
      contentStyle={[styles.content, contentStyle]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  content: {
    paddingVertical: 4,
  },
});
