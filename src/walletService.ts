import { invoke } from "@tauri-apps/api/tauri";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers';
import { AUTONITY_PICCADILLY_TESTNET, ARBITRUM_ONE } from "./networks";

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
  ethersConfig: defaultConfig({ metadata, defaultChainId: AUTONITY_PICCADILLY_TESTNET.chainId }),
  chains: [
    {
        chainId: ARBITRUM_ONE.chainId,
        name: ARBITRUM_ONE.name,
        currency: ARBITRUM_ONE.currency,
        explorerUrl: ARBITRUM_ONE.explorerUrl,
        rpcUrl: ARBITRUM_ONE.rpcUrls[0]
    },
    {
        chainId: AUTONITY_PICCADILLY_TESTNET.chainId,
        name: AUTONITY_PICCADILLY_TESTNET.name,
        currency: AUTONITY_PICCADILLY_TESTNET.currency,
        explorerUrl: AUTONITY_PICCADILLY_TESTNET.explorerUrl,
        rpcUrl: AUTONITY_PICCADILLY_TESTNET.rpcUrls[0]
    },
    // Ethereum mainnet is still handy for debugging – keep at end.
    {
        chainId: 1,
        name: 'Ethereum',
        currency: 'ETH',
        explorerUrl: 'https://etherscan.io',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_ID'
    }
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
        if (desktopBtn) desktopBtn.style.visibility = 'visible';
        
        profileBtn.classList.remove('hidden');
        if (profileIcon) profileIcon.className = 'fas fa-link text-lg'; // Change to a "connected" icon
        if (profileLabel) profileLabel.textContent = formatAddress(activeWallet.address);

    } else {
        // --- WALLET IS DISCONNECTED ---
        if (desktopBtn) desktopBtn.classList.remove('hidden');
        if (mobileConnectBtn) mobileConnectBtn.classList.remove('hidden');
        if (desktopBtn) desktopBtn.style.visibility = 'visible';

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
            // Ensure correct network for WC sessions (may not support switch, but we check)
            await walletService.ensurePiccadillyNetwork();
            console.log("Connected via WalletConnect:", activeWallet);
            return activeWallet;
        }
        return null;
    } catch (error) {
        console.error("WalletConnect connection error:", error);
        return null;
    }
}

// Utility to wait until the wallet reports the desired chainId
async function waitForChain(targetHex: string, timeoutMs = 15000): Promise<boolean> {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
        const current = await window.ethereum.request({ method: 'eth_chainId' }) as string;
        if (current.toLowerCase() === targetHex) return true;
        await new Promise(r => setTimeout(r, 400));
    }
    return false;
}
// --- Wallet State ---


/**
 * Disconnects the current wallet.
 */
function disconnect() {
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

/**
 * Sends a transaction using the currently connected wallet signer.
 * Returns the transaction hash as a string.
 */
async function sendTransaction(tx: { to: string; data?: string; value?: string; chainId?: number }): Promise<string> {
    if (!signer) {
        throw new Error("Wallet not connected");
    }

    // Ensure wallet is on the correct network before sending
    await ensurePiccadillyNetwork();

    const txRequest = {
        to: tx.to,
        data: tx.data ?? "0x",
        value: tx.value ? BigInt(tx.value) : undefined,
        // Let ethers infer chainId from the signer’s provider to avoid mismatches
    } as any;

    try {
        const sentTx = await signer.sendTransaction(txRequest);
        return sentTx.hash;
    } catch (err: any) {
        // If estimation failed due to CALL_EXCEPTION, retry with explicit gasLimit.
        if (err.code === 'CALL_EXCEPTION' || err.code === 'UNPREDICTABLE_GAS_LIMIT') {
            console.warn('Gas estimation failed, retrying with manual gasLimit 300000');
            txRequest.gasLimit = 300000n;
            const sentTx = await signer.sendTransaction(txRequest);
            return sentTx.hash;
        }
        throw err;
    }
}

/** Check if window.ethereum is connected to Piccadilly testnet */
async function isOnPiccadillyNetwork(): Promise<boolean> {
    if (!window.ethereum) return false;
    const chainHex = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
    return chainHex.toLowerCase() === AUTONITY_PICCADILLY_TESTNET.chainIdHex;
}

/**
 * Ensure wallet is on Autonity Piccadilly testnet.
 */
async function ensurePiccadillyNetwork(): Promise<boolean> {
    if (!window.ethereum) return false;

    const OFFICIAL = AUTONITY_PICCADILLY_TESTNET.chainIdHex; // 0x03e158e4
    const LEGACY   = '0x527'; // historical Piccadilly

    const current = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
    if (current.toLowerCase() === OFFICIAL) return true;

    const switchTo = async (hex: string): Promise<boolean> => {
        try {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex }] });
            return await waitForChain(hex, 20000);
        } catch (e) {
            return false;
        }
    };

    // 1️⃣ Attempt official ID first
    if (await switchTo(OFFICIAL)) return true;

    // 2️⃣ Attempt legacy ID
    if (await switchTo(LEGACY)) {
        // Prompt MetaMask to update the network with canonical params (updates symbol to ATN)
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: OFFICIAL,
                    chainName: AUTONITY_PICCADILLY_TESTNET.name,
                    nativeCurrency: { name: 'Auton', symbol: 'ATN', decimals: 18 },
                    rpcUrls: AUTONITY_PICCADILLY_TESTNET.rpcUrls,
                    blockExplorerUrls: [AUTONITY_PICCADILLY_TESTNET.explorerUrl]
                }]
            });
            await switchTo(OFFICIAL);
        } catch {/* user may cancel; stay on legacy */}
        return true;
    }

    // 3️⃣ Fallback – ask user via chooser
    const choice = await showEnvChoiceModal();
    if (choice === 'mainnet') return await ensureArbitrumNetwork();
    return false;
}

