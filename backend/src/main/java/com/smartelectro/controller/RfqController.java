package com.smartelectro.controller;

import com.smartelectro.model.RfqRequest;
import com.smartelectro.service.RfqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rfq")
@RequiredArgsConstructor
public class RfqController {

    private final RfqService rfqService;

    @PostMapping
    public ResponseEntity<RfqRequest> create(@RequestBody RfqRequest rfq) {
        return ResponseEntity.ok(rfqService.create(rfq));
    }

    @GetMapping("/my")
    public ResponseEntity<List<RfqRequest>> getMyRfqs() {
        return ResponseEntity.ok(rfqService.getMyRfqs());
    }

    @GetMapping("/open")
    public ResponseEntity<List<RfqRequest>> getOpen() {
        return ResponseEntity.ok(rfqService.getOpenRfqs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RfqRequest> getById(@PathVariable Long id) {
        return ResponseEntity.ok(rfqService.getById(id));
    }
}
