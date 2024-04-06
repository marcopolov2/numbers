import { User } from './models/models';

/**
 * Validation
 */
export const isPhoneNumberValid = (phoneNumber: string): boolean =>
  !!(phoneNumber && phoneNumber.length >= 7 && /^\d+$/.test(phoneNumber));
export const isNameValid = (value: string): boolean => !!value;
export const isUserValid = (user: User, newUser?: boolean): boolean =>
  (newUser ? true : user.id > 0) &&
  isNameValid(user.name) &&
  isNameValid(user.surname) &&
  isPhoneNumberValid(user.phoneNumber);
