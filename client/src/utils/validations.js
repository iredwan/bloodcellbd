/**
 * Validation utility functions for common form fields
 */

/**
 * Validates a Bangladeshi phone number
 * Valid format: 01XXXXXXXXX (11 digits starting with 01)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  // Remove any +880 prefix if present
  const normalizedPhone = phone.replace(/^\+880/, '');
  
  // Bangladeshi mobile numbers: 11 digits starting with '01' followed by 3-9 for the operator code
  return /^01[3-9]\d{8}$/.test(normalizedPhone);
};

/**
 * Formats a phone number with Bangladesh country code
 * @param {string} phone - Phone number to format (with or without country code)
 * @returns {string} Formatted phone number with +880 prefix
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove any existing +880 prefix
  const normalizedPhone = phone.replace(/^\+880/, '');
  
  // Add the +880 prefix back
  return `+880${normalizedPhone}`;
};

/**
 * Parses a phone number input to store without country code
 * @param {string} phone - Phone input (possibly with +880 prefix)
 * @returns {string} Phone number without country code
 */
export const parsePhoneInput = (phone) => {
  return phone.replace(/^\+880/, '');
};

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Basic email validation regex
  // This covers most common email formats
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates a Bangladeshi National ID number
 * Valid formats: 10, 13, or 17 digits
 * @param {string} id - ID number to validate
 * @returns {boolean} True if valid
 */
export const isValidID = (id) => {
  if (!id) return false;
  
  // NID can be 10, 13, or 17 digits
  return /^(\d{10}|\d{13}|\d{17})$/.test(id);
};

/**
 * Get validation error message for phone number
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const getPhoneError = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!isValidPhone(phone)) return 'Please enter a valid Bangladeshi phone number (e.g., 01XXXXXXXXX)';
  return null;
};

/**
 * Get validation error message for email
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const getEmailError = (email) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
};

/**
 * Get validation error message for ID number
 * @param {string} id - ID number to validate
 * @returns {string|null} Error message or null if valid
 */
export const getIDError = (id) => {
  if (!id) return 'ID number is required';
  if (!isValidID(id)) return 'ID number must be 10, 13, or 17 digits';
  return null;
};
