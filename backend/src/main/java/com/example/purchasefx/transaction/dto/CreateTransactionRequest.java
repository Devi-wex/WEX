package com.example.purchasefx.transaction.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateTransactionRequest {

    @Size(max = 40, message = "Nickname must not exceed 40 characters")
    private String nickname;

    @NotBlank(message = "Description is required")
    @Size(max = 50, message = "Description must not exceed 50 characters")
    private String description;

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;

    @NotNull(message = "Purchase amount is required")
    @DecimalMin(value = "0.01", message = "Purchase amount must be positive")
    private BigDecimal purchaseAmountUsd;

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
}
