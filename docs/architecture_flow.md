# DeepSea Archives Microservices Flow

```mermaid
graph TD
    Client[Client (Web/Mobile/Postman)]

    subgraph Entry Point
        Gateway[API Gateway (Port 4000)]
    end

    subgraph Services
        Auth[Auth Service (3001)]
        Obs[Observation Service (4002)]
        Tax[Taxonomy Service (4003)]
    end

    subgraph Databases
        AuthDB[(Auth DB - PostgreSQL)]
        ObsDB[(Observation DB - PostgreSQL)]
    end

    %% Client interaction
    Client -- HTTP Request --> Gateway

    %% Gateway routing
    Gateway -- /auth/*, /admin/* --> Auth
    Gateway -- /species, /observations --> Obs
    Gateway -- /taxonomy/* --> Tax

    %% Service communication
    Auth -- Read/Write --> AuthDB
    Obs -- Read/Write --> ObsDB
    
    %% Inter-service communication
    Obs -- Enrich User (GET /auth/me) --> Auth
    Obs -- Reputation Update (POST /internal/reputation) --> Auth
    Tax -- Fetch Data (REST) --> Obs
```
