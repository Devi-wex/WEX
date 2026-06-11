package com.example.purchasefx.transaction;

import com.example.purchasefx.common.dto.PageResponse;
import com.example.purchasefx.common.exception.ResourceNotFoundException;
import com.example.purchasefx.transaction.dto.CreateTransactionRequest;
import com.example.purchasefx.transaction.dto.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.RoundingMode;
import java.util.UUID;

@Service
public class TransactionService {

    private final PurchaseTransactionRepository repository;

    public TransactionService(PurchaseTransactionRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public TransactionResponse createTransaction(CreateTransactionRequest request) {
        PurchaseTransaction entity = new PurchaseTransaction();
        entity.setNickname(request.getNickname());
        entity.setDescription(request.getDescription());
        entity.setTransactionDate(request.getTransactionDate());
        
        // Ensure rounding to 2 decimal places using HALF_UP
        entity.setPurchaseAmountUsd(request.getPurchaseAmountUsd().setScale(2, RoundingMode.HALF_UP));

        PurchaseTransaction saved = repository.save(entity);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(UUID id) {
        PurchaseTransaction entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToResponse(entity);
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> getTransactions(String search, Pageable pageable) {
        Page<PurchaseTransaction> page;
        if (search != null && !search.trim().isEmpty()) {
            page = repository.search(search.trim(), pageable);
        } else {
            page = repository.findAll(pageable);
        }
        return new PageResponse<>(page.map(this::mapToResponse));
    }

    private TransactionResponse mapToResponse(PurchaseTransaction entity) {
        TransactionResponse response = new TransactionResponse();
        response.setId(entity.getId());
        response.setNickname(entity.getNickname());
        response.setDescription(entity.getDescription());
        response.setTransactionDate(entity.getTransactionDate());
        response.setPurchaseAmountUsd(entity.getPurchaseAmountUsd());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
}
