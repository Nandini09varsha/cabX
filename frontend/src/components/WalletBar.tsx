import { Wallet } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { shortAddress } from "../lib/format";
import { useState } from "react";

export default function WalletBar() {
  const { publicKey, connected, connecting, connect } = useWallet();
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setError("");
    try {
      await connect();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-[#2A2A2A] dark:bg-[#171717]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518]/20">
            <Wallet size={18} />
          </div>
          <div>
            <p className="text-sm font-bold">Solana wallet</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {connected
                ? shortAddress(publicKey)
                : "Link Phantom to sign on-chain ride and stake transactions"}
            </p>
          </div>
        </div>
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="rounded-xl bg-[#F5C518] px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
        >
          {connecting ? "Connecting..." : connected ? "Reconnect" : "Connect Phantom"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
