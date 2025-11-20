# DeepSea Archives

**DeepSea Archives** est une plateforme basée sur des microservices pour cataloguer et analyser les espèces des grands fonds marins. Elle permet aux chercheurs de documenter des observations, de valider les découvertes et de générer des statistiques taxonomiques.

## 🏗 Architecture

Le projet est construit en utilisant une **Architecture Microservices** avec les principes de l'**Architecture Hexagonale** au sein de chaque service.

### Services

1.  **Auth Service** (`@deepsea/auth-service`) - *Implémentation en attente*
    *   Gère l'inscription, la connexion, les rôles (USER, EXPERT, ADMIN) et la réputation.
    *   Stack : Node.js, Express, Prisma, PostgreSQL.

2.  **Observation Service** (`@deepsea/observation-service`)
    *   Gère le catalogue des espèces et les observations sur le terrain.
    *   Gère les flux de validation (valider/rejeter les observations).
    *   Stack : Node.js, Express, Prisma, PostgreSQL.

3.  **Taxonomy Service** (`@deepsea/taxonomy-service`)
    *   **Moteur d'Analyse** : Agrège les données du Service d'Observation.
    *   Calcule les statistiques, les mots-clés et la classification (COMMUN, RARE, LÉGENDAIRE).
    *   Stack : Node.js, Express (Stateless).

### Infrastructure

*   **Docker Compose** : Orchestre tous les services et bases de données.
*   **PostgreSQL** : Base de données principale (séparation des schémas ou instances distinctes).
*   **Prisma** : ORM pour l'interaction avec la base de données.
*   **Swagger** : Documentation de l'API.

## 🚀 Pour Commencer

### Prérequis

*   Docker & Docker Compose
*   Node.js 20+ (pour le développement local)

### Lancer la Stack

1.  **Démarrer tous les services** :
    ```bash
    cd DeepSea/docker
    docker-compose up --build
    ```

2.  **Accéder aux APIs** :
    *   **Observation Service** : `http://localhost:4002`
        *   Swagger : `http://localhost:4002/api-docs`
    *   **Taxonomy Service** : `http://localhost:4003`
        *   Swagger : `http://localhost:4003/api-docs`
    *   **PgAdmin** (Interface Base de Données) : `http://localhost:5050`
        *   Email : `admin@deepsea.com`
        *   Mot de passe : `admin`

### Commandes de Développement

Exécutez ces commandes depuis la racine ou les répertoires spécifiques des services :

*   `npm install` : Installer les dépendances.
*   `npm run dev` : Démarrer en mode développement (avec rechargement à chaud).
*   `npx prisma generate` : Générer le client Prisma (dans `observation-service` ou `auth-service`).
*   `npx prisma migrate dev` : Exécuter les migrations de base de données.

## 📚 Documentation

*   **Flux d'Architecture** : Voir [docs/architecture_flow.md](docs/architecture_flow.md) pour un diagramme Mermaid.
*   **Docs API** : Disponibles via l'interface Swagger sur les services en cours d'exécution.

## 🧪 Tests

*   **Tests Unitaires** : `npm test` (par service).
*   **Intégration** : Lancez la stack complète via Docker et utilisez Postman/Insomnia.

## 👥 Contributeurs

*   **Baptiste** : Auth Service
*   **Stephane** : Observation Service & Taxonomy Service
