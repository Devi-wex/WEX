package com.example.purchasefx.exchange;

import com.example.purchasefx.common.exception.ResourceNotFoundException;
import com.example.purchasefx.exchange.dto.ConversionResponse;
import com.example.purchasefx.exchange.dto.TreasuryApiResponse;
import com.example.purchasefx.transaction.PurchaseTransaction;
import com.example.purchasefx.transaction.PurchaseTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class ConversionService {

    private final PurchaseTransactionRepository transactionRepository;
    private final ExchangeRateService exchangeRateService;
    private final PurchaseConversionHistoryRepository historyRepository;

    public ConversionService(PurchaseTransactionRepository transactionRepository,
                             ExchangeRateService exchangeRateService,
                             PurchaseConversionHistoryRepository historyRepository) {
        this.transactionRepository = transactionRepository;
        this.exchangeRateService = exchangeRateService;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public ConversionResponse convertTransaction(UUID transactionId, String targetCountry, String targetCurrency) {
        // 1. Fetch Transaction
        PurchaseTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        // 2. Fetch Best Rate
        TreasuryApiResponse.TreasuryRateData bestRateData = exchangeRateService.getBestValidRate(
                targetCountry, targetCurrency, transaction.getTransactionDate());

        // 3. Perform Conversion
        var convertedAmount = transaction.getPurchaseAmountUsd()
                .multiply(bestRateData.getExchangeRate())
                .setScale(2, RoundingMode.HALF_UP);

        // 4. Save History
        PurchaseConversionHistory history = new PurchaseConversionHistory();
        history.setTransaction(transaction);
        history.setTargetCountry(bestRateData.getCountry());
        history.setTargetCurrency(bestRateData.getCurrency());
        history.setExchangeRate(bestRateData.getExchangeRate());
        history.setExchangeRateDate(bestRateData.getRecordDate());
        history.setConvertedAmount(convertedAmount);
        history.setStatus("SUCCESS");
        historyRepository.save(history);

        // 5. Build Response
        ConversionResponse response = new ConversionResponse();
        response.setTransactionId(transaction.getId());
        response.setNickname(transaction.getNickname());
        response.setDescription(transaction.getDescription());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setPurchaseAmountUsd(transaction.getPurchaseAmountUsd());
        response.setTargetCountry(bestRateData.getCountry());
        response.setTargetCurrency(bestRateData.getCurrency());
        response.setExchangeRate(bestRateData.getExchangeRate());
        response.setExchangeRateDate(bestRateData.getRecordDate());
        response.setConvertedAmount(convertedAmount);
        
        long rateAgeDays = ChronoUnit.DAYS.between(bestRateData.getRecordDate(), transaction.getTransactionDate());
        response.setRateAgeDays(rateAgeDays);
        response.setRateWindowStatus("VALID_WITHIN_SIX_MONTHS"); // Since we queried within 6 months, it's valid.

        return response;
    }
}
