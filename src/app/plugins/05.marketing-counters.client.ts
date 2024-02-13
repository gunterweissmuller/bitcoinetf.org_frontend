import {defineNuxtPlugin, useRouter, useRuntimeConfig} from '#app'

/** Установка счетчика Яндекс Метрики */

/* eslint-disable */
function initGtm() {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start':
        new Date().getTime(), event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src =
      'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-5VFHBBD7');
}

/* eslint-enable */

export default defineNuxtPlugin(() => {
  const router = useRouter()

  if (!process.dev) {
    router
      .isReady()
      .then(initGtm)
  }
})
