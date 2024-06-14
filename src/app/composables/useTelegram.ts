
export function useTelegram($app) {
    
    // not work
    const initTelegram = async () => {
        const dataTelegram = await $app.api.eth.auth.getCredintialsTelegram();
        const telegramBotId = dataTelegram?.data?.bot_id;

        await (window as any).Telegram.Login.init(
            'widget_login',
            telegramBotId,
            { origin: 'https:\/\/core.telegram.org' },
            false,
            'en',
        )

        const response = await (window as any).Telegram.Login.auth({ bot_id: telegramBotId, request_access: true }, (tgData: any) => {
            // console.log(tgData);
            // if (!tgData) {
            // // authorization failed
            // } else {
            //     return tgData;
            // }
        });

        console.log(response);
        return response;

    }


    return {
        initTelegram,
    };
}
