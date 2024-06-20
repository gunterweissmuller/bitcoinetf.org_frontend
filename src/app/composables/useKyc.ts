export function useKyc($app) {
  const checkKyc = async () => {
    return await $app.api.eth.kyc.getForms().then((formsResponse: any) => {
      return formsResponse.data[0].status === 'passed'
    })
  }

  return {
    checkKyc,
  };
}
