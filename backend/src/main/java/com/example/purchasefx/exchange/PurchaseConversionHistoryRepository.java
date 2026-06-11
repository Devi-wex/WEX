package com.example.purchasefx.exchange;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PurchaseConversionHistoryRepository extends JpaRepository<PurchaseConversionHistory, UUID> {
    List<PurchaseConversionHistory> findByTransactionIdOrderByCreatedAtDesc(UUID transactionId);
}
