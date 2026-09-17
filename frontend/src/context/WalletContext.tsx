import { createContext, useContext, useMemo, useState } from "react";
import {
  ensureTokenAccount,
  getPhantom,
  signAndSendBase64,
} from "../lib/solana";
import { useAuth } from "./AuthContext";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const { user, linkWallet } = useAuth();
  const [publicKey, setPublicKey] = useState(user?.walletAddress || null);
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    try {
      const phantom = getPhantom();
      const response = await phantom.connect();
      const address = response.publicKey.toBase58();
      const tokenAccount = await ensureTokenAccount(address);
      setPublicKey(address);
      if (user) {
        await linkWallet(address, tokenAccount);
      }
      return { address, tokenAccount };
    } finally {
      setConnecting(false);
    }
  };

  const ensureReady = async () => {
    const address = publicKey || user?.walletAddress;
    if (address && user?.tokenAccount) {
      return { address, tokenAccount: user.tokenAccount };
    }
    return connect();
  };

  const signAndSend = async (transactionBase64) => {
    await ensureReady();
    return signAndSendBase64(transactionBase64);
  };

  const value = useMemo(
    () => ({
      publicKey: publicKey || user?.walletAddress || null,
      tokenAccount: user?.tokenAccount || null,
      connecting,
      connected: Boolean(publicKey || user?.walletAddress),
      connect,
      ensureReady,
      signAndSend,
    }),
    [publicKey, user, connecting],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return context;
}
