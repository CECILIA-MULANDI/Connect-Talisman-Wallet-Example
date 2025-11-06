# Talisman Wallet Integration Guide

Quick guide to integrate Talisman wallet into your project.

## Installation

```bash
npm install @talismn/connect-wallets
```

## Basic Usage

```typescript
import { getWallets } from "@talismn/connect-wallets";

async function connectTalisman() {
  // Get all available wallets
  const installedWallets = getWallets().filter((wallet) => wallet.installed);

  // Find Talisman wallet
  const talismanWallet = installedWallets.find(
    (wallet) => wallet.extensionName === "talisman"
  );

  if (!talismanWallet) {
    throw new Error("Talisman wallet not found. Please install it first.");
  }

  // Enable the wallet (triggers authorization popup)
  await talismanWallet.enable("YourAppName");

  // Subscribe to accounts
  await talismanWallet.subscribeAccounts((accounts) => {
    console.log("Connected accounts:", accounts);
    // Handle accounts update
  });
}
```

## Requirements

- Users must have the [Talisman browser extension](https://talisman.xyz) installed
- The wallet must be authorized by the user when `enable()` is called

## Example

See `talisman-wallet-app/src/App.tsx` for a complete React implementation example.
