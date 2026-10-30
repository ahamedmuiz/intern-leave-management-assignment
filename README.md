# Employee Leave Management System

A full-stack web application developed for the Omibits Software Engineering Intern Technical Assignment. It allows employees to submit leave requests and administrators to review and manage them.

## Technology Stack
* **Backend:** Java 17, Spring Boot 3
* **Database:** MySQL, Spring Data JPA (Hibernate)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Build Tool:** Maven

---

## Application Screenshots

### Frontend Interface
The application features a modern, tab-based UI separated into three core functional areas.

**1. Employee Directory**
<br>
<img width="100%" alt="Employee Directory" src="https://github.com/user-attachments/assets/9f5603bb-e151-44f0-9a26-087179b551fb" />

**2. Submit Leave Request**
<br>
<img width="100%" alt="Submit Leave Request" src="https://github.com/user-attachments/assets/f4e34ecb-8160-49c9-881a-ff7f57d2a002" />

**3. Administrator Dashboard**
<br>
<img width="100%" alt="Administrator Dashboard" src="https://github.com/user-attachments/assets/6eda3503-8d45-4c8e-a703-ed823c3c5d94" />

### Backend API Testing
REST API endpoints tested successfully using Postman.

<img width="100%" alt="Postman API Test 1" src="https://github.com/user-attachments/assets/855f1a10-6790-431f-b765-b909d1237e6e" />
<br>
<img width="100%" alt="Postman API Test 2" src="https://github.com/user-attachments/assets/baec72d3-315d-4aac-9479-2812f44ed9e7" />
<br>
<img width="100%" alt="Postman API Test 3" src="https://github.com/user-attachments/assets/5f8b0ec7-0665-4b29-8563-d901a563042c" />

---

## Setup and Execution Instructions

**1. Database Configuration:**
* Install MySQL and create a database named `leave_management_db`.
* Update the `application.properties` file with your MySQL username and password.

**2. Running the Application:**
* Open a terminal in the project root directory.
* Run the command: `./mvnw spring-boot:run`
* The application will start on port 8080. Hibernate will automatically generate the required database tables.

**3. Accessing the Portal:**
* Open a web browser and navigate to `http://localhost:8080`.

---

## API Endpoints

* `POST /api/employees` - Create a new employee
* `GET /api/employees` - Retrieve all employees
* `POST /api/leaves` - Submit a new leave request
* `GET /api/leaves` - Retrieve all leave requests
* `PATCH /api/leaves/{id}/approve` - Approve a leave request
* `PATCH /api/leaves/{id}/reject` - Reject a leave request (requires `rejectionReason` in JSON body)

---

## Design Decisions & Challenges

* **Architecture:** Adopted a layered backend architecture (Controller, Service, Repository, Entity, DTO) to strictly separate business logic from database access and API routing.
* **Validation:** Implemented dual-layer validation. The frontend uses HTML5 attributes (like minimum dates) to prevent bad inputs, while the backend uses Spring Validation (`@Valid`) and custom service logic to enforce business rules globally.
* **Error Handling:** Created a `@RestControllerAdvice` global exception handler to intercept validation failures and return structured, meaningful error messages to the frontend client.
