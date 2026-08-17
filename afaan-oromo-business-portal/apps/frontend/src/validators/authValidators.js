// Validation helpers for authentication forms

export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Please enter a valid email address.';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
};

export const validateFullName = (name) => {
  if (!name || !name.trim()) return 'Full name is required.';
  if (name.trim().length < 3) return 'Full name must be at least 3 characters.';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Phone number is required.';
  const re = /^(\+251|0)(9|7)\d{8}$/;
  if (!re.test(phone.trim())) return 'Enter a valid Ethiopian phone number (e.g. +251912345678 or 0912345678).';
  return null;
};

export const validateNationalId = (id) => {
  if (!id || !id.trim()) return 'National ID Reference is required.';
  if (id.trim().length < 6) return 'National ID Reference must be at least 6 characters.';
  return null;
};
