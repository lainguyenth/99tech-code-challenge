export type TokenPrice = {
  currency: string;
  price: number;
  date: string;
}

export type TokenCurrency = {
  symbol: string;
  imageName: string;
  price: number;
}

export type PriceMap = Record<string, number>;

export type ExchangeTokenPrice = {
  pricesMap: PriceMap;
  tokens: TokenCurrency[];
}
