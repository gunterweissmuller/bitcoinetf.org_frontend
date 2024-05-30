import { Centrifuge } from 'centrifuge'
import { Icon } from '~/src/shared/constants/icons'
import { hostname } from '~/src/app/adapters/ethAdapter'
import { PayTypes } from '~/src/shared/constants/payWith'

export function usePayment($app, disabledMethods: Array<any> = []) {
  const isMoonpaySelected = ref(false)
  const currentPayType = ref(PayTypes.Tron);
  const switches = reactive({
    referral: false,
    dividends: false,
  })

  const centrifuge = ref(null)
  const config = useRuntimeConfig()
  const centrifugeURL = config.public.WS_URL
  const centrifugeToken = config.public.WS_TOKEN

  const accountUuid = computed(() => {
    return $app.store.user.info?.account?.uuid
  })

  const paymentAddress = computed(()=>{
    return currentPayType.value == PayTypes.Tron ? $app.store.user.info?.account?.tron_wallet
      : currentPayType.value == PayTypes.Ethereum ? $app.store.user.wallets.ethereum.address
        : currentPayType.value == PayTypes.Polygon ? $app.store.user.wallets.polygon.address
          : $app.store.user.info?.account?.tron_wallet;
  });

  const orderType = computed(() => $app.store.user?.info?.account?.order_type || 'init_btc')

  const showTron = computed(() => {
    return ($app.store.user?.wallets?.tron || $app.store.user.info?.account?.tron_wallet) && !isMoonpaySelected.value;
  });

  const showEth = computed(() => {
    return $app.store.user?.wallets?.ethereum && !isMoonpaySelected.value;
  });

  const showPolygon = computed(() => {
    return $app.store.user?.wallets?.polygon && !isMoonpaySelected.value;
  });

  const payWith = ref([
    {
      icon: "/img/icons/colorful/usdt-trc20.svg",
      iconType: Icon.ColorfulTron,
      title: "Pay with USDT (TRC20)",
      value: 'usdt-trc',
      onClick: 'openTrc',
      show: showTron,
    },
    {
      icon: "/img/icons/colorful/moonpay.svg",
      title: "Pay through Moonpay",
      iconType: Icon.ColorfulMoonpay,
      value: 'moonpay',
      onClick: 'openMoonpay',
      show: true,
    },
    {
      icon: "/img/icons/colorful/usdt-trc20.svg",
      title: "Pay with USDT (BEP-20)",
      iconType: Icon.ColorfulUsdtTrc20,
      value: 'usdtbep',
      show: false,
    },
    {
      icon: "/img/icons/colorful/usdt-erc20.svg",
      title: "Pay with USDT (ERC-20)",
      iconType: Icon.ColorfulUsdtErc20,
      value: 'usdt-eth',
      onClick: 'openEth',
      show: showEth,
    },
    {
      icon: "/img/icons/colorful/usdt-matic.svg",
      title: "Pay with USDT (MATIC)",
      iconType: Icon.ColorfulUsdtPolygon,
      value: 'usdt-polygon',
      onClick: 'openPolygon',
      show: showPolygon,
    },
    {
      icon: "/img/icons/colorful/usdt-trc20.svg",
      title: "Pay with USDT (Liquid)",
      show: false,
    },
    {
      icon: "/img/icons/colorful/metamask.svg",
      title: "Pay with WalletConnect",
      show: false,
    },
    {
      icon: "/img/icons/colorful/metamask.svg",
      title: "Pay with Metamask",
      show: false,
    },
  ]);

  const getMoonpayPaymentUrl = async (): Promise<string> => {
    try {
      const { data: { moonpay: { url: moonpayUrl } } } = await $app.api.eth.billingEth.getPaymentWallets($app.store.user.buyShares.data.uuid)

      return moonpayUrl
    } catch (e) {
      console.error('error', e)
    }
  }

  const initPayment = async () => {
    const response = await fetch(`https://${hostname}/v3/public/billing/shares/buy/init`, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + $app.store.auth.accessToken,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        dividends: switches?.dividends ? true : false,
        referral: switches?.referral ? true : false,
        bonus: false,
        amount: $app.store.purchase.amountUS,
        order_type: $app.store.purchase.type === 'USDT' ? 'init_usdt' : 'init_btc'
      })
    });

    const res = await response.json();

    if (res) {
      $app.store.user.buyShares = res
    }
  }

  const openMoonpayHandler = async (
    callback: CallableFunction = async () => {},
    callbackOnPayment: CallableFunction = () => {},
    init: boolean = true,
    listenChannel: boolean = true,
  ) => {
    if (isMoonpaySelected.value) {
      return
    }

    isMoonpaySelected.value = true

    if (init) {
      await initPayment()
    }

    await callback()

    if (listenChannel) {
      centrifuge.value = new Centrifuge(centrifugeURL, {
        token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
      })

      centrifuge.value.connect()


      const sub = centrifuge.value.newSubscription(`replenishment.${accountUuid.value}`)

      sub
        .on('publication', async function (ctx) {
          if (ctx.data.message?.data?.status === 'success') {
            callbackOnPayment(ctx)
          }
        })
        .subscribe()
    }

    isMoonpaySelected.value = false;
  }

  const getPayWallets = async () => {
    const { data: { apollo: wallets } } = await $app.api.eth.billingEth.getPaymentWallets()

    $app.store.user.wallets = wallets
  }

  onUnmounted(() => {
    centrifuge.value?.disconnect()
  })

  return {
    payWith,
    switches,
    initPayment,
    getPayWallets,
    paymentAddress,
    currentPayType,
    isMoonpaySelected,
    openMoonpayHandler,
    getMoonpayPaymentUrl,
  };
}
