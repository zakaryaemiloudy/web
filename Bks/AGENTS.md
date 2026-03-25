# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Bks (Blood Bank System) is a Spring Boot 3.3 REST API for managing blood donations, hospitals, donors, and blood stock. The system supports role-based access (SUPER_ADMIN, ADMIN, USER) with JWT authentication.

## Build and Run Commands

```bash
# Build the project
./gradlew build

# Run the application (requires MariaDB running on localhost:3306)
./gradlew bootRun

# Run tests
./gradlew test

# Run a single test class
./gradlew test --tests "com.bks.BksApplicationTests"

# Clean build
./gradlew clean build
```

## Database Setup

The application requires MariaDB running on `localhost:3306` with a database named `bks`. Configure credentials in `src/main/resources/application.properties`. The schema auto-updates on startup (`ddl-auto=update`).

### Seed Data

On first startup (when database is empty), `DataInitializer` populates sample data:

| Role | Email | Password |
|------|-------|----------|
| SUPER_ADMIN | superadmin@bks.com | admin123 |
| ADMIN | admin.casa@bks.com | admin123 |
| ADMIN | admin.rabat@bks.com | admin123 |
| USER | donneur1@test.com | user123 |

Also creates: 4 hospitals (3 validated, 1 pending), 4 donor profiles, blood stock for each hospital, and gamification badges.

## Architecture

### Package Structure (`com.bks`)

- **controller/**: REST endpoints organized by role (`AuthController`, `AdminController`, `SuperAdminController`, `DonneurController`, `PatientController`)
- **service/**: Business logic services corresponding to domain operations
- **model/**: JPA entities representing domain objects
- **repository/**: Spring Data JPA repositories
- **dto/**: Request/response DTOs for API payloads
- **enums/**: Domain enumerations (`Role`, `GroupeSanguin`, `StatutDon`, `Urgence`, etc.)
- **security/**: JWT authentication filter chain, custom handlers, `SecurityConfig`
- **scheduler/**: Scheduled background tasks
- **chatbot/**: AI chatbot integration using Groq API

### Security Model

Role-based endpoint access defined in `SecurityConfig`:
- `/api/auth/**` - Public (no auth)
- `/api/superadmin/**` - SUPER_ADMIN only
- `/api/admin/**` - ADMIN or SUPER_ADMIN
- `/api/donneur/**`, `/api/patient/**` - USER, ADMIN, or SUPER_ADMIN
- `/api/chatbot/**`, `/api/notifications/**` - Any authenticated user

### Domain Entities

Core: `Utilisateur`, `Hopital`, `Donneur`, `Don`, `DemandeSang`, `StockSang`
Supporting: `CampagneDon`, `Badge`, `DonneurBadge`, `Notification`, `RapportMensuel`, `StatistiquesQuotidiennes`

## Conventions

- **Language**: Domain terminology uses French (e.g., `Utilisateur`, `Donneur`, `motDePasse`, `groupeSanguin`)
- **DTOs**: Use `*Request` suffix for inputs, `*Response` for outputs
- **Validation**: Jakarta Bean Validation annotations on DTOs
- **Dependencies**: Constructor injection preferred, Lombok `@RequiredArgsConstructor` on controllers
