package com.smartelectro.repository;

import com.smartelectro.model.RfqRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RfqRepository extends JpaRepository<RfqRequest, Long> {
    List<RfqRequest> findByBuyerId(Long buyerId);
    List<RfqRequest> findByStatus(RfqRequest.RfqStatus status);
    List<RfqRequest> findByCategoryId(Long categoryId);
}
