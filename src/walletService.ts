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
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-z-index': 1100,
    '--w3m-accent': '#28a745'
  }
});

// Forcefully override all styles to match the application's neumorphic design.
const style = document.createElement('style');
style.textContent = `
  /* 1. The Overlay */
  w3m-modal {
    background-color: rgba(0, 0, 0, 0.4) !important;
  }

  /* 2. The Main Card (Neumorphic Foundation) */
  wui-card {
    /* A. Foundational Material & Color */
    background-color: #f0f0f0 !important;
    color: #333 !important;

    /* B. Shape & Border */
    border-radius: 1.5rem !important;
    border: 1px solid #e0e0e0 !important;

    /* C. The Neumorphic 3D Effect */
    box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff !important;

    /* D. Entry Animation */
    opacity: 0 !important;
    animation: modal-fade-scale-in 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards !important;
  }

  /* 3. Internal Components */
  w3m-header {
    background-color: transparent !important;
    border-bottom: 1px solid #e0e0e0 !important;
    padding: 1rem 1.5rem !important;
  }

  w3m-header wui-text {
    font-family: 'Oswald', sans-serif !important;
    color: #343a40 !important;
  }
  
  w3m-router {
    padding: 1rem;
  }

  /* 4. Animation Definition */
  @keyframes modal-fade-scale-in {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);


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
 * Formats a wallet address for display (e.g., 0x1234...5678).
 * @param address The full wallet address.
 * @returns A shortened, formatted address.
 */
function formatAddress(address: string): string {
    if (address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}


/**
 * Updates the visibility and content of wallet connection buttons based on connection state.
 * This function provides the single source of truth for the wallet UI.
 */
function updateWalletButtonUI() {
    const desktopBtn = document.getElementById('connect-wallet-button');
    const mobileConnectBtn = document.getElementById('mobile-connect-wallet-button');
    const profileBtn = document.querySelector('[data-nav="profile_view"]');
    
    if (!profileBtn) return; // Can't do anything if the profile button isn't there.

    const profileIcon = profileBtn.querySelector('i');
    const profileLabel = profileBtn.querySelector('span');

    if (activeWallet) {
        // --- WALLET IS CONNECTED ---
        if (desktopBtn) desktopBtn.classList.add('hidden');
        if (mobileConnectBtn) mobileConnectBtn.classList.add('hidden');
        
        profileBtn.classList.remove('hidden');
        if (profileIcon) profileIcon.className = 'fas fa-link text-lg'; // Change to a "connected" icon
        if (profileLabel) profileLabel.textContent = formatAddress(activeWallet.address);

    } else {
        // --- WALLET IS DISCONNECTED ---
        if (desktopBtn) desktopBtn.classList.remove('hidden');
        if (mobileConnectBtn) mobileConnectBtn.classList.remove('hidden');

        // On mobile, hide the "Profile" button and show the dedicated "Connect" button.
        // On desktop, the profile button isn't used for connection, so we just reset it.
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            profileBtn.classList.add('hidden');
        } else {
             profileBtn.classList.remove('hidden');
        }
        
        if (profileIcon) profileIcon.className = 'fas fa-user text-lg'; // Reset to profile icon
        if (profileLabel) profileLabel.textContent = 'Profile'; // Reset to default text
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

        try {
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
        } catch (error) {
            console.error("Connection failed:", error);
            // Ensure state is clean on failure
            activeWallet = null;
        } finally {
            updateWalletButtonUI();
        }
        
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
    },

    /**
     * Sends a transaction using the currently connected wallet signer.
     * Returns the transaction hash as a string.
     */
    async sendTransaction(tx: { to: string; data?: string; value?: string; chainId?: number }): Promise<string> {
        if (!signer) {
            throw new Error("Wallet not connected");
        }

        // Ensure wallet is on the correct network before sending
        await this.ensurePiccadillyNetwork();

        const txRequest = {
            to: tx.to,
            data: tx.data ?? "0x",
            value: tx.value ? BigInt(tx.value) : undefined,
            chainId: tx.chainId,
        } as any;

        const sentTx = await signer.sendTransaction(txRequest);
        return sentTx.hash;
    },

    /** Check if window.ethereum is connected to Piccadilly (1319) */
    async isOnPiccadillyNetwork(): Promise<boolean> {
        if (!window.ethereum) return false;
        const chainHex = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
        return chainHex.toLowerCase() === '0x527';
    },

    /**
     * Ensure the connected wallet is on Autonity Piccadilly (chainId 1319).
     * Attempts to switch; if chain is unknown it tries to add it.
     */
    async ensurePiccadillyNetwork(): Promise<boolean> {
        if (!window.ethereum) return false;
        const desiredChainIdHex = "0x527"; // 1319
        const currentHex = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
        if (currentHex.toLowerCase() === desiredChainIdHex) return true;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: desiredChainIdHex }],
            });
            return true;
        } catch (switchErr: any) {
            // 4902 = unknown chain
            if (switchErr.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: desiredChainIdHex,
                        chainName: 'Autonity Piccadilly',
                        nativeCurrency: { name: 'ATN', symbol: 'ATN', decimals: 18 },
                        rpcUrls: ['https://rpc1.piccadilly.autonity.org'],
                        blockExplorerUrls: ['https://explorer.piccadilly.autonity.org'],
                    }],
                });
                return true;
            } else {
                console.error(switchErr);
                return false;
            }
        }
        return false;
    },
};

// Set initial button state on load
document.addEventListener('DOMContentLoaded', updateWalletButtonUI);
// Also update on resize to handle desktop/mobile transitions
window.addEventListener('resize', updateWalletButtonUI);


// Add ethereum to the Window interface for web wallet support
declare global {
    interface Window {
        ethereum?: any;
    }
} 