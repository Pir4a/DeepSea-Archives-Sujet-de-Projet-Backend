# DeepSea Database Schema

This document describes the data models used in the DeepSea Archives services.

## Auth Service (Schema: `auth`)

### User
Stores user identity, roles, and reputation.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | Int | PK, AutoInc | Unique user identifier |
| `email` | String | Unique | User email |
| `username` | String | Unique | Display name |
| `password` | String | | Hashed password |
| `role` | Enum | Default: `USER` | `USER`, `EXPERT`, `ADMIN` |
| `reputation` | Int | Default: 0 | Reputation score |
| `createdAt` | DateTime | Default: Now | |
| `updatedAt` | DateTime | UpdatedAt | |

---

## Observation Service (Schema: `public`)

### Species
Catalog of defined deep-sea species.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | Int | PK, AutoInc | Unique species identifier |
| `authorId` | Int | | ID of the user who created the species |
| `name` | String | Unique | Scientific or common name |
| `rarityScore` | Float | Default: 100 | Rarity score (used for classification) |
| `createdAt` | DateTime | Default: Now | |

### Observation
Field observations of species.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | Int | PK, AutoInc | Unique observation identifier |
| `speciesId` | Int | FK -> Species | The observed species |
| `authorId` | Int | | ID of the observer |
| `description` | String | | Text description |
| `dangerLevel` | Int | | 1-5 Scale of danger |
| `status` | Enum | Default: `PENDING` | `PENDING`, `VALIDATED`, `REJECTED` |
| `validatedBy` | Int? | | ID of the validator (if processed) |
| `validatedAt` | DateTime? | | Timestamp of validation |
| `deletedAt` | DateTime? | | Timestamp for soft delete |
| `createdAt` | DateTime | Default: Now | |

### ObservationHistory
Audit log for actions performed on observations.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | Int | PK, AutoInc | Log identifier |
| `observationId` | Int | FK -> Obs | Target observation |
| `speciesId` | Int | | Snapshot of species ID |
| `authorId` | Int | | Snapshot of author ID |
| `action` | Enum | | `CREATED`, `VALIDATED`, `REJECTED`, `DELETED`, `RESTORED` |
| `performedBy` | Int? | | ID of the user performing the action |
| `payload` | Json? | | Extra data (e.g. rejection reason) |
| `createdAt` | DateTime | Default: Now | |

