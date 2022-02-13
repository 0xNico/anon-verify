
export interface AnonApi {
  getAnonByTokenId(tokenId: string): string|null
  getAnonsByTokenIds(tokenIds: string[]): string[]
}

type AnonApiProps = {
  utilsBaseUrl: string
}

type AnonHash = {
  [key: string]: string
}

export class AnonService implements AnonApi {
  private anonHash: AnonHash;

  private constructor(anonHash: AnonHash) {
    this.anonHash = anonHash;
  }

  public static async create({ utilsBaseUrl }: AnonApiProps) {
    const url = `${utilsBaseUrl}/hashlist`;
    const response = await fetch(url);
    const json = await response.json();
    let anonHash: AnonHash = {}
    for (let anon of json) {
      anonHash[anon] = anon;
    }
    return new AnonService(anonHash);
  }

  getAnonByTokenId(tokenId: string): string | null {
    return tokenId in this.anonHash ? tokenId : null;
  }

  getAnonsByTokenIds(tokenIds: string[]): string[] {
    const anons = tokenIds.filter(tokenId => tokenId in this.anonHash);
    return anons;
  }
}

