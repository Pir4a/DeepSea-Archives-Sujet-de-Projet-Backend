DeepSea Archives – Plan d’exécution
===================================

1. Vue d’ensemble & jalons progressifs
--------------------------------------
1. **Base (Niveau 10/20)**  
   - Microservice 1 `auth-service` (Baptiste) : authentification + rôles.  
   - Microservice 2 `observation-service` (Stephane) : espèces + observations + validations.  
   - Communication JWT, docs minimales, séparation couches.
2. **Intermédiaire (Niveau 13/20)**  
   - Rarity score automatique, réputation dynamique, montée en rôle expert.
3. **Avancé (Niveau 16/20)**  
   - Microservice 3 `taxonomy-service`, historique modération, soft delete.
4. **Expert (18-20/20)**  
   - API Gateway, docker-compose + CI, documentation complète, tests unitaires.

2. Échafaudage d’architecture
-----------------------------
```
/DeepSea
├── docs/ (README, Swagger, diagrammes, ERD)
├── packages/
│   ├── common/ (middlewares JWT, logger, erreurs, types partagés)
│   └── prisma/ (schemas, migrations, seed)
├── services/
│   ├── auth-service/          ← Baptiste
│   ├── observation-service/   ← Stephane
│   └── taxonomy-service/      ← commun (niveau 16+)
├── gateway/ (API Gateway Express + rate limiting + proxy)
├── docker/
│   ├── docker-compose.yml (services + db + jaeger optionnel)
│   └── env/ (exemples .env.*)
└── scripts/ (setup, lint, test, seed)
```
Principes:
- Chaque service : architecture hexagonale légère (`src/domain`, `src/application`, `src/infrastructure`, `src/interfaces`).
- Prisma par service (schéma séparé ou namespaces) + migrations orchestrées.
- Swagger par service via `@fastify/swagger` ou `swagger-ui-express`.
- Tests via Jest + supertest (unit + e2e minimal).

3. Planning détaillé par service
-------------------------------

### 3.1 Microservice 1 – Auth-Service (Baptiste)
**Objectif général**: identité, rôles, réputation, émission/validation JWT.

| Étape | Tâches | Livrables |
|-------|-------|-----------|
|1. Bootstrapping| Initialise projet (Express, TS, ESLint, Jest), config Prisma (User model), scripts npm, `.env.example`. | Repo `services/auth-service`.|
|2. Base data| Migrations User, seed admin, utilitaires bcrypt + JWT, repository abstrait. | `prisma/schema.prisma`, seed script. |
|3. Use cases core| Cas d’usage register/login/me (domain/services), validators (zod/yup), erreurs typed. | Services `RegisterUser`, `LoginUser`, `GetProfile`.|
|4. Rôles & admin| Middlewares auth/role, routes `GET /admin/users`, `PATCH /users/:id/role`. | Controllers + tests e2e.|
|5. Réputation| Hooks sur validations (webhook depuis observation-service ou endpoint interne), update rôle `USER→EXPERT` si reputation >=10. | Service `ReputationService`.|
|6. Tests + docs| Tests unitaires sur use cases + e2e login, Swagger doc, README dédié, Postman examples. | `docs/auth-service-swagger.json`.|

### 3.2 Microservice 2 – Observation-Service (Stephane)
**Objectif général**: gestion espèces/observations, validations, règles métiers avancées.

