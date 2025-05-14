openapi: 3.0.0
info:
  title: User Profile Management API
  description: API endpoints for managing user profiles and profile images
  version: 1.0.0
servers:
  - url: http://localhost:5000/api/v1
    description: Development server

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  
  schemas:
    User:
      type: object
      properties:
        _id:
          type: string
          example: "60d0fe4f5311236168a109ca"
        name:
          type: string
          example: "John Doe"
        email:
          type: string
          format: email
          example: "john@example.com"
        role:
          type: string
          enum: [user, advisor]
          example: "user"
        profileImageUrl:
          type: string
          example: "https://senior-project-aws.s3.eu-north-1.amazonaws.com/profiles-images/1747163154074-profile.jpg?AWSAccessKeyId=..."
        __v:
          type: integer
          example: 0
    
    ProfileUpdateRequest:
      type: object
      properties:
        name:
          type: string
          example: "John Smith"
        email:
          type: string
          format: email
          example: "johnsmith@example.com"
    
    ApiResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        message:
          type: string
          example: "Operation completed successfully"
        user:
          $ref: '#/components/schemas/User'

paths:
  /users/profile:
    get:
      summary: Get user profile information
      description: Returns the current user's profile with signed URL for profile image
      security:
        - BearerAuth: []
      responses:
        '200':
          description: User profile retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "User profile retrieved successfully"
                  user:
                    $ref: '#/components/schemas/User'
        '401':
          description: Unauthorized - invalid or missing token
          
    patch:
      summary: Update user profile information
      description: Updates the user's name and/or email address
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProfileUpdateRequest'
      responses:
        '200':
          description: Profile updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
        '400':
          description: Invalid input data or email already in use
        '401':
          description: Unauthorized - invalid or missing token
          
  /users/profile/image:
    post:
      summary: Upload profile image
      description: Uploads a new profile image and returns the updated user profile
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  type: string
                  format: binary
                  description: Profile image file (JPEG, PNG, etc.)
      responses:
        '200':
          description: Profile image updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
        '400':
          description: No image file provided
        '401':
          description: Unauthorized - invalid or missing token