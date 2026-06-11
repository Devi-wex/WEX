package com.example.purchasefx.exchange;

import com.example.purchasefx.exchange.dto.ConversionResponse;
import com.example.purchasefx.exchange.dto.SupportedCurrencyResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows local development from Vite
public class ConversionController {

    private final ConversionService conversionService;
    private final ExchangeRateService exchangeRateService;

    public ConversionController(ConversionService conversionService, ExchangeRateService exchangeRateService) {
        this.conversionService = conversionService;
        this.exchangeRateService = exchangeRateService;
    }

    @GetMapping("/transactions/{id}/conversion")
    public ConversionResponse convertTransaction(
            @PathVariable UUID id,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String currency) {
        
        if (country == null && currency == null) {
            throw new IllegalArgumentException("Either 'country' or 'currency' parameter must be provided");
        }
        
        return conversionService.convertTransaction(id, country, currency);
    }

    @GetMapping("/currencies")
    public List<SupportedCurrencyResponse> getSupportedCurrencies() {
        return exchangeRateService.getSupportedCurrencies();
    }
}
