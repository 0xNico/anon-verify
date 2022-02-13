import { Account } from "@metaplex-foundation/mpl-core";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection } from "@metaplex/js";
import { PublicKey } from "@solana/web3.js";

const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export class WalletService {
  private connection: Connection;

  constructor(network: string) {
    this.connection = new Connection(network);
  }

  public async getWalletTokenAddresses(
    walletAddress: string
  ): Promise<string[]> {
    const publicKey = new PublicKey(walletAddress);
    const programId = new PublicKey(TOKEN_PROGRAM);
    const data = await this.connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId }
    );
    return data.value
      .filter(
        ({ account }) => account.data.parsed.info.tokenAmount.amount === "1"
      )
      .map(({ account }) => account.data.parsed.info.mint);
  }

  public async getTokenMetadata(
    tokenAddress: string
  ): Promise<Metadata | undefined> {
    const metadataPDA = await Metadata.getPDA(tokenAddress);
    const accountInfo = await this.connection.getAccountInfo(metadataPDA);
    if (!accountInfo) return;
    return Metadata.from(new Account(tokenAddress, accountInfo));
  }
}
