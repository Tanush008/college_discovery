College Discovery & Decision-Making Platform - Backend
Overview

This project is a production-ready backend for a College Discovery and Decision-Making Platform inspired by platforms like Careers360 and Collegedunia.

The platform helps students:

Search and discover colleges
View detailed college information
Explore courses offered by colleges
Read student reviews
Check admission cutoffs
Compare multiple colleges
Predict eligible colleges based on exam rank
Save colleges for future reference
Manage user authentication securely

The backend is built using NestJS, TypeScript, PostgreSQL, and Prisma ORM following scalable backend architecture and REST API best practices.

Tech Stack
Backend Framework
NestJS
TypeScript
Database
PostgreSQL
ORM
Prisma ORM
Authentication
JWT Authentication
Passport.js
Validation
class-validator
class-transformer
API Testing
Postman
Deployment
Render
Architecture Overview

The application follows a modular architecture.

Client
   |
   v
Controllers
   |
   v
Services
   |
   v
Prisma ORM
   |
   v
PostgreSQL
Controller Layer

Responsibilities:

Handle HTTP requests
Validate request parameters
Forward requests to services
Return API responses

Example:

GET /colleges/:id
Service Layer

Responsibilities:

Business logic
Database operations
Data processing
College prediction algorithm
College comparison logic

Example:

College prediction logic
Compare colleges
Save college functionality
Database Layer

Prisma ORM acts as an abstraction layer between NestJS and PostgreSQL.

Responsibilities:

CRUD operations
Relations management
Query optimization
Type-safe database access
Project Folder Structure
src
│
├── auth
│   ├── dto
│   ├── guards
│   ├── strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── colleges
│   ├── dto
│   ├── colleges.controller.ts
│   ├── colleges.service.ts
│   └── colleges.module.ts
│
├── courses
│   ├── dto
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   └── courses.module.ts
│
├── reviews
│   ├── dto
│   ├── reviews.controller.ts
│   ├── reviews.service.ts
│   └── reviews.module.ts
│
├── cutoff
│   ├── dto
│   ├── cutoff.controller.ts
│   ├── cutoff.service.ts
│   └── cutoff.module.ts
│
├── predictor
│   ├── dto
│   ├── predictor.controller.ts
│   ├── predictor.service.ts
│   └── predictor.module.ts
│
├── compare
│   ├── compare.controller.ts
│   ├── compare.service.ts
│   └── compare.module.ts
│
├── saved
│   ├── dto
│   ├── saved.controller.ts
│   ├── saved.service.ts
│   └── saved.module.ts
│
├── prisma
│   └── prisma.service.ts
│
├── app.module.ts
└── main.ts
Database Schema Design
User Entity

Stores authenticated users.

model User {
  id          String   @id @default(uuid())

  name        String
  email       String   @unique
  password    String

  reviews     Review[]
  saved       SavedCollege[]

  createdAt   DateTime @default(now())
}
Relationships
User
 ├── Reviews
 └── Saved Colleges
College Entity

Stores core college information.

model College {
  id             String @id @default(uuid())

  name           String
  location       String

  fees           Int
  rating         Float

  overview       String

  avgPackage     Int
  highestPackage Int

  courses        Course[]
  reviews        Review[]
  cutoffs        Cutoff[]

  savedBy        SavedCollege[]
}
Stored Information
College Name
Location
Average Fees
Rating
Overview
Average Placement Package
Highest Placement Package
Course Entity

Stores courses offered by colleges.

model Course {
  id          String @id @default(uuid())

  name        String
  degree      String
  duration    String
  fees        Int

  collegeId   String

  college College
  @relation(fields:[collegeId], references:[id])
}
Example
IIT Delhi
 ├── Computer Science Engineering
 ├── Information Technology
 ├── Electronics Engineering
 └── Mechanical Engineering
Review Entity

Stores reviews submitted by authenticated users.

model Review {
  id          String @id @default(uuid())

  rating      Float
  comment     String

  userId      String
  collegeId   String

  user        User
  college     College

  createdAt   DateTime @default(now())
}
Features
User-specific reviews
College-specific reviews
Rating system
Cutoff Entity

