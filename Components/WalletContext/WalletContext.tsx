import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { getWalletAdapters } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { FC, ReactNode, useMemo } from "react";

export const WalletContext: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const network =
    process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
      ? WalletAdapterNetwork.Mainnet
      : WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => getWalletAdapters({ network }), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
