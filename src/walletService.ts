import { invoke } from "@tauri-apps/api/tauri";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers';

// --- WalletConnect Configuration ---

// 1. Get Project ID from https://cloud.walletconnect.com
const projectId = 'YOUR_PROJECT_ID'; // Replace with your actual project ID

// 2. Set up metadata
const metadata = {
  name: 'Regenerative Marketplace',
  description: 'A decentralized marketplace for regenerative agriculture.',
  url: 'http://localhost:1420', // Or your production URL
  icons: ['/images/regru_logo.png'] // Or a more permanent URL
}

// 3. Create modal
const modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [
    {
        chainId: 1, // Example: Ethereum Mainnet
        name: 'Ethereum',
        currency: 'ETH',
        explorerUrl: 'https://etherscan.io',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_ID' // Replace with your RPC URL
    },
    // Add other chains as needed
  ],
  projectId
});


// --- Interfaces ---

export interface Wallet {
    address: string;
    balance?: string; // Optional for now
    // Future properties: type (e.g., 'native', 'metamask'), nickname, etc.
}

// --- Wallet State ---

let provider: BrowserProvider | null = null;
let signer: JsonRpcSigner | null = null;
let activeWallet: Wallet | null = null;
let availableWallets: Wallet[] = [];

/**
 * Updates the visibility of wallet connection buttons based on connection state.
 */
function updateWalletButtonUI() {
    const desktopBtn = document.getElementById('connect-wallet-button');
    const mobileBtn = document.getElementById('mobile-connect-wallet-button');
    const profileBtn = document.querySelector('[data-nav="profile_view"]');

    if (activeWallet) {
        // Wallet is connected
        if (desktopBtn) desktopBtn.classList.add('hidden');
        if (mobileBtn) mobileBtn.classList.add('hidden');
        if (profileBtn) profileBtn.classList.remove('hidden'); // Ensure profile is visible
    } else {
        // Wallet is disconnected
        if (desktopBtn) desktopBtn.classList.remove('hidden');
        if (mobileBtn) mobileBtn.classList.remove('hidden');
        if (profileBtn) profileBtn.classList.add('hidden'); // Hide profile, show connect
    }
}


// --- Private Functions ---

async function connectNative(): Promise<Wallet | null> {
    try {
        const wallets: any[] = await invoke("get_available_wallets");
        if (wallets && wallets.length > 0) {
            // For now, let's just use the first available native wallet.
            // A future implementation would involve a UI to select which wallet to use.
            const firstWallet = wallets[0];
            activeWallet = {
                address: firstWallet.address
            };
            availableWallets = wallets.map(w => ({ address: w.address }));
            console.log("Connected to native wallet:", activeWallet);
            return activeWallet;
        }
        console.log("No native wallets found.");
        return null;
    } catch (error) {
        console.error("Error connecting to native wallet:", error);
        return null;
    }
}

async function connectWeb(): Promise<Wallet | null> {
    if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask or another browser wallet to connect.");
        console.error("MetaMask is not installed!");
        return null;
    }
    try {
        provider = new BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        activeWallet = { address };
        availableWallets = [activeWallet];
        console.log("Connected to web wallet:", activeWallet);
        return activeWallet;
    } catch (error) {
        console.error("User rejected connection:", error);
        provider = null;
        signer = null;
        return null;
    }
}

async function connectWalletConnect(): Promise<Wallet | null> {
    try {
        await modal.open();
        // The modal handles the connection logic and provider setup internally.
        // We can retrieve the address after the user connects.
        const address = modal.getAddress();
        if (address) {
            activeWallet = { address };
            availableWallets = [activeWallet]; // WalletConnect modal manages the list of wallets
            console.log("Connected via WalletConnect:", activeWallet);
            return activeWallet;
        }
        return null;
    } catch (error) {
        console.error("WalletConnect connection error:", error);
        return null;
    }
}

// --- Public Service ---

export const walletService = {
    /**
     * Connects to a wallet, automatically detecting the environment.
     * In a Tauri environment, it uses the native Rust backend.
     * In a web environment, it looks for a browser wallet like MetaMask.
     */
    async connect(): Promise<Wallet | null> {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
        let connectedWallet: Wallet | null = null;
        if (window.__TAURI__) {
            console.log("Tauri environment detected. Using native wallet connection.");
            connectedWallet = await connectNative();
        } else if (isMobile) {
            console.log("Mobile web browser detected. Using WalletConnect.");
            connectedWallet = await connectWalletConnect();
        } else {
            console.log("Desktop web environment detected. Using browser wallet extension.");
            connectedWallet = await connectWeb();
        }
        updateWalletButtonUI();
        return connectedWallet;
    },

    /**
     * Gets the currently active wallet.
     */
    getActiveWallet(): Wallet | null {
        return activeWallet;
    },

    /**
     * Gets all wallets that have been found (either native or web).
     */
    getAvailableWallets(): Wallet[] {
        return availableWallets;
    },

    /**
     * Disconnects the current wallet.
     */
    disconnect() {
        // Also disconnect from WalletConnect if it's active
        const state = modal.getState();
        if (state.open) {
            modal.close();
        }

        provider = null;
        signer = null;
        activeWallet = null;
        availableWallets = [];
        updateWalletButtonUI();
        console.log("Wallet disconnected.");
    }
};

// Set initial button state on load
document.addEventListener('DOMContentLoaded', updateWalletButtonUI);


// Add ethereum to the Window interface for web wallet support
declare global {
    interface Window {
        ethereum?: any;
    }
} 