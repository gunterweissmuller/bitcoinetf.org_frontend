import { useRuntimeConfig } from 'nuxt/app';
import { loadMoonPay } from '@moonpay/moonpay-js';

export function useMoonpay() {
    const { public: { MOONPAY_API_KEY } } = useRuntimeConfig()
    let moonPaySdk = null

    const init = async (url: string) => {
      const moonPay = await loadMoonPay();
      moonPaySdk = moonPay({
        flow: 'buy',
        environment: 'sandbox',
        variant: 'overlay',
        params: {
          apiKey: MOONPAY_API_KEY,
          url,
        },
        debug: true
      });

      console.log('moonpay', moonPaySdk)
    }

    const show = () => {
      moonPaySdk.show();
    }

    return {
      init,
      show,
    };
}
