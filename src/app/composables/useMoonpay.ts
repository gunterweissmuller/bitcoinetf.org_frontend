import { useRuntimeConfig } from 'nuxt/app';
import { loadMoonPay } from '@moonpay/moonpay-js';

export const useMoonpay = async () => {
  const { public: { MOONPAY_API_KEY } } = useRuntimeConfig()
  const moonPay = await loadMoonPay();

  const moonPaySdk = moonPay({
    flow: 'buy',
    environment: 'sandbox',
    variant: 'overlay',
    params: {
      apiKey: MOONPAY_API_KEY,
    },
    debug: true
  });

  // const urlForSignature = moonPaySdk.generateUrlForSigning();

  const updateSignature = async (signature: string) => {
    moonPaySdk.updateSignature(signature);
  }

  const show = () => {
    moonPaySdk.show();
  }

  return {
    show,
    updateSignature
  };
}