| Étape | Tâches | Livrables |
|-------|-------|-----------|
|1. Bootstrapping| Structure Express/Prisma équivalente, models Species/Observation, middlewares communs importés de `packages/common`. | Projet `services/observation-service`.|
|2. Species| Routes `POST/GET` espèces, contrainte unicité nom (Prisma unique + validation). | Services `CreateSpecies`, `ListSpecies`.|
|3. Observations| `POST /observations`, `GET /species/:id/observations`, règles délai 5 min, description obligatoire, `dangerLevel` 1-5 (champ sur Observation). | Validator + policy layer.|
|4. Validation workflow| `POST /observations/:id/{validate|reject}`, interdiction auto-validation, statut + `validatedBy/At`. | Domain services `ValidateObservation`, `RejectObservation`.|
|5. Rarity & réputation| Calcul `rarityScore` (getter SQL ou champ recalculé), endpoints tri, appels REST vers auth-service pour reputation updates. | Cron/service recalcul + webhooks.|
|6. Historisation & soft delete| Tables `ObservationHistory`, colonnes `deletedAt`, endpoints admin/expert history, restore. | Prisma migrations + tests.|
|7. Tests + docs| Unitaires pour règles délai + validation, Swagger, README. | `docs/observation-service-swagger.json`.|

### 3.3 Microservice 3 – Taxonomy-Service (Commun, niveau 16+)
Étapes: (1) Setup service + client HTTP internes; (2) Fetch espèces/observations via REST (ou gRPC plus tard); (3) Calcul stats (occurrences, moyenne observations, mots-clés simple TF-IDF), génération classification (heuristiques basées sur `dangerLevel` + `rarityScore`); (4) Endpoint `GET /taxonomy/stats`; (5) Tests unitaires sur agrégations; (6) Doc Swagger.

4. Communication & sécurité inter-services
------------------------------------------
- `packages/common/jwt` : middleware Express validant token (clé partagée ou JWKS).
- Observation-service → Auth-service:  
  1. Vérifie JWT sur chaque requête via middleware commun.  
  2. Utilise REST `GET /auth/me` pour récupérer rôle/réputation (cache court).  
  3. Webhook/queue (optionnel) pour informer auth-service des validations/rejets (maj réputation).
- Eventual message bus (Redis streams ou RabbitMQ) pour envoyer `ObservationValidated`, `ObservationRejected`.

5. API Gateway (niveau 18+)
---------------------------
Étapes:  
1. Choix outil (Express + http-proxy-middleware).  
2. Middlewares globaux: logging, rate limiting, validation JWT (court-circuit).  
3. Table de routage (`/auth/* → auth-service`, `/species|/observations → observation-service`, `/taxonomy → taxonomy-service`).  
4. Gestion erreurs unifiées + traçage (ids corrélation).  
5. Tests smoke + doc.

6. Dockerisation & CI
---------------------
- `docker-compose.yml`: `postgres`, `auth-service`, `observation-service`, `taxonomy-service`, `gateway`, `swagger-ui` (optionnel).  
- Environnements `.env.local`, `.env.docker`.  
- CI GitHub Actions: jobs `lint`, `test`, `prisma migrate deploy`, `docker build`.  
- Scripts `make up`, `make test`.

7. Documentation & outils
-------------------------
- README racine: architecture, commandes, diagramme.  
- Swagger par service + agrégation (ReDoc).  
- Prisma ERD (via `npx prisma generate --schema ...`).  
- Postman/Insomnia collection exportée.  
- Diagrammes (Excalidraw/Mermaid) pour flux microservices.

8. Répartition équipe & coordination
------------------------------------
- **Baptiste (Auth-Service)**: étapes 3.1 + support réputation, intégration gateway, tests auth.  
- **Stephane (Observation-Service)**: étapes 3.2 + 3.3 (taxonomy), orchestrations validations, historisation.  
- Pairing régulier pour: contrats API, schémas Prisma partagés, scripts docker.  
- Daily courte : suivi blocages, définition priorités sprint.  
- Revues croisées: Baptiste review code Stephane et inverse.

9. Checklist finale avant rendu
-------------------------------
- [ ] Deux microservices déployables, endpoints min validés via tests Postman.  
- [ ] JWT vérifié partout, rôles appliqués.  
- [ ] Docs (README + Swagger + diag) complètes.  
- [ ] Docker-compose fonctionnel.  
- [ ] Tests unitaires (>=1/service) verts.  
- [ ] Lien Git + fichier .txt de rendu avec instructions run.
