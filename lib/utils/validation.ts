/**
 * Validates an email address format
 * @param email Email address to validate
 * @returns Error message or empty string if valid
 */
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email is required";
  } else if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

/**
 * Validates a password
 * @param password Password to validate
 * @param requireMinLength Whether to require minimum length (for registration)
 * @returns Error message or empty string if valid
 */
export const validatePassword = (password: string, requireMinLength = false): string => {
  if (!password) {
    return "Password is required";
  } else if (requireMinLength && password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return "";
};

/**
 * Validates a name is not empty
 * @param name Name to validate
 * @returns Error message or empty string if valid
 */
export const validateName = (name: string): string => {
  if (!name.trim()) {
    return "Name is required";
  }
  return "";
};

/**
 * Validates that password and confirmation match
 * @param password Original password
 * @param confirmPassword Password confirmation
 * @returns Error message or empty string if valid
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
};

/**
 * Calculate password strength score (0-5)
 * @param password Password to evaluate
 * @returns Score from 0 to 5
 */
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
};

/**
 * Get text representation of password strength
 * @param strength Password strength score (0-5)
 * @returns Text description of strength
 */
export const getStrengthText = (strength: number): string => {
  switch (strength) {
    case 0: return "";
    case 1: return "Weak";
    case 2: return "Fair";
    case 3: return "Good";
    case 4: return "Strong";
    case 5: return "Very Strong";
    default: return "";
  }
};

/**
 * Get CSS class for password strength indicator
 * @param strength Password strength score (0-5)
 * @returns CSS class name for the strength indicator
 */
export const getStrengthColor = (strength: number): string => {
  switch (strength) {
    case 0: return "bg-gray-300";
    case 1: return "bg-red-500";
    case 2: return "bg-orange-500";
    case 3: return "bg-yellow-500";
    case 4: return "bg-green-500";
    case 5: return "bg-green-600";
    default: return "bg-gray-300";
  }
};
