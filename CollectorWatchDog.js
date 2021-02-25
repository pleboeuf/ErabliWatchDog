const exec = require('child_process').exec;
const util = require('util');
const fs = require("fs"); //Load the filesystem module
const dbFile = "/home/erabliere/ErabliCollecteur/raw_events.sqlite3";
const logPath = "/home/erabliere/ErabliWatchDog/log/restart.log";
const timeoutLimit = 60; // 1 minutes

function checkActivity() {
	const stats = fs.statSync(dbFile);
	const fileSizeInBytes = stats["size"];
	const modTime = stats["mtime"];
	const date = new Date(modTime);
	// Check db fileTime
	var timeNow = new Date().getTime() / 1000;
	var fileTime = date.getTime() / 1000;

	// Compare the readings 
	var timeDiff = (timeNow - fileTime).toFixed(0);
	if (timeDiff > timeoutLimit) {
		fs.open(logPath, 'a', (err, fd) => {
			fs.write(fd, "Re-demarrage du collecteur: "  + Date() + ", file size: " + fileSizeInBytes + "b, Last mod.: " + modTime + ", delta t: " + timeDiff + " sec.\n", 'utf-8', 'a', (err, fd) => {
				if (err) { console.log(err);}
			});
		});
		// fs.close(fd);
		console.log("Red/marrage du Collecteur de données...");
		restartCollecteur();
	} else {
		console.log("Collecteur de données en fonctionnement! " + " Delta t: " + timeDiff + " sec.");
	}
	return;
}

function restartCollecteur(){
	var child = exec('systemctl restart ErabliCollecteur.service', function(error, stdout, stderr) {
		if (error) console.log(error);
		process.stdout.write(stdout);
		process.stderr.write(stderr);
		return 0;
	});
	var child = exec('systemctl restart ErabliDash.service', function(error, stdout, stderr) {
		if (error) console.log(error);
		process.stdout.write(stdout);
		process.stderr.write(stderr);
		return 0;
	});
	var child = exec('systemctl restart ErabliExport.service', function(error, stdout, stderr) {
		if (error) console.log(error);
		process.stdout.write(stdout);
		process.stderr.write(stderr);
		return 0;
	});
	return;
}

try {
	checkActivity();
} catch (error) {
	console.error(error);
}
// This file will be executed by CRON every 5 minutes
