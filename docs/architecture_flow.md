# DeepSea Archives Microservices Flow

```mermaid
graph TD
    Client[Client (Web/Mobile)]

    subgraph Gateway Layer
        Gateway[API Gateway (To be Implemented)]
    end

    subgraph Services
        Auth[Auth Service]
        Obs[Observation Service]
        Tax[Taxonomy Service]
    end

    subgraph Databases
        AuthDB[(Auth DB - PostgreSQL)]
        ObsDB[(Observation DB - PostgreSQL)]
    end

    %% Client interaction
    Client -- HTTP Request --> Gateway

    %% Gateway routing (conceptual)
    Gateway -- /auth/* --> Auth
    Gateway -- /species, /observations --> Obs
    Gateway -- /taxonomy/* --> Tax

    %% Service communication
    Auth -- Read/Write --> AuthDB
    Obs -- Read/Write --> ObsDB
    
    %% Inter-service communication
    Obs -- Validate Token (Internal/Shared Lib) --> Auth
    Tax -- Fetch Data (REST) --> Obs

    %% Details
    Obs -- Webhook/Event (Future) --> Auth
```

