import {PRICES_API_URL} from "../constants";
import {TokenPrice} from "../types";

export const fetchPrices = async (): Promise<TokenPrice[]> => {
  const response = await fetch(PRICES_API_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json() as TokenPrice[];
};
