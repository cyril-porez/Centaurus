#!/bin/sh

echo "⏳ Attente de MySQL..."
until  nc -z -v -w30 mysql 3306; do
  echo "⏳ MySQL n'est pas encore prêt..."
  sleep 2
done

echo "✅ MySQL est prêt, démarrage de l'application..."
exec "$@"