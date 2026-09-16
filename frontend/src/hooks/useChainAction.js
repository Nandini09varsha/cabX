import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { apiError } from "../lib/format";

export function useChainAction() {
  const { signAndSend, ensureReady } = useWallet();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (buildRequest, confirmRequest) => {
    setBusy(true);
    setError("");
    try {
      await ensureReady();
      const built = await buildRequest();
      if (!built?.transaction) {
        throw new Error(built?.message || "Server did not return a transaction");
      }
      const signature = await signAndSend(built.transaction);
      const confirmed = confirmRequest
        ? await confirmRequest(signature, built)
        : { signature };
      return { built, signature, confirmed };
    } catch (err) {
      const message = apiError(err);
      setError(message);
      throw err;
    } finally {
      setBusy(false);
    }
  };

  return { run, busy, error, setError };
}
