export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

export const validateUsername = (username: string): { valid: boolean; message?: string } => {
  if (username.length < 2) {
    return { valid: false, message: 'Username must be at least 2 characters long' };
  }
  if (username.length > 30) {
    return { valid: false, message: 'Username must be less than 30 characters' };
  }
  return { valid: true };
};