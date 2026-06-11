package com.example.purchasefx.transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PurchaseTransactionRepository extends JpaRepository<PurchaseTransaction, UUID> {

    @Query("SELECT t FROM PurchaseTransaction t WHERE " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.nickname) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<PurchaseTransaction> search(@Param("search") String search, Pageable pageable);
}
