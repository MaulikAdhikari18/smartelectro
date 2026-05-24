package com.smartelectro.service;

import com.smartelectro.model.RfqRequest;
import com.smartelectro.model.User;
import com.smartelectro.repository.RfqRepository;
import com.smartelectro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RfqService {

    private final RfqRepository rfqRepository;
    private final UserRepository userRepository;

    public RfqRequest create(RfqRequest rfq) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        rfq.setBuyer(buyer);
        return rfqRepository.save(rfq);
    }

    public List<RfqRequest> getMyRfqs() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return rfqRepository.findByBuyerId(buyer.getId());
    }

    public List<RfqRequest> getOpenRfqs() {
        return rfqRepository.findByStatus(RfqRequest.RfqStatus.OPEN);
    }

    public RfqRequest getById(Long id) {
        return rfqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RFQ not found"));
    }
}
