import {useQuery} from "@tanstack/react-query";
import {fetchPricesService} from "../services";

export const useExchangeRateQuery = () => {
  // Use useQuery to fetch token prices
  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['tokenPrices'],
    queryFn: fetchPricesService,
    retry: 3,
  });

  return { data, isLoading, isError, queryError };

};