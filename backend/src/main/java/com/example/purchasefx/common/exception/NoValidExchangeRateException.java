package com.example.purchasefx.common.exception;

public class NoValidExchangeRateException extends RuntimeException {
    public NoValidExchangeRateException(String message) {
        super(message);
    }
}
