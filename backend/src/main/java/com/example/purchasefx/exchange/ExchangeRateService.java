package com.example.purchasefx.exchange;

import com.example.purchasefx.common.exception.NoValidExchangeRateException;
import com.example.purchasefx.common.exception.ServiceUnavailableException;
import com.example.purchasefx.exchange.dto.SupportedCurrencyResponse;
import com.example.purchasefx.exchange.dto.TreasuryApiResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExchangeRateService {

    private final TreasuryExchangeClient treasuryClient;

    public ExchangeRateService(TreasuryExchangeClient treasuryClient) {
        this.treasuryClient = treasuryClient;
    }

    public TreasuryApiResponse.TreasuryRateData getBestValidRate(String targetCountry, String targetCurrency, LocalDate transactionDate) {
        LocalDate sixMonthsAgo = transactionDate.minusMonths(6);

        try {
            List<TreasuryApiResponse.TreasuryRateData> rates = treasuryClient.fetchRates(
                    targetCountry,
                    targetCurrency,
                    sixMonthsAgo.toString(),
                    transactionDate.toString()
            );

            if (rates == null || rates.isEmpty()) {
                throw new NoValidExchangeRateException(
                        "This purchase cannot be converted to the selected currency because no Treasury exchange rate is available within six months on or before the purchase date."
                );
            }

            // The API is requested to sort by -record_date, so the first one should be the latest within the range.
            // But to be absolutely safe against API changes, let's sort locally and pick the most recent one.
            return rates.stream()
                    .max(Comparator.comparing(TreasuryApiResponse.TreasuryRateData::getRecordDate))
                    .orElseThrow(() -> new NoValidExchangeRateException(
                            "This purchase cannot be converted to the selected currency because no Treasury exchange rate is available within six months on or before the purchase date."
                    ));

        } catch (NoValidExchangeRateException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceUnavailableException("Failed to fetch exchange rates from Treasury API.", e);
        }
    }

    public List<SupportedCurrencyResponse> getSupportedCurrencies() {
        try {
            List<TreasuryApiResponse.TreasuryRateData> latestRates = treasuryClient.fetchLatestRates();

            // Group by country and currency to get unique pairs, taking the latest rate for each
            Map<String, TreasuryApiResponse.TreasuryRateData> uniqueCurrencies = latestRates.stream()
                    .collect(Collectors.toMap(
                            rate -> rate.getCountry() + "|" + rate.getCurrency(),
                            rate -> rate,
                            (existing, replacement) -> existing.getRecordDate().isAfter(replacement.getRecordDate()) ? existing : replacement
                    ));

            return uniqueCurrencies.values().stream()
                    .map(rate -> new SupportedCurrencyResponse(
                            rate.getCountry(),
                            rate.getCurrency(),
                            rate.getExchangeRate(),
                            rate.getRecordDate()
                    ))
                    .sorted(Comparator.comparing(SupportedCurrencyResponse::getCountry))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new ServiceUnavailableException("Failed to fetch supported currencies from Treasury API.", e);
        }
    }
}
