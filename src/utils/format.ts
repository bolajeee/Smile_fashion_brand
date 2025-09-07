/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 */
export const formatCurrency = (
  value: string | number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

/**
 * Format a number with commas
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 */
export const formatNumber = (
  value: string | number,
  locale = 'en-US'
): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat(locale).format(numberValue);
};

/**
 * Format a date
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 */
export const formatDate = (
  date: Date | string,
  locale = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format a date relative to now (e.g., "2 days ago")
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 */
export const formatRelativeTime = (
  date: Date | string,
  locale = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return rtf.format(-diffInYears, 'year');
};
