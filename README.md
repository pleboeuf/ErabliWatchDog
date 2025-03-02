# ErabliWatchDog

Le program CollectorWatchDog.js doit être exécuter par root crontab

Vérifier la version de node courante avec la commande node -v
Corriger la ligne de commande crontab avec ce numéro de version.

Ajouter avec la commande:
	 sudo crontab -e

*/5 * * * * /home/erabliere/.nvm/versions/node/v22.13.1/bin/node /home/erabliere/ErabliWatchDog/CollectorWatchDog.js >/dev/null 2>&1 | logger -t ColRestartLog

Pour désactivé le démarrage automatique, commenter la ligne avec: #
