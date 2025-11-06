import { useState } from "react";
import { getWallets } from "@talismn/connect-wallets";
import "./App.css";

interface Account {
  address: string;
  name?: string;
  source: string;
}

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>("");

  async function connectWallet() {
    try {
      setError("");
      const installedWallets = getWallets().filter(
        (wallet) => wallet.installed
      );

      const talismanWallet = installedWallets.find(
        (wallet) => wallet.extensionName === "talisman"
      );

      if (!talismanWallet) {
        setError("Talisman wallet not found. Please install it first.");
        return;
      }

      // Enable the wallet - this will trigger the authorization popup
      await talismanWallet.enable("myCoolDapp");

      // Subscribe to accounts after authorization
      await talismanWallet.subscribeAccounts((accounts) => {
        console.log("got accounts", accounts);
        if (accounts && accounts.length > 0) {
          setAccounts(accounts);
          setIsConnected(true);
        }
      });
    } catch (err: any) {
      console.error("Connection error:", err);
      if (err.message?.includes("not been authorised")) {
        setError("Please authorize this site in your Talisman wallet popup.");
      } else if (err.message?.includes("User rejected")) {
        setError(
          "Connection rejected. Please try again and approve the connection."
        );
      } else {
        setError(err.message || "Failed to connect to Talisman wallet.");
      }
    }
  }

  return (
    <div className="app">
      <h1>Talisman Wallet Integration</h1>
      <button onClick={connectWallet} disabled={isConnected}>
        {isConnected ? "Connected ✓" : "Connect Wallet"}
      </button>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="accounts">
          <h2>Connected Accounts:</h2>
          {accounts.map((account, index) => (
            <div key={index} className="account">
              <p>
                <strong>{account.name || "Account"}</strong>
              </p>
              <p className="address">{account.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
