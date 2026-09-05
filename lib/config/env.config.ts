/**
 * Centralized Application & Technical Environment Configuration
 * Strictly handles technical deployment & environment variables.
 * 
 * Note: Dynamic business & contact data (phone numbers, email addresses, 
 * street locations, opening hours, social links) are dynamically fetched 
 * from the backend API (`/api/v1/public/settings`) via SettingsService.
 */

export const envConfig = {
  /**
   * Primary public site URL (used for canonical tags, sitemap, JSON-LD schemas, OG metadata)
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://motimahallodge.com',

  /**
   * Single unified API base URL for Express backend
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500',

  /**
   * Production environment flag
   */
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export const SITE_URL = envConfig.siteUrl;
export const API_URL = envConfig.apiUrl;

export const SITE_BRAND = {
  name: 'Motimahal Lodge & Restaurant',
  shortName: 'Motimahal Lodge',
} as const;
