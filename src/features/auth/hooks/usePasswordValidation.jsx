import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

export const usePasswordValidation = (password) => {
  const { t } = useTranslation();

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
        return t('auth.password_strength_labels.very_weak');
      case 2:
        return t('auth.password_strength_labels.weak');
      case 3:
        return t('auth.password_strength_labels.regular');
      case 4:
        return t('auth.password_strength_labels.strong');
      case 5:
        return t('auth.password_strength_labels.excellent');
      default:
        return '';
    }
  }, [strengthScore, t]); 

  return { validations, allRequirementsMet, strengthScore, strengthLabel };
};