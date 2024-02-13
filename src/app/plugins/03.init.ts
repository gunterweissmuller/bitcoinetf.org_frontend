export default defineNuxtPlugin(async ({ $app }: any) => {
  const isUserAuthenticated = $app.store.auth.isUserAuthenticated

  try {
    await $app.store.auth.refresh()
    if (isUserAuthenticated) {
      await $app.api.eth.auth.getUser().then((resp) => {
        $app.store.user.info = resp?.data
      })
      await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
        $app.store.user.blockchainUserWallet = resp?.data.uid
      })
    }
  } catch (e) {
    $app.store.auth.logout()
  }

  let allSettledArray = [
    $app.api.info.fund
      .getAssets()
      .then((assetsResponse: any) => {
        // TODO Добавить нужные поля по статистики по конкретному ассету
        $app.store.assets.items = assetsResponse.data?.sort(function (a, b) {
          if (a.symbol > b.symbol) {
            return 1
          }
          if (a.symbol < b.symbol) {
            return -1
          }
          return 0
        })
      })
      .catch(() => {
        // Todo: notify something went wrond
      }),

    $app.api.eth.news
      .getIntegration()
      .then((integrationResponse) => {
        $app.store.user.newsData = integrationResponse.data[0]
      })
      .catch(() => {
        // Todo: notify something went wrond
      }),
    $app.api.info.event
      .getPurchases({
        per_page: 4,
        page: 1,
      })
      .then((dealsResponse) => {
        $app.store.user.lastPurchases = dealsResponse.data.data
      })
      .catch(() => {
        // Todo: notify something went wrond
      }),
    $app.api.eth.statisticEth
      .getGlobalStats()
      .then((resp) => {
        $app.store.user.statistic = resp?.data
        $app.store.user.btcValue = resp?.data?.btc_price
        $app.store.assets.btcValue = resp?.data?.btc_price
      })
      .catch(() => {
        // Todo: notify something went wrond
      }),
    // TOdo: remove commetns
    // $app.api.eth.news
    //   .getNosrtNews()
    //   .then((newsResponse: any) => {
    //     $app.store.user.news = newsResponse
    //   })
    //   .catch(() => {
    //     // Todo: notify something went wrond
    //   }),
  ]

  if (isUserAuthenticated) {
    allSettledArray = [
      ...allSettledArray,
      $app.api.eth.billingEth
        .getLastPayment()
        .then((response: any) => {
          $app.store.user.lastPayment = response.data
        })
        .catch(() => {
          // Todo: notify something went wrond
        }),
    ]
  }

  await Promise.allSettled(allSettledArray)
})
