const util = require('util');
const exec = util.promisify(require("child_process").exec);
const fs = require("fs").promises;

const CONFIG = {
    dbFile: "/home/erabliere/ErabliCollecteur/raw_events.sqlite3",
    logPath: "/home/erabliere/ErabliWatchDog/log/restart.log",
    timeoutLimit: 299,
    services: [
        "ErabliCollecteur.service",
        "ErabliDash.service",
        "ErabliExport.service",
    ],
};

async function checkActivity() {
    try {
        const stats = await fs.stat(CONFIG.dbFile);
        const timeNow = Date.now() / 1000;
        const fileTime = stats.mtime.getTime() / 1000;
        const timeDiff = Math.floor(timeNow - fileTime);

        console.log(
            `Vérification du fonctionnement du Collecteur de données! Delta t: ${timeDiff} sec.`
        );

        if (timeDiff > CONFIG.timeoutLimit) {
            const logMessage = `Re-demarrage du collecteur: ${new Date()}, file size: ${
                stats.size
            }b, Last mod.: ${stats.mtime}, delta t: ${timeDiff} sec.\n`;
            await fs.appendFile(CONFIG.logPath, logMessage, "utf-8");
            await restartCollecteur();
        }
    } catch (error) {
        console.error("Error during activity check:", error);
        // Could add notification system here
    }
}

async function restartCollecteur() {
    for (const service of CONFIG.services) {
        try {
            console.log(`Restarting ${service}...`);
            const { stdout, stderr } = await exec(
                `systemctl restart ${service}`
            );
            if (stderr) console.error(`${service} stderr:`, stderr);
            if (stdout) console.log(`${service} stdout:`, stdout);
        } catch (error) {
            console.error(`Failed to restart ${service}:`, error);
            // Could add notification system here
            throw error; // Stop trying to restart other services if one fails
        }
    }
}

checkActivity().catch(console.error);
