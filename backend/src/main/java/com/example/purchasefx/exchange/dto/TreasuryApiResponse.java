package com.example.purchasefx.exchange.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TreasuryApiResponse {
    private List<TreasuryRateData> data;

    public List<TreasuryRateData> getData() {
        return data;
    }

    public void setData(List<TreasuryRateData> data) {
        this.data = data;
    }

    public static class TreasuryRateData {
        @JsonProperty("record_date")
        private LocalDate recordDate;
        
        private String country;
        private String currency;
        
        @JsonProperty("exchange_rate")
        private BigDecimal exchangeRate;
        
        @JsonProperty("effective_date")
        private LocalDate effectiveDate;

        public LocalDate getRecordDate() {
            return recordDate;
        }

        public void setRecordDate(LocalDate recordDate) {
            this.recordDate = recordDate;
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

        public BigDecimal getExchangeRate() {
            return exchangeRate;
        }

        public void setExchangeRate(BigDecimal exchangeRate) {
            this.exchangeRate = exchangeRate;
        }

        public LocalDate getEffectiveDate() {
            return effectiveDate;
        }

        public void setEffectiveDate(LocalDate effectiveDate) {
            this.effectiveDate = effectiveDate;
        }
    }
}
