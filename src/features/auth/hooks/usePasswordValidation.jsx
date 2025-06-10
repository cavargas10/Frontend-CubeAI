import { useMemo } from 'react';

// Expresiones regulares para la validación
const REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

export const usePasswordValidation = (password) => {
  const validations = useMemo(() => ({
    length: password.length >= 6,
    uppercase: REGEX.uppercase.test(password),
    lowercase: REGEX.lowercase.test(password),
    number: REGEX.number.test(password),
    special: REGEX.special.test(password),
  }), [password]);

  const allRequirementsMet = Object.values(validations).every(Boolean);

  const strengthScore = Object.values(validations).filter(Boolean).length;
  
  const strengthLabel = useMemo(() => {
    switch (strengthScore) {
      case 0:
      case 1:
        return 'Muy débil';
      case 2:
        return 'Débil';
      case 3:
        return 'Regular';
      case 4:
        return 'Fuerte';
      case 5:
        return 'Excelente';
      default:
        return '';
    }
  }, [strengthScore]);

  return { validations, allRequirementsMet, strengthScore, strengthLabel };
};