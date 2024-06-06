
export function useFacebook($app) {
    
    function initFbSdk(options) {
        return new Promise(resolve => {
            window.fbAsyncInit = function () {
                const defaults = { cookie: true, xfbml: true }
                options = { ...defaults, ...options }
                window.FB.init(options)
                resolve()
            };
            /* eslint-disable */
            (function (d, s, id) {
                const fjs = d.getElementsByTagName(s)[0]
                if (d.getElementById(id)) { return; }
                const js = d.createElement(s); js.id = id
                js.src = '//connect.facebook.net/zh_TW/sdk.js'
                fjs.parentNode.insertBefore(js, fjs)
            }(document, 'script', 'facebook-jssdk'))
            /* eslint-enable */
        })
    }

    function getFbSdk(options) {
        return new Promise(async resolve => {
            if (window.FB) {
                resolve(window.FB)
            } else {
            await initFbSdk(options)
                resolve(window.FB)
            }
        })
    }

    // not work
    const initFacebook = async () => {

        $app.api.eth.auth
        .getCredintialsFacebook()
        .then(async (res) => {
            const facebookId = 934423128173330; // 934423128173330; //  res?.data?.client_id;

            const sdk = await getFbSdk(
                {
                    appId: facebookId, //You will need to change this
                    cookie: true, // This is important, it's not enabled by default
                    version: "v13.0"
                }
            ) //sdk === FB in this case

            sdk.init(
                {
                    appId: facebookId, //You will need to change this
                    cookie: true, // This is important, it's not enabled by default
                    version: "v13.0"
                }
            );

            const response = await sdk.login((response) => {
                // if (response?.authResponse) {
                //     return response;
                // }
            });

            console.log(response)
            return response;

        })
        .catch((e) => {
            // Todo: notify something went wrond
            console.error(e)
        })

    }


    return {
        initFacebook,
        getFbSdk
    };
}
