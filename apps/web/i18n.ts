import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['fr', 'en'] as const;
export const defaultLocale = 'fr';

export default getRequestConfig(async () => {
  let locale = defaultLocale;
  
  try {
    const cookieStore = cookies();
    locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
  } catch {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
