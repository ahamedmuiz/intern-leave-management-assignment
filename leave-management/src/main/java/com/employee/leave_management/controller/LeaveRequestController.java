package com.employee.leave_management.controller;

import com.employee.leave_management.dto.LeaveRequestDto;
import com.employee.leave_management.entity.LeaveRequest;
import com.employee.leave_management.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> submitLeaveRequest(@Valid @RequestBody LeaveRequestDto dto) {
        return new ResponseEntity<>(leaveRequestService.submitLeaveRequest(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<LeaveRequest> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.approveRequest(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<LeaveRequest> rejectRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        String reason = payload.get("rejectionReason");
        return ResponseEntity.ok(leaveRequestService.rejectRequest(id, reason));
    }
}