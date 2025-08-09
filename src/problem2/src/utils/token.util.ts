// Function to calculate `toAmount`
import { PriceMap } from '../types';

type CalculateToAmountParams = {
  prices: PriceMap;
  fromAmount: string;
  fromCurrencySymbol: string | undefined;
  toCurrencySymbol: string | undefined;
};

export const calculateToAmount = ({
  prices,
  fromAmount,
  fromCurrencySymbol,
  toCurrencySymbol,
}: CalculateToAmountParams): string => {
  if (
    fromAmount === '' ||
    isNaN(Number(fromAmount)) ||
    parseFloat(fromAmount) <= 0 ||
    !fromCurrencySymbol ||
    !toCurrencySymbol ||
    !prices[fromCurrencySymbol] ||
    !prices[toCurrencySymbol]
  ) {
    return '';
  }

  const amount = parseFloat(fromAmount);
  const fromPrice = prices[fromCurrencySymbol];
  const toPrice = prices[toCurrencySymbol];

  if (fromPrice && toPrice) {
    const rate = fromPrice / toPrice;
    return (amount * rate).toFixed(6); // Round to 6 decimal places
  } else {
    return '';
  }
};
