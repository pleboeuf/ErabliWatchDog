# ErabliWatchDog

Le program CollectorWatchDog.js doit être exécuter par root crontab
Ajouter avec la commande sudo crontab -e

*/5 * * * * /home/erabliere/.nvm/versions/node/v14.15.4/bin/node /home/erabliere/ErabliWatchDog/CollectorWatchDog.js >/dev/null 2>&1 | logger -t ColRestartLog
