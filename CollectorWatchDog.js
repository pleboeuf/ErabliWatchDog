var exec = require('child_process').exec;
const util = require('util');
const fs = require("fs"); //Load the filesystem module
const dbFile = "/Users/pierre/Documents/code-erabliere/ErabliCollecteur/raw_events.sqlite3";
const prevTimeStore = "/Users/pierre/Documents/code-erabliere/ErabliWatchDog/prevTime.txt";
const timeoutLimit = 180; // 3 minutes

function checkActivity() {
	var stats = fs.statSync(dbFile);
	var fileSizeInBytes = stats["size"];
	var modTime = stats["mtime"];
	var date = new Date(modTime);
	var prevFileTime = 0;
	// Check db fileTime
	var timeNow = new Date().getTime() / 1000;
	var fileTime = date.getTime() / 1000;

	// Compare the readings 
	var dt = (timeNow - fileTime).toFixed(0);
	console.log("File size is: " + fileSizeInBytes + ", Last mod. : " + modTime + ", dt: " + dt + " sec." + ", max delay: ");
	// if (diff > timeoutLimit) -> redémarrage requis!
	if (dt > timeoutLimit) {
		console.log("Attention: Le collecteur de données à cessez de fonctionner!!!" + ", Last mod. : " + modTime);
		console.log(" Re-demarrage du collecteur...");
		// restartCollecteur();
	} else {
		console.log("Collecteur de données en onctionnement!");
	}
}

function restartCollecteur(){
	var child = exec('systemctl restart ErabliCollecteur.service', function(error, stdout, stderr) {
		if (error) console.log(error);
		process.stdout.write(stdout);
		process.stderr.write(stderr);
		return 0;
	});
}


try {
	checkActivity();
} catch (error) {
	console.error(error);
}
// This file will be executed by CRON every minute