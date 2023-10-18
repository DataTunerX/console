import { loadLocaleMessages } from '@/plugins';

const locales = require.context('./', true, /[A-Za-z0-9-_,\s]+\.json$/i);

export default loadLocaleMessages(locales);
