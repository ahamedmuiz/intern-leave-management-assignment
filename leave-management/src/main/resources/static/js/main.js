const API_URL = 'http://localhost:8080/api';


function switchTab(tabId, btnElement) {

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');


    if(tabId === 'employeeTab' || tabId === 'leaveTab') fetchEmployees();
    if(tabId === 'adminTab') fetchLeaves();
}


document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();
    fetchLeaves();


    const today = new Date().toISOString().split('T')[0];
    const startInput = document.getElementById('leaveStart');
    const endInput = document.getElementById('leaveEnd');

    startInput.setAttribute('min', today);
    endInput.setAttribute('min', today);


    startInput.addEventListener('change', function() {
        endInput.setAttribute('min', this.value);
        if (endInput.value && endInput.value < this.value) {
            endInput.value = this.value;
        }
    });
});

// --- Employee Management ---
async function fetchEmployees() {
    try {
        const response = await fetch(`${API_URL}/employees`);
        const employees = await response.json();

        const tbody = document.querySelector('#employeeTable tbody');
        const select = document.getElementById('leaveEmployeeId');

        tbody.innerHTML = '';
        select.innerHTML = '<option value="">-- Choose Employee --</option>';

        employees.forEach(emp => {

            tbody.innerHTML += `
                <tr>
                    <td><strong>#${emp.id}</strong></td>
                    <td>${emp.name}</td>
                    <td>${emp.email}</td>
                    <td><span style="color:var(--primary-light); font-weight:600;">${emp.department}</span></td>
                </tr>
            `;

            select.innerHTML += `<option value="${emp.id}">${emp.name} (${emp.department})</option>`;
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

document.getElementById('employeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById('employeeMessage');

    const payload = {
        name: document.getElementById('empName').value,
        email: document.getElementById('empEmail').value,
        department: document.getElementById('empDept').value
    };

    try {
        const response = await fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            messageDiv.innerHTML = '<span class="success">✓ Employee registered successfully.</span>';
            document.getElementById('employeeForm').reset();
            fetchEmployees();
        } else {
            const err = await response.json();
            messageDiv.innerHTML = `<span class="error">Error: ${Object.values(err).join(', ')}</span>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<span class="error">Network connection failed.</span>';
    }


    setTimeout(() => messageDiv.innerHTML = '', 3000);
});

// --- Leave Management ---
async function fetchLeaves() {
    try {
        const response = await fetch(`${API_URL}/leaves`);
        const leaves = await response.json();
        const tbody = document.querySelector('#leaveTable tbody');
        tbody.innerHTML = '';

        leaves.forEach(leave => {
            let actions = '';
            if (leave.status === 'PENDING') {
                actions = `
                    <button class="btn-approve" onclick="approveLeave(${leave.id})">Approve</button>
                    <button class="btn-reject" onclick="rejectLeave(${leave.id})">Reject</button>
                `;
            } else if (leave.status === 'REJECTED') {
                actions = `<div style="font-size:0.85rem; color:var(--danger); font-weight:600;">Reason: ${leave.rejectionReason}</div>`;
            } else {
                actions = `<span style="color:var(--success); font-weight:600;">✓ Processed</span>`;
            }


            tbody.innerHTML += `
                <tr>
                    <td><strong>#REQ-${leave.id}</strong></td>
                    <td>${leave.employee.name}</td>
                    <td><strong>${leave.leaveType}</strong></td>
                    <td>${leave.startDate} <br><small style="color:var(--text-muted)">to</small> ${leave.endDate}</td>
                    <td>${leave.reason}</td>
                    <td><span class="badge status-${leave.status}">${leave.status}</span></td>
                    <td>${actions}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error fetching leaves:', error);
    }
}

document.getElementById('leaveForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById('leaveMessage');

    const payload = {
        employeeId: document.getElementById('leaveEmployeeId').value,
        leaveType: document.getElementById('leaveType').value,
        startDate: document.getElementById('leaveStart').value,
        endDate: document.getElementById('leaveEnd').value,
        reason: document.getElementById('leaveReason').value
    };

    try {
        const response = await fetch(`${API_URL}/leaves`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            messageDiv.innerHTML = '<span class="success">✓ Leave request submitted successfully.</span>';
            document.getElementById('leaveForm').reset();
            fetchLeaves();
        } else {
            const err = await response.json();
            const errorText = err.error || Object.values(err).join(', ');
            messageDiv.innerHTML = `<span class="error">Error: ${errorText}</span>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<span class="error">Network connection failed.</span>';
    }

    setTimeout(() => messageDiv.innerHTML = '', 4000);
});

// --- Administrator Actions ---
async function approveLeave(id) {
    if (confirm('Approve this leave request?')) {
        await fetch(`${API_URL}/leaves/${id}/approve`, { method: 'PATCH' });
        fetchLeaves(); // Refresh the table
    }
}

async function rejectLeave(id) {

    const reason = prompt('Please specify the reason for rejection:');
    if (reason === null || reason.trim() === '') {
        alert('A rejection reason is mandatory.');
        return;
    }

    await fetch(`${API_URL}/leaves/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: reason })
    });
    fetchLeaves();
}