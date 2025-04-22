FRONTEND_PORT ?= 3001

## Lancer l'app en mode développement avec hot reload (backend Air + React)
.PHONY: dev
dev:
	@echo "🚀 Lancement DEV sur le port $(FRONTEND_PORT)"
	FRONTEND_PORT=$(FRONTEND_PORT) docker-compose -f docker-compose.dev.yml up --build

## Lancer sans rebuild (conteneurs déjà créés)
.PHONY: up
up:
	@echo "🔄 Démarrage sans rebuild"
	FRONTEND_PORT=$(FRONTEND_PORT) docker-compose -f docker-compose.dev.yml up -d

## Arrêter les conteneurs
.PHONY: stop
stop:
	@echo "🛑 Arrêt des conteneurs"
	docker-compose -f docker-compose.dev.yml down

## Nettoyer tout (conteneurs, volumes, réseaux orphelins)
.PHONY: clean
clean:
	@echo "🧹 Nettoyage complet"
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans

## Lancer l'environnement de production (frontend + backend + nginx)
.PHONY: prod
prod:
	@echo "🚀 Lancement en mode PROD"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build

## Afficher les logs de tous les conteneurs
.PHONY: logs
logs:
	@echo "📡 Logs de tous les services"
	docker-compose -f docker-compose.dev.yml logs -f

## Rebuild complet sans cache
.PHONY: rebuild
rebuild:
	@echo "🔧 Rebuild total"
	docker-compose build --no-cache

## Nettoyage d'images Docker non utilisées
.PHONY: prune
prune:
	@echo "🧽 Docker system prune"
	docker system prune -f

.PHONY: reset
reset:
	@echo "🔥 Suppression complète de l'environnement Docker"
	docker-compose down -v --remove-orphans
	docker system prune -a --volumes -f
	docker volume prune -f
	docker network prune -f
	docker builder prune --all --force

## Reconstruire tout proprement (images et conteneurs)
.PHONY: rebuild
rebuild:
	@echo "🔧 Reconstruction complète"
	docker-compose build --no-cache

## Relancer tout après reset et rebuild
.PHONY: fresh-start
fresh-start: reset rebuild
	docker-compose up --build
