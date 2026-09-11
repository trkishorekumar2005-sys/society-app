import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

type PaperTextInputProps = ComponentProps<typeof TextInput>;

export interface AppTextFieldProps extends Omit<PaperTextInputProps, 'error'> {
  /** Inline validation error message; also drives the field's error styling when present. */
  errorText?: string;
}

/** Standard text field with inline validation messaging, built on Paper's outlined TextInput. */
export function AppTextField({ errorText, style, ...rest }: AppTextFieldProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput mode="outlined" style={[styles.input, style]} error={!!errorText} {...rest} />
      <HelperText type="error" visible={!!errorText}>
        {errorText}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  input: {
    backgroundColor: 'transparent',
  },
});
