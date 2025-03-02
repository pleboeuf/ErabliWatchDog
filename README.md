# ErabliWatchDog

Le program CollectorWatchDog.js doit être exécuter par root crontab

Exécuter node -v pour connaitre la version de node en utilisation et corrigé la commande crontab avec cet valeur.

Ajouter avec la commande:
sudo crontab -e

_/5 _ \* \* \* /home/erabliere/.nvm/versions/node/v22.13.1/bin/node /home/erabliere/ErabliWatchDog/CollectorWatchDog.js >/dev/null 2>&1 | logger -t ColRestartLog

Pour désactivé le démarrage automatique, commenter la ligne avec: #
