# College Discovery Backend

Backend service for a college discovery platform that helps students browse colleges, inspect courses and cutoffs, compare institutes, predict likely options from exam rank, and manage authenticated actions such as reviews and saved colleges.

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + Passport
- **Validation:** class-validator + class-transformer
- **Testing:** Jest

## What the Backend Does

The API is organized into focused NestJS modules:

- **Auth** - signup, login, and JWT-backed profile access
- **Colleges** - list colleges, apply filters, and fetch detailed college pages
- **Courses** - create and fetch course records linked to colleges
- **Reviews** - create, list, and delete user reviews
- **Cutoffs** - store and query admission cutoff data
- **Compare** - compare up to three colleges side by side
- **Predictor** - classify colleges into safe, moderate, and dream buckets from rank data
- **Saved** - save colleges for authenticated users

## Backend Architecture

The application uses NestJS's modular layered architecture.

```text
Client
  -> Controller
      -> DTO validation
          -> Service
              -> PrismaService
                  -> PostgreSQL
```

### Layers

#### 1. Controller layer

Controllers define HTTP routes, collect params/body/query data, and delegate work to services.

Examples:
- `AuthController` handles `/auth/*`
- `CollegesController` handles `/colleges`
- `PredictorController` handles `/predictor`

#### 2. DTO + validation layer

Incoming payloads are validated through DTO classes and a global `ValidationPipe` configured in `src/main.ts`.

Current validation behavior:
- strips unknown properties with `whitelist: true`
- transforms request values with `transform: true`
- validates email, numbers, rank ranges, and required fields through DTO decorators

#### 3. Service layer

Services hold the business logic:

- `AuthService` hashes passwords and signs JWTs
- `CollegesService` handles search, filtering, pagination, and detail loading
- `PredictorService` maps rank against cutoff data
- `CompareService` enforces the 2-to-3 college comparison limit

#### 4. Data access layer

`PrismaService` extends `PrismaClient`, connects on module initialization, and is reused by all domain services for type-safe database access.

## Request Lifecycle

1. Request reaches a controller route.
2. NestJS applies DTO validation and transformation.
3. Guarded routes run `JwtAuthGuard` when authentication is required.
4. Service executes business rules.
5. Prisma performs database reads/writes.
6. Response is returned as plain JSON.

## Data Handling

### Input validation

The backend validates request payloads before service execution. Examples:

- `SignupDto` validates email format and minimum password length
- `GetCollegesDto` validates filter and pagination query params
- `PredictorDto` requires a positive integer rank
- `CreateCutoffDto`, `CreateCourseDto`, and `CreateReviewDto` validate typed request bodies

### Authentication handling

- Passwords are hashed with `bcrypt`
- JWTs are signed through Nest's `JwtModule`
- `JwtStrategy` extracts the bearer token and exposes `{ userId, email }` on `req.user`
- Protected routes currently include review creation, saved-college creation, and profile access

### Relational integrity

Prisma relations and application checks are used together:

- users own reviews and saved colleges
- courses, reviews, and cutoffs belong to a college
- services verify parent records exist before creating dependent records in several modules

### Query patterns

Examples used in the codebase:

- college listing uses `findMany` with `where`, `skip`, and `take`
- college details use `include` to load courses, reviews, review authors, and cutoffs in one query
- compare and predictor features aggregate related data before shaping the final API response

### Seed data

The `prisma/seed.ts` script creates sample colleges and bulk-inserts course templates with fee multipliers based on institution type.

## Database Schema

Schema file: `backend/prisma/schema.prisma`

### Entity relationship summary

```text
User 1---* Review *---1 College
User 1---* SavedCollege *---1 College
College 1---* Course
College 1---* Cutoff
```

### `User`

Stores application users.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, UUID |
| `name` | `String` | User display name |
| `email` | `String` | Unique email |
| `password` | `String` | Hashed password |
| `createdAt` | `DateTime` | Creation timestamp |

Relations:
- one user can create many `Review` records
- one user can create many `SavedCollege` records

### `College`

Stores the main college profile shown in listings and detail pages.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, UUID |
| `name` | `String` | College name |
| `location` | `String` | City or place |
| `fees` | `Int` | Base fee value |
| `rating` | `Float` | College rating |
| `overview` | `String` | Description/summary |
| `avgPackage` | `Int` | Average placement package |
| `highestPackage` | `Int` | Highest package |
| `createdAt` | `DateTime` | Creation timestamp |

Relations:
- one college has many `Course`
- one college has many `Review`
- one college has many `Cutoff`
- one college can be referenced by many `SavedCollege`

### `Course`

Stores courses attached to a college.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, UUID |
| `name` | `String` | Course name |
| `degree` | `String` | Degree label |
| `duration` | `String` | Course duration |
| `fees` | `Int` | Course-specific fee |
| `collegeId` | `String` | Foreign key to `College` |

