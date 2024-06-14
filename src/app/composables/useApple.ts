export function useApple($app) {
    
    const initApple = async () => {

        try {
            const urlApple = await $app.api.eth.auth.getAppleRedirect();

            function getJsonFromUrl(url) {
                if (!url) url = location.search
                var query = url.substr(1).split('?')[1]
                var result = {}
                query.split('&').forEach(function (part) {
                    var item = part.split('=')
                    result[item[0]] = decodeURIComponent(item[1])
                })
                return result
            }

            const parsedUrl = getJsonFromUrl(urlApple.url);
            
            await (window as any).AppleID.auth.init({
                clientId: parsedUrl?.client_id,
                scope: parsedUrl?.scope,
                redirectURI: parsedUrl?.redirect_uri,
                usePopup: true,
            })

            const data = await (window as any).AppleID.auth.signIn()
            $app.store.authTemp.response = data.authorization.id_token;

            return data;
        } catch (error) {
            console.error(error)
        }
    }


    return {
        initApple,
    };
}
