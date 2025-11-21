# DeepSea Archives

**DeepSea Archives** est une plateforme basée sur des microservices pour cataloguer et analyser les espèces des grands fonds marins. Elle permet aux chercheurs de documenter des observations, de valider les découvertes et de générer des statistiques taxonomiques.

## 🏗 Architecture

Le projet est construit en utilisant une **Architecture Microservices** avec les principes de l'**Architecture Hexagonale** au sein de chaque service, exposés via une **API Gateway** unifiée.

### Services

1.  **Gateway** (`@deepsea/gateway`) - **Port 4000**
    *   Point d'entrée unique pour toutes les requêtes.
    *   Redirige vers les microservices appropriés.
    *   Stack : Node.js, Express, Http-Proxy.

2.  **Auth Service** (`@deepsea/auth-service`) - *Interne : 3001*
    *   Gère l'inscription, la connexion, les rôles (USER, EXPERT, ADMIN) et la réputation.
    *   Stack : Node.js, Express, Prisma, PostgreSQL (Schema `auth`).

3.  **Observation Service** (`@deepsea/observation-service`) - *Interne : 4002*
    *   Gère le catalogue des espèces et les observations sur le terrain.
    *   Gère les flux de validation (valider/rejeter les observations).
    *   Stack : Node.js, Express, Prisma, PostgreSQL (Schema `public`).

4.  **Taxonomy Service** (`@deepsea/taxonomy-service`) - *Interne : 4003*
    *   **Moteur d'Analyse** : Agrège les données du Service d'Observation.
    *   Calcule les statistiques, les mots-clés et la classification (COMMUN, RARE, LÉGENDAIRE).
    *   Stack : Node.js, Express (Stateless).

### Infrastructure

*   **Docker Compose** : Orchestre tous les services et bases de données.
*   **PostgreSQL** : Base de données principale partagée (séparation par schémas `auth` et `public`).
*   **Prisma** : ORM pour l'interaction avec la base de données.
*   **Swagger** : Documentation de l'API (accessible via Gateway).

## 🚀 Pour Commencer

### Prérequis

*   Docker & Docker Compose
*   Node.js 20+ (pour le développement local)

### Lancer la Stack

Le moyen le plus simple est d'utiliser le `Makefile` à la racine :

```bash
make buildup
```

Ou manuellement :
```bash
docker-compose up --build -d
```

### Accéder aux APIs (Gateway - Port 4000)

Toutes les requêtes doivent passer par `http://localhost:4000`.

*   **Auth** : `POST http://localhost:4000/auth/login`
*   **Observations** : `GET http://localhost:4000/observations`
*   **Taxonomy** : `GET http://localhost:4000/taxonomy/stats`

#### Documentation Swagger

Les documentations Swagger sont accessibles directement sur les ports des services (mappage Docker) :
*   **Auth** : `http://localhost:3001/docs`
*   **Observation** : `http://localhost:4002/api-docs`
*   **Taxonomy** : `http://localhost:4003/api-docs`

## 🛠 Commandes de Développement

Utilisez le **Makefile** à la racine du projet :

*   `make up` : Construire et démarrer tout.
*   `make down` : Arrêter tout.
*   `make logs` : Voir les logs en temps réel.
*   `make test` : Lancer les tests unitaires de tous les services.
*   `make clean` : Tout arrêter et supprimer les volumes (reset DB).

## 📚 Documentation

*   **Flux d'Architecture** : [docs/architecture_flow.md](docs/architecture_flow.md) (Diagramme Mermaid).
*   **Schéma de Base de Données** : [docs/database_schema.md](docs/database_schema.md) (Description des tables et relations).
*   **Collection Postman** : [docs/DeepSea_Postman_Collection.json](docs/DeepSea_Postman_Collection.json).

## 🧪 Tests

L'intégration continue (CI) est configurée via GitHub Actions pour tester tous les services à chaque push.
Pour tester localement :

```bash
make test
```

## 👥 Contributeurs

*   **Baptiste** : Auth Service
*   **Stephane** : Observation Service & Taxonomy Service
