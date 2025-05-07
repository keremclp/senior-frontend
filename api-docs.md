# API Documentation

## Authentication

### Register
- **POST** `/api/v1/auth/register`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "user": { "name": "string", "userId": "string" }
  }
  ```

---

### Login
- **POST** `/api/v1/auth/login`
- **Description:** Login with email and password.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "user": { "name": "string", "userId": "string" },
    "token": "jwt-token"
  }
  ```

---

### Logout
- **POST** `/api/v1/auth/logout`
- **Description:** Logout the current user (requires authentication).
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  ```json
  { "msg": "User logged out!" }
  ```

---

### Forgot Password
- **POST** `/api/v1/auth/forgot-password`
- **Description:** Request a password reset token.
- **Request Body:**
  ```json
  { "email": "string" }
  ```
- **Response:**
  ```json
  { "msg": "Password reset token sent", "resetToken": "string" }
  ```

---

### Reset Password
- **POST** `/api/v1/auth/reset-password/:token`
- **Description:** Reset password using the provided token.
- **Request Params:**
  - `token`: string (from email or response)
- **Request Body:**
  ```json
  { "password": "string" }
  ```
- **Response:**
  ```json
  { "msg": "Password reset successful" }
  ```

---

## Upload

### Import Advisors (Excel)
- **POST** `/api/v1/upload/`
- **Description:** Import advisors from an Excel file (admin only).
- **Form Data:**
  - `file`: Excel file (.xlsx)
- **Response:**
  ```json
  { "message": "Data imported successfully!" }
  ```

---

### Update Advisors' University (Excel)
- **POST** `/api/v1/upload/update-universities`
- **Description:** Update advisors' university info from Excel (admin only).
- **Form Data:**
  - `file`: Excel file (.xlsx) with `email` and `university` columns
- **Response:**
  ```json
  { "message": "Advisor universities updated successfully!", "modified": 1 }
  ```

---

### Upload Resume
- **POST** `/api/v1/upload/resume`
- **Description:** Upload a resume (PDF or Word, authenticated user).
- **Headers:**
  - `Authorization: Bearer <token>`
- **Form Data:**
  - `resume`: PDF or Word file
  - `title`: string (optional)
  - `university`: string (required)
  - `engineeringField`: string (required)
- **Response:**
  ```json
  { "message": "Resume uploaded successfully!", "resume": { ... } }
  ```

---

### Get User Resumes
- **GET** `/api/v1/upload/resumes`
- **Description:** Get all resumes uploaded by the authenticated user.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  ```json
  { "resumes": [ { ... }, ... ] }
  ```

---

### Delete Resume
- **POST** `/api/v1/upload/delete-resume`
- **Description:** Delete a resume by ID (authenticated user).
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  { "resumeId": "string" }
  ```
- **Response:**
  ```json
  { "message": "Resume deleted successfully!" }
  ```

---

## Matching

### Find Advisor Matches for Resume
- **GET** `/api/v1/matching/resume?resumeId=...`
- **Description:** Analyze a resume and find matching advisors (authenticated user).
- **Headers:**
  - `Authorization: Bearer <token>`
- **Query Params:**
  - `resumeId`: string
- **Response:**
  ```json
  {
    "message": "Advisor matches found successfully",
    "data": {
      "resumeTitle": "string",
      "message": "Resume analysis completed successfully"
    }
  }
  ```

---

### Get Match Results for Resume
- **GET** `/api/v1/matching/results?resumeId=...`
- **Description:** Get advisor match results for a resume (authenticated user).
- **Headers:**
  - `Authorization: Bearer <token>`
- **Query Params:**
  - `resumeId`: string
- **Response:**
  ```json
  {
    "message": "Match results retrieved successfully",
    "data": {
      "_id": "string",
      "resumeId": "string",
      "userId": "string",
      "advisors": [
        {
          "advisor": { ... },
          "matchScore": 80,
          "matchingAreas": ["string", ...]
        }
      ],
      "createdAt": "date"
    }
  }
  ```

---

## Error Handling
- All endpoints return errors in the following format:
  ```json
  { "msg": "Error message" }
  ```

---

## Authentication
- Endpoints marked as "authenticated user" require a valid JWT token in the `Authorization` header: `Bearer <token>`

---

## Notes
- File upload endpoints require `multipart/form-data` encoding.
- For more details on request/response fields, see the models in the codebase.