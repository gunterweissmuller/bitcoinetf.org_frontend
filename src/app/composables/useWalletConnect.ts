import { BrowserProvider } from 'ethers'
import { useWeb3Modal, useWeb3ModalProvider, useWeb3ModalAccount, useWeb3ModalEvents, useDisconnect } from '@web3modal/ethers/vue'

export function useWalletConnect($app) {
    const { disconnect } = useDisconnect()
    const modal = useWeb3Modal()

    const openWalletConnect = () => {
        disconnect()
        modal.open({ view: 'Connect' });
    }
    
    const initWalletConnect = async () => {
        const { address, chainId, isConnected } = useWeb3ModalAccount()
        const { walletProvider } = useWeb3ModalProvider()

        async function onSignMessage() {
            const provider = new BrowserProvider(walletProvider.value)
            const signer = await provider.getSigner()
            const signature = await signer?.signMessage($app.store.registration.walletConnectData?.signatureMessage);

            $app.store.registration.walletConnectData.signature = signature;
            $app.store.registration.walletConnectData.walletAddress = address.value;
            
        }
        
        await onSignMessage();
    }

    return {
        initWalletConnect,
        openWalletConnect
    };
}
