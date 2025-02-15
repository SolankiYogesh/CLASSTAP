import I18n from 'i18n-js';

import ar from '../translations/ar.json';
import en from '../translations/en.json';
import sp from '../translations/sp.json';
I18n.fallbacks = true;
I18n.translations = {
  ar,
  en,
  sp,
};

export default I18n;
