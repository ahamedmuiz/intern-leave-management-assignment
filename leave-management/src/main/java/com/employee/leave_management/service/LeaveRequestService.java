package com.employee.leave_management.service;

import com.employee.leave_management.dto.LeaveRequestDto;
import com.employee.leave_management.entity.Employee;
import com.employee.leave_management.entity.LeaveRequest;
import com.employee.leave_management.entity.LeaveStatus;
import com.employee.leave_management.entity.LeaveType;
import com.employee.leave_management.repository.EmployeeRepository;
import com.employee.leave_management.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository, EmployeeRepository employeeRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    public LeaveRequest submitLeaveRequest(LeaveRequestDto dto) {

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found."));

        LeaveRequest request = new LeaveRequest();
        request.setEmployee(employee);
        request.setLeaveType(LeaveType.valueOf(dto.getLeaveType().toUpperCase()));
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate());
        request.setReason(dto.getReason());
        request.setStatus(LeaveStatus.PENDING);

        return leaveRequestRepository.save(request);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest approveRequest(Long id) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));

        request.setStatus(LeaveStatus.APPROVED);
        return leaveRequestRepository.save(request);
    }

    public LeaveRequest rejectRequest(Long id, String rejectionReason) {

        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new IllegalArgumentException("A rejection reason is required.");
        }

        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));

        request.setStatus(LeaveStatus.REJECTED);
        request.setRejectionReason(rejectionReason);
        return leaveRequestRepository.save(request);
    }
}