/** Shared form-field validators returning an error message, or undefined when valid. */

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

export function validateRequired(value: string, fieldLabel: string): string | undefined {
  return value.trim() ? undefined : `${fieldLabel} is required.`;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email is required.';
  if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address.';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required.';
  if (value.length < 6) return 'Password must be at least 6 characters.';
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return 'Phone number is required.';
  if (!PHONE_PATTERN.test(value.trim())) return 'Enter a valid phone number.';
  return undefined;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return undefined;
}