/** Ensure wallet is on Arbitrum One mainnet. */
async function ensureArbitrumNetwork(): Promise<boolean> {
    if (!window.ethereum) return false;
    const { chainIdHex } = ARBITRUM_ONE;
    const currentHex = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
    if (currentHex.toLowerCase() === chainIdHex) return true;
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
        });
        await waitForChain(chainIdHex);
        return true;
    } catch (switchErr: any) {
        if (switchErr.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: chainIdHex,
                    chainName: ARBITRUM_ONE.name,
                    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ARBITRUM_ONE.rpcUrls,
                    blockExplorerUrls: [ARBITRUM_ONE.explorerUrl]
                }],
            });
            await waitForChain(chainIdHex);
            return true;
        }
        console.error(switchErr);
        return false;
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
    disconnect,

    /**
     * Sends a transaction using the currently connected wallet signer.
     * Returns the transaction hash as a string.
     */
    sendTransaction,

    /** Check if window.ethereum is connected to Piccadilly testnet */
    isOnPiccadillyNetwork,

    /**
     * Ensure wallet is on Autonity Piccadilly testnet.
     */
    ensurePiccadillyNetwork,

    /** Ensure wallet is on Arbitrum One mainnet. */
    ensureArbitrumNetwork,
};

/** Simple on-brand modal to ask whether the user wants Testnet or Mainnet (one-click UX). */
function showEnvChoiceModal(): Promise<'testnet' | 'mainnet' | null> {
    return new Promise(resolve => {
        // Avoid duplicating the modal
        if (document.getElementById('env-choice-modal')) {
            return resolve(null);
        }
        const overlay = document.createElement('div');
        overlay.id = 'env-choice-modal';
        overlay.className = 'fixed inset-0 flex items-center justify-center';
        overlay.style.background = 'rgba(0,0,0,0.5)';
        overlay.style.backdropFilter = 'blur(6px)';
        overlay.style.zIndex = '3000';

        const card = document.createElement('div');
        card.style.background = '#eaeaea';
        card.style.color = '#333';
        card.style.borderRadius = '1.5rem';
        card.style.padding = '2rem';
        card.style.width = '22rem';
        card.style.maxWidth = '90vw';
        card.style.boxShadow = '9px 9px 18px #c8c8c8, -9px -9px 18px #ffffff';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';

        // Subtle entry animation
        card.animate([
            { opacity: 0, transform: 'translateY(16px) scale(.95)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
        ], { duration: 300, easing: 'cubic-bezier(0.23,1,0.32,1)', fill: 'forwards' });

        const title = document.createElement('h2');
        title.className = 'text-xl font-semibold mb-4 font-display';
        title.textContent = 'Choose network';

        const subtitle = document.createElement('p');
        subtitle.className = 'text-sm mb-6 opacity-80';
        subtitle.textContent = 'Where do you want to run this purchase?';

        const btnTest = document.createElement('button');
        btnTest.style.cssText = 'width:100%;padding:0.6rem;border-radius:0.75rem;margin-bottom:0.75rem;background:#e0e0e0;transition:background .2s';
        btnTest.onmouseenter = () => { btnTest.style.background = '#d1d1d1'; };
        btnTest.onmouseleave = () => { btnTest.style.background = '#e0e0e0'; };
        btnTest.textContent = 'Testnet (mock tANT)';

        const btnMain = document.createElement('button');
        btnMain.style.cssText = 'width:100%;padding:0.6rem;border-radius:0.75rem;background:#28a745;color:white;transition:background .2s';
        btnMain.onmouseenter = () => { btnMain.style.background = '#218838'; };
        btnMain.onmouseleave = () => { btnMain.style.background = '#28a745'; };
        btnMain.textContent = 'Mainnet (real ANT)';

        btnTest.onclick = () => { document.body.removeChild(overlay); resolve('testnet'); };
        btnMain.onclick = () => { document.body.removeChild(overlay); resolve('mainnet'); };

        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(btnTest);
        card.appendChild(btnMain);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
    });
}

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