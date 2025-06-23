"use client";

import { useParams } from 'next/navigation';
import { localizeNumber } from '@/lib/utils/localize-number';

interface LocalizedNumberProps {
  value: number | string;
  className?: string;
}

/**
 * Component to display a number in the user's current locale formatting
 * Will convert digits to Nepali numerals when in Nepali locale
 */
export function LocalizedNumber({ value, className }: LocalizedNumberProps) {
  const params = useParams();
  const locale = params.locale as string || 'en';
  
  return (
    <span className={className}>
      {localizeNumber(value, locale)}
    </span>
  );
}
