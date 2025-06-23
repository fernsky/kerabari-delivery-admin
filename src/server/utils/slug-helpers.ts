/**
 * Utility functions for slug generation, including transliteration from Devnagari to Latin
 */

// Mapping table for Nepali Devnagari characters to Roman/Latin equivalents
const devnagariToRomanMap: Record<string, string> = {
  // Vowels
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  
  // Consonants
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'wa', 'श': 'sha',
  'ष': 'sha', 'स': 'sa', 'ह': 'ha',
  
  // Vowel signs
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ं': '', 'ँ': '',
  
  // Numbers
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  
  // Punctuation and special characters
  '।': '', '॥': '', '्': '',
};

/**
 * Transliterates Nepali Devnagari text to romanized form
 * @param text Nepali text in Devnagari script
 * @returns Romanized version of the text
 */
export const romanizeDevnagari = (text: string): string => {
  // If text is empty or undefined, return empty string
  if (!text) return '';
  
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (devnagariToRomanMap[char]) {
      result += devnagariToRomanMap[char];
    } else {
      // Keep non-Devnagari characters as-is
      result += char;
    }
  }
  
  return result;
};

/**
 * Generates a slug from a string by:
 * 1. Converting Devnagari to Roman if present
 * 2. Lowercasing all characters
 * 3. Replacing special characters and spaces with hyphens
 * 4. Removing duplicate hyphens and leading/trailing hyphens
 * @param name The input string (can be in any script)
 * @returns A URL-friendly slug
 */
export const generateSlug = (name: string): string => {
  if (!name) return '';
  
  // First check if text contains Devnagari script
  const hasDevnagari = /[\u0900-\u097F]/.test(name);
  
  // Convert to roman if it contains Devnagari
  const processed = hasDevnagari ? romanizeDevnagari(name) : name;
  
  return processed
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};
