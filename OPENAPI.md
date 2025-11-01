# OpenAPI Specification (High-Level Table)

This document provides a **high-level OpenAPI specification** in table format for the REST API that manages **salesmen** and **social performance records**.  
The API is implemented with **Express.js** and currently uses **hard-coded data** (no MongoDB integration required at this stage).

---

## Base URL
http://localhost:3000
---

## Endpoints

| Path | Method | Description | Request Parameters / Body | Response |
|------|--------|-------------|----------------------------|----------|
| `/api/salesmen` | `GET` | Retrieve all salesmen | — | `200 OK` – Array of `Salesman` |
| `/api/salesmen/{sid}` | `GET` | Retrieve a salesman by ID | `sid` (path, integer) | `200 OK` – `Salesman`<br>`404 Not Found` |
| `/api/salesmen` | `POST` | Create a new salesman | **Body** (JSON):<br>`{ "firstname": string, "lastname": string, "sid": integer }` | `201 Created` – Created `Salesman` |
| `/api/salesmen/{sid}` | `DELETE` | Delete a salesman and all associated performance records | `sid` (path, integer) | `204 No Content`<br>`404 Not Found` |
| `/api/performance` | `POST` | Add a social performance record | **Body** (JSON):<br>`{ "goalId": integer, "goalDescription": string, "valueSupervisor": number, "valuePeerGroup": number, "year": integer }` | `201 Created` – Created record |
| `/api/performance/salesman/{sid}` | `GET` | Get all performance records for a salesman | `sid` (path, integer) | `200 OK` – Array of records |
| `/api/performance/salesman/{sid}/year/{year}` | `GET` | Get performance records for a salesman in a specific year | `sid`, `year` (path, integer) | `200 OK` – Filtered array |
| `/api/performance` | `PUT` | Update a performance record | **Body** (JSON):<br>`{ "sid": integer, "description": string, "newValueSupervisor": number, "newValuePeerGroup": number }` | `200 OK` – Updated record<br>`404 Not Found` |
| `/api/performance` | `DELETE` | Delete a specific performance record | **Body** (JSON):<br>`{ "sid": integer, "description": string }` | `204 No Content`<br>`404 Not Found` |

---

## Data Models

### `Salesman`
```json
{
  "sid": 1,
  "firstname": "John",
  "lastname": "Doe"
}
```

### `SocialPerformanceRecord`
```json
{
  "goalId": 1,
  "goalDescription": "Q4 Sales Target",
  "valueSupervisor": 8.7,
  "valuePeerGroup": 9.0,
  "year": 2025
}
```
