import '@/styles/global.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic';
import {ReactNode} from 'react'
const WalletContextProvider = dynamic<{ children: ReactNode }>(
  () =>
    import("../Components/WalletContext/WalletContext").then(
      ({ WalletContext }) => WalletContext
    ),
  {
    ssr: false,
  }
);
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}