Meaning:
- lets the backend show all programs offered by a college
- is reused by compare responses for quick course counts and top-course lists

### `Review`

Stores college reviews submitted by authenticated users.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, UUID |
| `rating` | `Float` | Review score |
| `comment` | `String` | User feedback |
| `userId` | `String` | Foreign key to `User` |
| `collegeId` | `String` | Foreign key to `College` |
| `createdAt` | `DateTime` | Creation timestamp |

Meaning:
- connects a user opinion to one college
- is returned with selected user info in review and college detail queries

### `Cutoff`

Stores admission cutoff information for predictions and detail pages.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, UUID |
| `exam` | `String` | Exam name |
| `category` | `String` | Reservation/general category |
| `course` | `String` | Course name |
| `openingRank` | `Int` | Opening rank |
| `closingRank` | `Int` | Closing rank |
| `collegeId` | `String` | Foreign key to `College` |

Meaning:
- powers the rank predictor
- supports college-specific cutoff lookups

### `SavedCollege`

Join table for a user's saved colleges.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String` | Primary key, UUID |
| `userId` | `String` | Foreign key to `User` |
| `collegeId` | `String` | Foreign key to `College` |
| `createdAt` | `DateTime` | Creation timestamp |

Meaning:
- models bookmarks/favorites
- links users to colleges without duplicating college data

## Predictor Logic

The predictor compares the submitted rank with each matching cutoff's `closingRank`.

- `rank <= 70% of closingRank` -> **safe**
- `rank <= closingRank` -> **moderate**
- `rank <= 115% of closingRank` -> **dream**

The response is grouped into:

```json
{
  "safe": [],
  "moderate": [],
  "dream": []
}
```

## API Overview

### Health

- `GET /` - returns `"Hello World!"`

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/profile` *(JWT required)*

### Colleges

- `GET /colleges`
- `POST /colleges`
- `GET /colleges/:id`

Supported college listing query params:
- `search`
- `location`
- `minFees`
- `maxFees`
- `page`
- `limit`

### Courses

- `POST /courses`
- `GET /courses`
- `GET /courses/:id`
- `GET /courses/college/:collegeId`
- `DELETE /courses/:id`

### Reviews

- `POST /reviews` *(JWT required)*
- `GET /reviews`
- `GET /reviews/college/:collegeId`
- `DELETE /reviews/:id`

### Cutoffs

- `POST /cutoffs`
- `GET /cutoffs`
- `GET /cutoffs/:id`
- `GET /cutoffs/college/:collegeId`
- `DELETE /cutoffs/:id`

### Compare

- `GET /compare?ids=id1,id2,id3`

### Predictor

- `POST /predictor`

### Saved colleges

- `POST /saved` *(JWT required)*

> `SavedService` also contains a `getSaved(userId)` method, but there is currently no controller route exposing it.

## Folder Structure

```text
college_discovery/
├── README.md
└── backend/
    ├── package.json
    ├── package-lock.json
    ├── nest-cli.json
    ├── tsconfig.json
    ├── tsconfig.build.json
    ├── eslint.config.mjs
    ├── prisma.config.ts
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   ├── migrations/
    │   └── seed-data/
    │       ├── college.ts
    │       └── courseTemplates.ts
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── app.controller.ts
    │   ├── app.service.ts
    │   ├── prisma/
    │   │   ├── prisma.module.ts
    │   │   └── prisma.service.ts
    │   ├── auth/
    │   ├── colleges/
    │   ├── courses/
    │   ├── reviews/
    │   ├── cut-off/
    │   ├── predictor/
    │   ├── compare/
    │   └── saved/
    └── test/
        ├── app.e2e-spec.ts
        └── jest-e2e.json
```

### What each main folder contains

- `backend/prisma/` - Prisma schema, migrations, and seed data
- `backend/src/auth/` - auth controller, service, JWT strategy, guard, and DTOs
- `backend/src/colleges/` - college list/detail logic and DTOs
- `backend/src/courses/` - course CRUD-style endpoints
- `backend/src/reviews/` - review creation and fetch flows
- `backend/src/cut-off/` - cutoff creation, lookup, and deletion
- `backend/src/predictor/` - rank prediction endpoint and logic
- `backend/src/compare/` - college comparison endpoint
- `backend/src/saved/` - saved-college creation flow
- `backend/test/` - end-to-end test config

## Local Setup

From the `backend/` directory:

```bash
npm install
```

Create environment variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
PORT=3000
NODE_ENV=development
```

Run the app:

```bash
npm run start:dev
```

Useful commands:

```bash
npm run build
npm run lint
npm test
npm run test:e2e
```

## Notes

- CORS is currently configured for `http://localhost:3000`
- JWT secret falls back to `dev-secret` if `JWT_SECRET` is not set
- The repository currently contains the backend service only
