/**
 * Region → language detection for the Quiky mascot.
 * Reuses the existing ipCheckService (backend → ipapi.co fallback) so we
 * don't introduce a new third-party API or extend the CSP `connect-src`.
 *
 * Returns one of the 13 language codes registered in LanguageContext, or
 * `null` when nothing reliable can be inferred.
 */

import ipCheckService from '@/lib/services/ipCheck.service';

// Indian state name → language code. Keys are lowercased and trimmed; both
// historical and current spellings are listed where they vary across data
// providers (e.g. "Orissa" vs "Odisha").
const STATE_TO_LANG: Record<string, string> = {
  // Distinct regional languages
  maharashtra: 'mr',
  gujarat: 'gu',
  'tamil nadu': 'ta',
  tamilnadu: 'ta',
  karnataka: 'kn',
  'andhra pradesh': 'te',
  telangana: 'te',
  kerala: 'ml',
  'west bengal': 'bn',
  odisha: 'or',
  orissa: 'or',
  punjab: 'pa',
  assam: 'as',

  // Hindi belt → Hindi
  'uttar pradesh': 'hi',
  bihar: 'hi',
  'madhya pradesh': 'hi',
  rajasthan: 'hi',
  haryana: 'hi',
  delhi: 'hi',
  'national capital territory of delhi': 'hi',
  uttarakhand: 'hi',
  jharkhand: 'hi',
  chhattisgarh: 'hi',
  'himachal pradesh': 'hi',
  chandigarh: 'hi',

  // Areas where Urdu is widely used
  'jammu and kashmir': 'ur',
  'jammu & kashmir': 'ur',
  ladakh: 'ur',
};

// Country fallback when state isn't recognised.
const COUNTRY_TO_LANG: Record<string, string> = {
  IN: 'hi', // generic India fallback
  PK: 'ur',
  BD: 'bn',
  LK: 'ta',
  NP: 'hi',
};

const SUPPORTED = new Set([
  'en', 'hi', 'mr', 'gu', 'pa', 'bn', 'ta', 'te', 'kn', 'ml', 'or', 'as', 'ur',
]);

const norm = (value: string | null | undefined) =>
  (value || '').toLowerCase().trim();

export async function detectLanguageByRegion(): Promise<string | null> {
  try {
    const result = await ipCheckService.checkIP();
    const data = result?.data;
    if (!data) return null;

    const state = norm(data.state);
    if (state && STATE_TO_LANG[state] && SUPPORTED.has(STATE_TO_LANG[state])) {
      return STATE_TO_LANG[state];
    }

    const country = (data.country || '').toUpperCase().trim();
    if (country && COUNTRY_TO_LANG[country] && SUPPORTED.has(COUNTRY_TO_LANG[country])) {
      return COUNTRY_TO_LANG[country];
    }

    return null;
  } catch {
    return null;
  }
}
