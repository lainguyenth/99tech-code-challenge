import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { ChevronDown, RefreshCcw, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { TOKEN_ICON_BASE_URL } from '../constants';
import { useExchangeRateQuery } from '../hooks';
import { TokenCurrency } from '../types';
import { calculateToAmount } from '../utils';

export const ExchangeRateForm = () => {
  // State for the selected currencies for swapping
  const [fromCurrency, setFromCurrency] = useState<TokenCurrency | undefined>();
  const [toCurrency, setToCurrency] = useState<TokenCurrency | undefined>();
  // State for the amounts to swap
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  // State for UI statuses
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Refs for input fields
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const { data, isLoading, isError, queryError } = useExchangeRateQuery();

  const prices = data?.pricesMap || {};
  const availableTokens = data?.tokens || [];

  // Set default currencies when data is loaded
  useEffect(() => {
    if (!isLoading && availableTokens.length > 0 && !fromCurrency) {
      setFromCurrency(availableTokens[0]);
      if (availableTokens.length > 1) {
        setToCurrency(availableTokens[1]);
      } else {
        setToCurrency(availableTokens[0]);
      }
    }
  }, [isLoading, availableTokens, fromCurrency]);

  // Effect to recalculate `toAmount` when `fromAmount`, `fromCurrency`, or `toCurrency` changes
  useEffect(() => {
    setToAmount(
      calculateToAmount({
        prices,
        fromCurrencySymbol: fromCurrency?.symbol,
        toCurrencySymbol: fromCurrency?.symbol,
        fromAmount: fromAmount,
      }),
    );
  }, [fromAmount, fromCurrency, toCurrency, prices]);

  // Handler for "From" amount change
  const handleFromAmountChange = React.useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Allow decimal numbers
      if (/^\d*\.?\d*$/.test(value) || value === '') {
        setFromAmount(value);
        setError(''); // Clear error when user starts typing
        setSuccessMessage(''); // Clear success message
      } else {
        setError('Please enter a valid number.');
      }
    },
    [setFromAmount, setError, setSuccessMessage],
  );

  // Handler for swapping currencies
  const handleSwapCurrencies = () => {
    const tempFrom = fromCurrency;
    const tempTo = toCurrency;
    const tempToAmount = toAmount; // Get current toAmount value

    setFromCurrency(tempTo);
    setToCurrency(tempFrom);
    // Swap amounts: previous toAmount becomes new fromAmount,
    // and previous fromAmount (which was calculated) becomes new toAmount
    setFromAmount(tempToAmount);
    setError('');
    setSuccessMessage('');
  };

  // Handler for form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fromCurrency || !toCurrency) {
      setError('Please select both currencies.');
      return;
    }
    if (fromCurrency.symbol === toCurrency.symbol) {
      setError('Cannot swap the same currency. Please select different currencies.');
      return;
    }
    if (fromAmount === '' || isNaN(Number(fromAmount)) || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount to swap.');
      return;
    }

    setIsSwapping(true);
    // Simulate backend request with a delay
    setTimeout(() => {
      setIsSwapping(false);
      setSuccessMessage(
        `Successfully swapped ${fromAmount} ${fromCurrency.symbol} for ${toAmount} ${toCurrency.symbol}!`,
      );
    }, 1000); // 1 second delay
  };

  // Render the UI
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-3xl opacity-60"></div>
        <h1 className="relative z-10 text-3xl font-extrabold text-center text-blue-700 mb-2 pt-4">
          Currency Exchange Rate Swap
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-blue-600">
            <Loader2 className="animate-spin mr-3" size={30} />
            <span className="text-lg font-medium">Loading token prices...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-xl relative mb-5 flex items-center text-center justify-center">
            <XCircle className="h-5 w-5 mr-2" />
            <span className="text-md">{queryError?.message || 'Could not load token prices. Please try again.'}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10">
            {/* FROM Section */}
            <div className="mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="fromAmount" className="text-sm font-medium text-gray-700">
                  From
                </label>
                {fromAmount && fromCurrency && prices[fromCurrency.symbol] && (
                  <span className="text-sm text-gray-600">
                    ${(parseFloat(fromAmount) * prices[fromCurrency.symbol]).toFixed(6)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src={fromCurrency ? `${TOKEN_ICON_BASE_URL}/${fromCurrency.symbol}.svg` : ''}
                  alt={fromCurrency ? `${fromCurrency.symbol} icon` : 'TokenCurrency icon'}
                  className="w-8 h-8 rounded-full border border-gray-100"
                  title={fromCurrency ? fromCurrency.symbol : ''}
                />
                <div className="relative flex-grow">
                  <select
                    value={fromCurrency ? fromCurrency.symbol : ''}
                    onChange={(e) => setFromCurrency(availableTokens.find((token) => token.symbol === e.target.value))}
                    className="block w-full pl-2 pr-8 py-2 text-md border border-gray-300 focus:outline-none focus:ring-blue-400 focus:border-blue-400 rounded-lg shadow-sm cursor-pointer bg-white font-semibold appearance-none text-black"
                  >
                    {availableTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <input
                  id="fromAmount"
                  ref={fromInputRef}
                  type="text"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.0"
                  className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-blue-400 focus:border-blue-400 text-md font-semibold text-gray-900 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-right bg-white"
                  inputMode="decimal"
                />
              </div>
              {fromCurrency && (
                <p className="mt-2 text-xs text-gray-500 text-right">
                  1 {fromCurrency.symbol} = ${prices[fromCurrency.symbol]?.toFixed(6) || 'N/A'}
                </p>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-4">
              <button
                type="button"
                onClick={handleSwapCurrencies}
                className="p-2 bg-blue-50 text-blue-500 rounded-full shadow-md hover:bg-blue-100 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center transform hover:scale-110"
                aria-label="Swap currencies"
              >
                <RefreshCcw className="h-5 w-5" />
              </button>
            </div>

            {/* TO Section */}
            <div className="mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="toAmount" className="text-sm font-medium text-gray-700">
                  To
                </label>
                {toAmount && toCurrency && prices[toCurrency.symbol] && (
                  <span className="text-sm text-gray-600">
                    ${(parseFloat(toAmount) * prices[toCurrency.symbol]).toFixed(6)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src={toCurrency ? `${TOKEN_ICON_BASE_URL}/${toCurrency.symbol}.svg` : ''}
                  alt={toCurrency ? `${toCurrency.symbol} icon` : 'TokenCurrency icon'}
                  className="w-8 h-8 rounded-full border border-gray-100"
                  title={toCurrency ? toCurrency.symbol : ''}
                />
                <div className="relative flex-grow">
                  <select
                    value={toCurrency ? toCurrency.symbol : ''}
                    onChange={(e) => setToCurrency(availableTokens.find((token) => token.symbol === e.target.value))}
                    className="block w-full pl-2 pr-8 py-2 text-md border border-gray-300 focus:outline-none focus:ring-green-400 focus:border-green-400 rounded-lg shadow-sm cursor-pointer bg-white font-semibold appearance-none text-black"
                  >
                    {availableTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <input
                  id="toAmount"
                  ref={toInputRef}
                  type="text"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  className="w-24 p-2 border border-gray-300 rounded-lg bg-white text-md font-semibold text-gray-900 cursor-not-allowed text-right"
                />
              </div>
              {toCurrency && (
                <p className="mt-2 text-xs text-gray-500 text-right">
                  1 {toCurrency.symbol} = ${prices[toCurrency.symbol]?.toFixed(6) || 'N/A'}
                </p>
              )}
            </div>

            {/* Exchange Rate */}
            {fromCurrency && toCurrency && prices[fromCurrency.symbol] && prices[toCurrency.symbol] && (
              <div className="text-center bg-blue-50 p-3 rounded-lg border border-blue-200 mb-6">
                <p className="text-sm text-gray-700 font-medium">
                  Exchange Rate:{' '}
                  <span className="text-blue-600 font-bold">
                    1 {fromCurrency.symbol} = {(prices[fromCurrency.symbol] / prices[toCurrency.symbol]).toFixed(6)}{' '}
                    {toCurrency.symbol}
                  </span>
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-xl relative mb-5 flex items-center text-center justify-center">
                <XCircle className="h-5 w-5 mr-2" />
                <span className="text-md">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-5 py-3 rounded-xl relative mb-5 flex items-center text-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-md">{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-lg font-bold rounded-xl shadow-lg text-white transition-all duration-300 ease-in-out transform hover:scale-105
                                ${isSwapping || isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              disabled={isSwapping || isLoading}
            >
              {isSwapping ? (
                <>
                  <Loader2 className="animate-spin mr-3" size={20} />
                  Swapping...
                </>
              ) : (
                'Swap'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
