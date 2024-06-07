import { BrowserProvider } from 'ethers'

export function useMetamask($app) {

    const isMetamaskConnecting = ref(false);
    const isReload = ref(false);
    
    const initMetamask = async () => {
        if(isMetamaskConnecting.value) return;
        isMetamaskConnecting.value = true;

        //if metamask is not installed

        if (!$app.store.auth.isMetamaskSupported) {
            if(isReload.value) {
                isReload.value = false;
                location.reload();
            } else {
                isReload.value = true;
            }

            window.open('https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn');
            isMetamaskConnecting.value = false;
            return;
        }

        try {
            const provider = new BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();

            //get accounts
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

            //switch to eth chain
            await (window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });

            // get metamask message
            const resMsg = await $app.api.eth.auth.getMessageMetamask();

            // sign message
            const msg = await (window as any).ethereum.request({method: 'personal_sign', params: [resMsg?.message, accounts[0]]});
            isMetamaskConnecting.value = false;

            return {
                msg,
                resMsg,
                signer
            }

        } catch (e) {
            console.error(e);
            isMetamaskConnecting.value = false;

            return {
                msg: '',
                resMsg: '',
                signer: ''
            }
        }
    }


    return {
        initMetamask,
    };
}
