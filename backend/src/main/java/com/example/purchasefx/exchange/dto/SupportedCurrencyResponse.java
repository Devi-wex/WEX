package com.example.purchasefx.exchange.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SupportedCurrencyResponse {
    private String country;
    private String currency;
    private BigDecimal latestExchangeRate;
    private LocalDate latestExchangeRateDate;

    public SupportedCurrencyResponse(String country, String currency, BigDecimal latestExchangeRate, LocalDate latestExchangeRateDate) {
        this.country = country;
        this.currency = currency;
        this.latestExchangeRate = latestExchangeRate;
        this.latestExchangeRateDate = latestExchangeRateDate;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getLatestExchangeRate() {
        return latestExchangeRate;
    }

    public void setLatestExchangeRate(BigDecimal latestExchangeRate) {
        this.latestExchangeRate = latestExchangeRate;
    }

    public LocalDate getLatestExchangeRateDate() {
        return latestExchangeRateDate;
    }

    public void setLatestExchangeRateDate(LocalDate latestExchangeRateDate) {
        this.latestExchangeRateDate = latestExchangeRateDate;
    }
}
