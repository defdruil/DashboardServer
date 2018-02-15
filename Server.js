var express = require('express');

var app = express();
// Initial Log
console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');
console.log('LLLLLLLLLLL ZOMBIE SERVER STARTED LLLLLLLLLLL');
console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL');

console.log('App __dirname : ' +__dirname);

// Constants
const portNumber = 8080;
const weekIncrementValue = 30/540;

// Variables
var initialPopulation = 7000000000;
var history;
var totalHumans;
var totalZombies;
var totalLiving;
var weekNumber;
var weekValue;
var lastWeekValue;
var interval;
var currentValues;

// Methods
// When the API is running a simulation, this is the function called by the interval
function updateNumbers(){
	weekNumber = weekNumber + 1;
	if (totalZombies > 0 && totalLiving > 0){
		killLivings();
		killZombies();
		appendHistory();
		setCurrentValues();
	} else {
		if (totalZombies > 0)
			console.log("Livings won.");
		else {
			console.log("Zombies won.");
		}
	}
	lastWeekValue = weekValue;
	weekValue += weekIncrementValue;
}

// Kill the Livings for the current week
function killLivings(){
	var numberOfKilled = getNumberOfKilled();
	//console.log(numberOfKilled);
	if (totalLiving - numberOfKilled <= 0){
		totalZombies = totalZombies + totalLiving;
		totalLiving = 0;
	} else {
		totalLiving = totalLiving - numberOfKilled;
		totalZombies = totalZombies + numberOfKilled;
	}
	var temptotalLiving = totalLiving;
	console.log("Killing livings : " + temptotalLiving + " - " + numberOfKilled + " = " + totalLiving);
}

// Returns the number of Living Killed for the current week
function getNumberOfKilled(){
	if (lastWeekValue == 0){
		console.log("Ratio : " + getRatio(weekValue));
		console.log(Math.ceil(initialPopulation - initialPopulation * getRatio(weekValue)));
		return Math.ceil(initialPopulation - initialPopulation * getRatio(weekValue));
	} else {
		return Math.ceil((initialPopulation - initialPopulation * getRatio(weekValue)) - (initialPopulation - initialPopulation * getRatio(lastWeekValue)));
	}
}

// Returns the ratio of deaths based on the weekValue
function getRatio(x){
	return (6 / (-1 + (-4 * Math.exp(-0.6 * (x -7)))) + 6)/ 5.97683401013034;
}

// Kills the Zombies
function killZombies(){
	var tempTotalZombies = totalZombies;
	var ratio = 1 + (getRandomInt(6) / 10);
	var newNumberOfZombies = Math.floor(totalZombies / ratio);
	var numberOfZombiesKilles = totalZombies - newNumberOfZombies;
	totalHumans = totalHumans - numberOfZombiesKilles;
	totalZombies = newNumberOfZombies;
	console.log("Killing Zombies : " + tempTotalZombies + " - " + numberOfZombiesKilles + " = " + totalZombies);
}

// Returns a random integer between 1 and max given value
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max + 1));
}

// Adds the current value log to the history
function appendHistory(){
	history.push(currentValues);
}

// Sets the current values
function setCurrentValues(){
	currentValues = {totalHumans : totalHumans, totalZombies : totalZombies, totalLiving : totalLiving, weekNumber : weekNumber, weekValue : weekValue}
}

// Starts the interval for simulation
function startInterval(){
	stopInterval();
	interval = setInterval(updateNumbers, 100);
	console.log("Interval started.");
}

// Stops the interval for simulation
function stopInterval(){
	if (interval != undefined && interval != null){
		clearInterval(interval);
		console.log("Interval stopped.");
	} else {
		console.log("Interval was already off");
	}
}

// Resets the initial values for the given population
function resetToPopulation(population){
	initialPopulation = population;
	totalHumans = population;
	totalZombies = 1;
	totalLiving = totalHumans - totalZombies;
	weekNumber = 0;
	weekValue = weekIncrementValue;
	lastWeekValue = 0;
	setCurrentValues();
	history = new Array();
	console.log("Server reset to population : " + population);
}

// Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(express.static(__dirname + '/public'));

// Testing Route
/*app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json;');
	var object = { name : 'name' , test : 'test', number : 5};
    res.end(JSON.stringify(object));
});*/

// Route that returns the current values of the server for the current simulation
app.get('/currentValues', function (req, res ){
	console.log("Current values requested.");
	res.setHeader('Content-Type', 'application/json;');
	var responseObject = currentValues;
	res.end(JSON.stringify(responseObject));
});

// Route that returns the history of the server for the current simulation
app.get('/getHistory', function(req, res) {
	console.log("History requested.");
    res.setHeader('Content-Type', 'application/json;');
	var responseObject = history;
	res.end(JSON.stringify(responseObject));
});

// Route that allows the user to give a custom number of population
app.get('/resetForPopulation/:population', function(req, res) {
	console.log("Reset with new population requested.");
	res.setHeader('Content-Type', 'application/json;');
	stopInterval();
	resetToPopulation(req.params.population);
	res.end(JSON.stringify(true));
});

// Route to call to start the simulation
app.get('/start', function(req, res){
	console.log("Start requested.");
	res.setHeader('Content-Type', 'application/json;');
	startInterval();
	res.end(JSON.stringify(true));
});

// Route to call to stop the simulation
app.get('/stop', function(req, res){
	console.log("Stop requested.");
	res.setHeader('Content-Type', 'application/json;');
	stopInterval();
	res.end(JSON.stringify(true));
});

// Route to call to reset the simulation
app.get('/reset', function(req, res){
	console.log("Reset requested.");
	res.setHeader('Content-Type', 'application/json;');
	resetToPopulation(initialPopulation);
	res.end(JSON.stringify(true));
});

// Default 404 page
app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page introuvable !');
	console.log("Unknown page requested");
});

// Launch the listening to the app
resetToPopulation(initialPopulation);
console.log("Listening to port " + portNumber);
app.listen(portNumber);