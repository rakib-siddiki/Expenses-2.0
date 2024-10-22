import { Poppins } from 'next/font/google';

export const SITE_TITLE_DEFAULT = 'Smart Expenses Tracker';
export const SITE_TITLE_TEMPLATE_DEFAULT = `%s - Expenses Tracker`;
export const SITE_DESCRIPTION_DEFAULT = ' The smartest way to manage your expenses.';

export const SITE_VERIFICATION_GOOGLE_DEFAULT = 'google-site-verification=adwdawdaw';

export const FONT_DEFAULT = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-Poppins-sarif',
    display: 'swap',
    preload: true,
    adjustFontFallback: true,
});
