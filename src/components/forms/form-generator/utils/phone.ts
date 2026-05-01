import { isValidPhoneNumber, formatPhoneNumber, formatPhoneNumberIntl } from "react-phone-number-input"

export const phoneUtils = {
  isValid: (phoneNumber: string) => isValidPhoneNumber(phoneNumber),
  formatLocal: (phoneNumber: string) => formatPhoneNumber(phoneNumber),
  formatInternational: (phoneNumber: string) => formatPhoneNumberIntl(phoneNumber),
}
