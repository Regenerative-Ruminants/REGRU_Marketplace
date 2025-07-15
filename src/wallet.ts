import { BrowserProvider, JsonRpcSigner } from "ethers";

// --- Wallet State ---
let provider: BrowserProvider | null = null;
let signer: JsonRpcSigner | null = null;

// --- UI Elements ---
let connectButton: HTMLButtonElement | null = null;
let walletModalContainer: HTMLElement | null = null;
let walletModalCard: HTMLElement | null = null;


// --- Core Functions ---

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            console.log("Wallet connected:", await signer.getAddress());
        } catch (error) {
            console.error("User rejected connection:", error);
            provider = null;
            signer = null;
        }
    } else {
        alert("Please install MetaMask to use this feature.");
        console.error("MetaMask is not installed!");
    }
    await updateWalletUI();
    await openWalletsModal();
}

async function disconnectWallet() {
    provider = null;
    signer = null;
    await updateWalletUI();
    closeWalletsModal();
}

async function updateWalletUI() {
    if (!connectButton) return;
    if (signer) {
        const address = await signer.getAddress();
        const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        connectButton.textContent = truncatedAddress;
    } else {
        connectButton.textContent = 'Connect Wallet';
    }
}

// --- Modal Logic ---

function closeWalletsModal(): void {
    if (walletModalContainer) {
        walletModalContainer.classList.add('hidden');
    }
    const modalBackdrop = document.getElementById('wallet-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.removeEventListener('click', closeWalletsModal);
    }
}

function setupModalEventListeners(modalCard: HTMLElement): void {
    const closeButton = modalCard.querySelector('#wallet-modal-close-btn');
    closeButton?.addEventListener('click', closeWalletsModal, { once: true });

    const modalBackdrop = document.getElementById('wallet-modal-backdrop');
    modalBackdrop?.addEventListener('click', closeWalletsModal, { once: true });
}

async function populateUserWalletView(modalCard: HTMLElement) {
    const listContainer = modalCard.querySelector('#wallet-list-container') as HTMLElement;
    const modalTitle = modalCard.querySelector('#wallet-modal-title') as HTMLElement;

    if (!listContainer || !modalTitle || !signer || !provider) return;

    modalTitle.textContent = 'Connected Wallet';
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    const etherBalance = parseFloat(balance.toString()) / 1e18;

    const abbreviateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-5)}`;

    listContainer.innerHTML = `
        <div class="wallet-item">
            <span class="wallet-name">Your Wallet</span>
            <div class="wallet-address-container">
                <span class="wallet-address" title="Click to copy: ${address}" data-full-address="${address}">
                    ${abbreviateAddress(address)}
                </span>
                <span class="copy-indicator" id="copy-indicator-user">Copied!</span>
            </div>
            <span class="wallet-balance">${etherBalance.toFixed(4)} ETH</span>
        </div>
        <button id="disconnect-wallet-btn" class="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700">
            Disconnect
        </button>
    `;

    const addressSpan = listContainer.querySelector<HTMLElement>('[data-full-address]');
    addressSpan?.addEventListener('click', () => {
        navigator.clipboard.writeText(address).then(() => {
            const indicator = listContainer.querySelector<HTMLElement>('.copy-indicator');
            if(indicator) {
                indicator.classList.add('visible');
                setTimeout(() => indicator.classList.remove('visible'), 1500);
            }
        });
    });

    const disconnectBtn = listContainer.querySelector<HTMLButtonElement>('#disconnect-wallet-btn');
    disconnectBtn?.addEventListener('click', disconnectWallet);
}


async function openWalletsModal(): Promise<void> {
    if (!walletModalContainer || !walletModalCard) return;

    walletModalContainer.classList.remove('hidden');

    // Always re-populate the modal based on the current signer state.
    if (walletModalCard.innerHTML.trim() === '') {
        try {
            const response = await fetch('/wallet-modal.html');
            if (!response.ok) throw new Error(`Failed to fetch modal HTML: ${response.status}`);
            walletModalCard.innerHTML = await response.text();
            setupModalEventListeners(walletModalCard);
        } catch (error) {
            console.error("Error building wallet modal:", error);
            walletModalCard.innerHTML = `<p class="p-4 text-center text-red-500">Could not load modal content.</p>`;
            return;
        }
    }
    
    // Now that the structure is guaranteed to be there, populate it.
    await populateUserWalletView(walletModalCard);
}

// --- Initialization ---

export function initializeWallet(): void {
    connectButton = document.getElementById('connect-wallet-button') as HTMLButtonElement;
    walletModalContainer = document.getElementById('wallet-modal-container');
    walletModalCard = document.getElementById('wallet-modal-card');

    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
    } else {
        console.error("Wallet connect button not found.");
    }

    // Initial UI update in case the wallet is already connected via a browser extension.
    updateWalletUI();
}

// Add window.ethereum to the Window interface
declare global {
    interface Window {
        ethereum?: any;
    }
} 