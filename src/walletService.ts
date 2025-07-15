import { ethers } from "ethers";

// Define a type for the connected wallet information
export interface ConnectedWallet {
    address: string;
    provider: ethers.BrowserProvider;
    signer: ethers.Signer;
}

/**
 * Connects to a user's browser wallet (e.g., MetaMask).
 * @returns A promise that resolves to the connected wallet information, or null if connection fails.
 */
export async function connectWallet(): Promise<ConnectedWallet | null> {
    // Check if the browser has an Ethereum-compatible wallet installed
    if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask or another Ethereum wallet.");
        return null;
    }

    try {
        // Create a new provider using the browser's wallet
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Request account access from the user
        await provider.send("eth_requestAccounts", []);
        
        // Get the signer (the user's account)
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        console.log("Wallet connected:", address);

        return {
            address,
            provider,
            signer,
        };
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Failed to connect wallet. Please check the console for details.");
        return null;
    }
} 