Stores admission cutoff information.

model Cutoff {
  id            String @id @default(uuid())

  exam          String
  category      String

  course        String

  openingRank   Int
  closingRank   Int

  collegeId     String

  college College
  @relation(fields:[collegeId], references:[id])

  createdAt DateTime @default(now())
}
Example
Exam: JEE Main
Category: General
Course: Computer Science Engineering

Opening Rank: 1000
Closing Rank: 12000
Saved College Entity

Stores bookmarked colleges.

model SavedCollege {
  id          String @id @default(uuid())

  userId      String
  collegeId   String

  user        User
  college     College

  createdAt   DateTime @default(now())
}
Relationship
User
 └── Saved Colleges

College
 └── Saved By Users
Authentication System

JWT-based authentication is implemented.

Signup
POST /auth/signup

Creates a new user account.

Login
POST /auth/login

Returns:

{
  "accessToken": "jwt_token"
}
Protected Routes
POST /reviews
POST /saved
GET /saved
GET /auth/profile

Authorization header:

Bearer <JWT_TOKEN>
College Search & Discovery

Endpoint:

GET /colleges

Supports:

Pagination
Search
Filters
Sorting

Example:

GET /colleges?page=1&limit=10
College Detail System

Endpoint:

GET /colleges/:id

Returns:

College Information
Courses
Reviews
Reviewer Details
Admission Cutoffs

Single request loads the entire college detail page.

Compare Colleges Feature

Endpoint:

GET /compare?ids=id1,id2,id3

Allows comparison of up to three colleges.

Comparison fields:

Fees
Ratings
Location
Average Package
Highest Package
Courses Count
Reviews Count
Popular Cutoffs
Predictor Tool

Endpoint:

POST /predictor

Input:

{
  "exam": "JEE Main",
  "category": "General",
  "rank": 12000
}
Prediction Algorithm

The predictor uses cutoff data stored in PostgreSQL.

Logic:

rank <= 70% cutoff
      ↓
Safe College

rank <= cutoff
      ↓
Moderate Chance

rank <= 115% cutoff
      ↓
Dream College

Output:

{
  "safe": [],
  "moderate": [],
  "dream": []
}
Data Handling Strategy
Validation Layer

Every request is validated using DTOs.

Example:

CreateCollegeDto
CreateCourseDto
CreateReviewDto
CreateCutoffDto
PredictorDto

Validation rules include:

Required fields
Email validation
Numeric validation
Rank validation
Rating validation
Database Integrity

Implemented through:

Foreign Keys
Prisma Relations
Unique Constraints
Input Validation

Examples:

Course must belong to a College

Review must belong to:
    User
    College

Saved College must belong to:
    User
    College
API Modules
Auth Module

Responsible for:

Signup
Login
JWT generation
Profile retrieval
Colleges Module

Responsible for:

College CRUD
Search
Filtering
Detailed college retrieval
Courses Module

Responsible for:

Course CRUD
Fetch courses by college
Reviews Module

Responsible for:

Add review
Fetch reviews
Delete review
Cutoff Module

Responsible for:

Create cutoffs
Fetch cutoffs
Fetch cutoffs by college
Compare Module

Responsible for:

Side-by-side college comparison
Predictor Module

Responsible for:

College prediction
Safe / Moderate / Dream categorization
Saved Module

Responsible for:

Save colleges
Fetch saved colleges
Remove saved colleges
Deployment

Backend deployed using Render.

Environment Variables:

DATABASE_URL=
JWT_SECRET=
PORT=
NODE_ENV=production
Future Enhancements
Advanced filtering
Infinite scrolling
Redis caching
Role-based authorization
Admin dashboard
Recommendation engine
AI-powered college suggestions
Elasticsearch integration
Real-time analytics
Notification system
Author

Tanush Aggarwal

Backend Engineering Assignment

Tech Stack:

NestJS
TypeScript
PostgreSQL
Prisma ORM
JWT Authentication
Render Deployment
