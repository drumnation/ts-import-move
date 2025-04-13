import { isValidEmail, isValidPassword } from '../utils/validator';

interface FormData {
  email: string;
  password: string;
}

export function validateForm(formData: FormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isValidEmail(formData.email)) {
    errors.push('Please enter a valid email');
  }
  
  if (!isValidPassword(formData.password)) {
    errors.push('Password must be at least 8 characters and include uppercase, lowercase, and numbers');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
} 