import {fetchPrices} from "../apis/fetch-prices";
import {EXCEPTION_IMAGE_MAP} from "../constants";
import {ExchangeTokenPrice, PriceMap} from "../types";

export const fetchPricesService = async (): Promise<ExchangeTokenPrice> => {
  const data = await fetchPrices();

  const pricesMap = data.reduce((acc, item): PriceMap => {
    acc[item.currency] = item.price;
    return acc;
  }, {});

  // Create a list of available tokens with full names (example for some)
  const tokens = data.map(item => ({
    imageName: EXCEPTION_IMAGE_MAP[item.currency] || item.currency,
    symbol: item.currency,
    price: item.price,

  })).filter(token => token.price !== undefined); // Only keep tokens that have a price

  return {pricesMap, tokens};
};