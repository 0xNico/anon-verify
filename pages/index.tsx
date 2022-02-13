import styles from "@/pages/index.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnonCard } from "Components/AnonCard";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAsync } from "react-use";
import { AnonApi, AnonService } from "../services/anonService";
import { WalletService } from "../services/walletService";

const Home: NextPage = () => {
  const { publicKey } = useWallet();
  const walletKey = publicKey?.toString();
  const [anonService, setAnonService] = useState<AnonApi>();
  const [searchAnon, setSearchAnon] = useState<string>("");
  const [search, setSearch] = useState<boolean>(false);
  const utilsBaseUrl =
    process.env.NEXT_PUBLIC_ANON_UTILS_BASE_URL || "http://localhost:3000";
  const walletService = new WalletService(
    process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
  );

  const { loading, error, value } = useAsync(async () => {
    if (walletKey) {
      const anonService = await AnonService.create({ utilsBaseUrl });
      setAnonService(anonService);

      const tokens = await walletService.getWalletTokenAddresses(walletKey);
      const anons = anonService!.getAnonsByTokenIds(tokens);
      return await Promise.all(
        anons.map(async (anon) => {
          return await getAnon(anon);
        })
      );
    }
  }, [walletKey]);

  const asyncSearch = useAsync(async () => {
    if (anonService && search) {
      const anon = anonService.getAnonByTokenId(searchAnon);
      let result = null;
      if (anon) {
        result = await getAnon(anon);
      }
      return result;
    }
  }, [search]);

  const getAnon = async (tokenId: string) => {
    const metadata = await walletService.getTokenMetadata(tokenId);
    const anonMetadata = await fetch(metadata!.data.data.uri);
    return await anonMetadata.json();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>888 verify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>888 - verify</h1>

        <div className={styles.connectButton}>
          <WalletMultiButton />
        </div>

        <p className={styles.description}>{loading && "loading..."}</p>
        {error && <div>{error.message}</div>}
        {value && value.length > 0 && (
          <>
            <h2 className={styles.yours}>Your anons</h2>
            <div className={styles.grid}>
              {value.map((anon) => {
                console.log({ anon });
                return (
                  <AnonCard key={anon.id} image={anon.image} name={anon.name} />
                );
              })}
            </div>
          </>
        )}

        {value && value.length === 0 && (
          <>
            <h2 className={styles.yours}>
              No anon found in your wallet, please search by token id
            </h2>

            <div className={styles.grid}>
              <input
                className={styles.input}
                name="searchAnon"
                type="text"
                onChange={(e) => {
                  setSearch(false);
                  setSearchAnon(e.target.value);
                }}
                placeholder="token id"
              />
              <button
                className={styles.button}
                onClick={() => {
                  console.log({ search });
                  setSearch(true);
                }}
              >
                Search
              </button>
            </div>

            <div className={styles.grid}>
              {asyncSearch.error && <div>{asyncSearch.error.message}</div>}
              {asyncSearch.loading && <div>loading...</div>}

              {search && asyncSearch.value && (
                <AnonCard
                  image={asyncSearch.value.image}
                  name={asyncSearch.value.name}
                />
              )}

              {search && !asyncSearch.loading && !asyncSearch.value && (
                <div>No anon found</div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
