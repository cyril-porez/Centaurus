FRONTEND_PORT ?= 3001
DOMAIN ?= centaurus-preprod.duckdns.org
EMAIL  ?= cyril.porez@laplateforme.io

COMPOSE_DEV := docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.dev.yml
COMPOSE_PREPROD := docker compose -f docker-compose.yml -f docker-compose.preprod.yml
SUDO ?= sudo



DOCKER_TTY :=
ifneq ($(shell test -t 1 && echo yes),)
  DOCKER_TTY=-t
endif

# ------------------------ DEV -----------------------

## Lancer l'app en mode développement avec hot reload (backend Air + React)
.PHONY: dev
dev:
	@echo "🚀 Lancement DEV sur le port $(FRONTEND_PORT)"
	FRONTEND_PORT=$(FRONTEND_PORT) $(COMPOSE_DEV) up --build

## Lancer sans rebuild (conteneurs déjà créés)
.PHONY: up
up:
	@echo "Démarrage sans rebuild"
	FRONTEND_PORT=$(FRONTEND_PORT) $(COMPOSE_DEV) up -d

## Arrêter les conteneurs
.PHONY: stop
stop:
	@echo "Arrêt des conteneurs"
	$(COMPOSE_DEV) down

.PHONY: logs
logs:
	@echo "Logs DEV"
	$(COMPOSE_DEV) logs -f

## Nettoyer tout (conteneurs, volumes, réseaux orphelins)
.PHONY: clean
clean:
	@echo "🧹 Nettoyage complet"
	docker compose -f docker-compose.dev.yml down -v --remove-orphans

# ------------------------ PREPROD -----------------------
.PHONY: preprod
preprod:
	@echo "Déploiement PREPROD"
	@echo "?? Pr�paration dossiers certbot"
	@$(SUDO) install -d -o "$(USER)" -g "$(USER)" -m 755 certbot/www/.well-known/acme-challenge
	@$(SUDO) install -d -o "$(USER)" -g "$(USER)" -m 755 certbot/conf/live/$(DOMAIN)
	@echo "?? Lancement PREPROD (build + up)"
	@$(COMPOSE_PREPROD) up -d --build
	@echo "?? V�rif Nginx dans frontend_pwa"
	@docker exec $(DOCKER_TTY) frontend_pwa nginx -t
	@docker exec $(DOCKER_TTY) frontend_pwa nginx -s reload
	@echo "? Tests rapides"
	-@echo "HTTP:  " && curl -sI http://$(DOMAIN)  | head -n1 || true
	-@echo "HTTPS: " && curl -sI https://$(DOMAIN) | head -n1 || true

.PHONY: down-preprod
down-preprod:
	@echo "Stop PREPROD"
	$(COMPOSE_PREPROD) down --remove-orphans

# Premi�re �mission du certificat Let's Encrypt via webroot
.PHONY: cert-init
cert-init:
	@echo "?? �mission du cert Let's Encrypt pour $(DOMAIN)"
	@$(COMPOSE_PREPROD) up -d frontend-pwa
	@docker run --rm -it \
	  -v "$(PWD)/certbot/conf:/etc/letsencrypt" \
	  -v "$(PWD)/certbot/www:/var/www/certbot" \
	  certbot/certbot certonly --webroot \
	  -w /var/www/certbot \
	  -d $(DOMAIN) \
	  --email $(EMAIL) --agree-tos --no-eff-email
	@echo "?? Lien canonique live/$(DOMAIN) ? dernier dossier �mis"
	@cd certbot/conf/live && \
	  latest="$$(ls -d $(DOMAIN)-* 2>/dev/null | sort | tail -n1)"; \
	  if [ -n "$$latest" ]; then sudo ln -sfn "$$latest" "$(DOMAIN)"; fi
	@docker exec -it frontend_pwa nginx -s reload
	-@curl -sI https://$(DOMAIN) | head -n1 || true

# Renouvellement du certificat + reload Nginx
.PHONY: cert-renew
cert-renew:
	@docker run --rm \
	  -v "$(PWD)/certbot/conf:/etc/letsencrypt" \
	  -v "$(PWD)/certbot/www:/var/www/certbot" \
	  certbot/certbot renew --webroot -w /var/www/certbot
	@docker exec -it frontend_pwa nginx -s reload

# Debug Nginx et certs
.PHONY: check
check:
	@echo "?? Nginx -T (d�but)"
	@docker exec -it frontend_pwa nginx -T | sed -n '1,220p'
	@echo "?? Certs:"
	@sudo ls -l certbot/conf/live


# ------------------------ PROD -----------------------

## Lancer l'environnement de production (frontend + backend + nginx)
.PHONY: prod
prod:
	@echo "🚀 Lancement en mode PROD"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build


# ----------------------- DOCKER GLOBAL -------------------

## Rebuild complet sans cache
.PHONY: rebuild
rebuild:
	@echo "🔧 Rebuild total"
	docker compose build --no-cache

## Nettoyage d'images Docker non utilisées
.PHONY: prune
prune:
	@echo "🧽 Docker system prune"
	docker system prune -f

.PHONY: reset
reset:
	@echo "🔥 Suppression complète de l'environnement Docker"
	docker compose down -v --remove-orphans
	docker system prune -a --volumes -f
	docker volume prune -f
	docker network prune -f
	docker builder prune --all --force

## Reconstruire tout proprement (images et conteneurs)
.PHONY: rebuild
rebuild:
	@echo "🔧 Reconstruction complète"
	docker compose build --no-cache

## Relancer tout après reset et rebuild
.PHONY: fresh-start
fresh-start: reset rebuild
	docker compose up --build
