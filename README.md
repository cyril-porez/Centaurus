# CENTAURUS - Suivi de santé des chevaux

CENTARUS est une application PWA destinée aux vétérinaires, soigneurs ou cavaliers, permettant de :
- Gérer les profils de chevaux (nom, race, age)
- Suivre l'évolution de leur poids
- Visualiser les données et graphiques
- Bénéficier d'un back-end sécurisé, conteneurisé et prét au déploiement

Afin de se suivre le bien etre des chevaux.

## Prérequis

- [Docker](https://www.docker.com/) & Docker Compose
- [Make](https://www.gnu.org/software/make/) (facultatif mais recommand�)
- [Git](https://git-scm.com/)
- Un navigateur web moderne
- [Go / Gin](https://gin-gonic.com/)
- [Air](https://github.com/cosmtrek/air) (hot reload Go)
- [Node.js](https://nodejs.org/)

## Installation rapide

### Cloner le projet

```bash
git clone https://github.com/cyril-porez/centaurus.git
cd centaurus

## Commandes Make disponibles

- `make dev` ? Démarrage local (hot reload, dev server React)
- `make preprod` ? Build intermédiaire (backend runtime + frontend compil�)
- `make prod` ? Déploiement complet de production
- `make stop` ? Arret des services
- `make up` ? Lancer sans rebuild (conteneurs déjà créés)
- `make clean` ? Nettoyage complet (volumes, conteneurs)
- `make logs` ? Affiche les logs de tous les services

## Interfaces accessibles

| Interface        | URL                         |
|------------------|------------------------------|
| Frontend         | http://localhost:3001        |
| Backend API      | http://localhost:8080/api/v1 |
| Swagger (API doc)| http://localhost:8080/swagger/index.html |
| PhpMyAdmin       | http://localhost:8081        |

## Fichiers importants

| Fichier                          | Role |
|----------------------------------|------|
| `Makefile`                       | Commandes courtes pour tous les contextes |
| `docker-compose.yml`             | Configuration de base |
| `docker-compose.dev.yml`        | Mode développement |
| `docker-compose.preprod.yml`    | Préproduction |
| `docker-compose.prod.yml`       | Production |
| `.env`                           | Variables denvironnement (base de données, ports...) |
| `.github/workflows/ci.yml`       | Pipeline GitHub Actions |

Déploiement automatique (CI/CD)

Le projet utilise GitHub Actions pour :

Lancer les tests (backend, frontend)

Générer les rapports de couverture

Déployer automatiquement via SSH sur un Raspberry Pi

Les secrets SSH (RPI_HOST, RPI_USER, RPI_SSH_PRIVATE_KEY, etc.) sont stockés dans GitHub :

?? Settings ? Secrets and variables ? Actions


Sécurisation HTTPS avec Let s Encrypt

Le serveur utilise NGINX en reverse proxy avec :

Certbot (ACME) pour générer les certificats HTTPS

DuckDNS pour le DNS dynamique (ex. centaurus.duckdns.org)

?? Le renouvellement est automatique grace à certbot renew via cron


Tests automatisés

Le pipeline GitHub Actions valide :

? Backend (Go) : go test ./... -race -cover

? Frontend (React) : npm test

? Couverture envoyée en artifact


Technologies utilisées
Domaine	Techno
Backend	Go / Gin
Frontend	React / Vite
BDD	MySQL
Authentification	JWT (access + refresh)
API Docs	Swagger (swaggo/swag)
Containerisation	Docker
CI/CD	GitHub Actions
Reverse proxy	NGINX + Certbot
Hébergement	Raspberry Pi + DuckDNS
Sécurité	HTTPS, Cookies HTTPOnly, RGPD
