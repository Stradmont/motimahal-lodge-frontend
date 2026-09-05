/**
 * Validates a Nepali phone number (Mobile starting with 98 or 97, or Landline).
 * Accepts optional +977 / 977 / 0 prefix as well as spaces and dashes.
 * 
 * Examples of valid Nepali numbers:
 * - Mobile: 9855012345 (98 prefix), 9741234567 (97 prefix), +977 98550 12345, +977 97412 34567, 09855012345
 * - Landline: 056-590123 (Chitwan), 01-4123456 (KTM)
 */
export function isValidNepaliPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const nepaliPhoneRegex = /^(?:\+?977|0)?(?:9[78]\d{8}|[1-8]\d{6,7})$/;
  return nepaliPhoneRegex.test(cleaned);
}
