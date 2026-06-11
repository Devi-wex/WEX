package com.example.purchasefx.exchange.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class ConversionResponse {
    private UUID transactionId;
    private String nickname;
    private String description;
    private LocalDate transactionDate;
    private BigDecimal purchaseAmountUsd;
    
    private String targetCountry;
    private String targetCurrency;
    private BigDecimal exchangeRate;
    private LocalDate exchangeRateDate;
    private BigDecimal convertedAmount;
    
    private long rateAgeDays;
    private String rateWindowStatus;

    public UUID getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(UUID transactionId) {
        this.transactionId = transactionId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public BigDecimal getPurchaseAmountUsd() {
        return purchaseAmountUsd;
    }

    public void setPurchaseAmountUsd(BigDecimal purchaseAmountUsd) {
        this.purchaseAmountUsd = purchaseAmountUsd;
    }

    public String getTargetCountry() {
        return targetCountry;
    }

    public void setTargetCountry(String targetCountry) {
        this.targetCountry = targetCountry;
    }

    public String getTargetCurrency() {
        return targetCurrency;
    }

    public void setTargetCurrency(String targetCurrency) {
        this.targetCurrency = targetCurrency;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public LocalDate getExchangeRateDate() {
        return exchangeRateDate;
    }

    public void setExchangeRateDate(LocalDate exchangeRateDate) {
        this.exchangeRateDate = exchangeRateDate;
    }

    public BigDecimal getConvertedAmount() {
        return convertedAmount;
    }

    public void setConvertedAmount(BigDecimal convertedAmount) {
        this.convertedAmount = convertedAmount;
    }

    public long getRateAgeDays() {
        return rateAgeDays;
    }

    public void setRateAgeDays(long rateAgeDays) {
        this.rateAgeDays = rateAgeDays;
    }

    public String getRateWindowStatus() {
        return rateWindowStatus;
    }

    public void setRateWindowStatus(String rateWindowStatus) {
        this.rateWindowStatus = rateWindowStatus;
    }
}
