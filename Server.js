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
var startingDay = 1;
var startingMonth = 6;
var startingYear = 2025;
var initialPopulation = 7000000000;
var initialNumberOfZombies = 1;

var interval;
var currentValues;
var history;

var date;
var totalHumans;
var totalZombies;
var totalLiving;
var weekNumber;
var weekValue;
var lastWeekValue;
var numberOfLivingsKilled;
var numberOfZombiesKilled;
var DiedWithoutBeingZombified;

var livingsDeadByGun;
var zombiesDeadByGun;

var livingsDeadByAccident;
var zombiesDeadByAccident;

var livingsDeadByFire;
var zombiesDeadByFire;

var livingsDeadByDesease;

var livingsDeadByHunger;
var zombiesDeadByHunger;

var livingsDeadByDehydratation;

var livingsDeadByBladedWeapon;
var zombiesDeadByBladedWeapon;

var livingsDeadByTrap;
var zombiesDeadByTrap;

var livingsDeadByZombieBite;

var livingsDeadFromOtherReason;

// Methods
// When the API is running a simulation, this is the function called by the interval
function updateNumbers(){
	weekNumber = weekNumber + 1;
	date = addDays(date, 7);
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
	numberOfLivingsKilled = getNumberOfKilled();
	if (totalLiving - numberOfLivingsKilled <= 0){
		numberOfLivingsKilled = totalLiving;
		totalZombies = totalZombies + totalLiving;
		totalLiving = 0;
	} else {
		totalLiving = totalLiving - numberOfLivingsKilled;
		totalZombies = totalZombies + numberOfLivingsKilled;
	}
	generateLivingsDeadReasons();
	var temptotalLiving = totalLiving;
	console.log("Killing livings : " + temptotalLiving + " - " + numberOfLivingsKilled + " = " + totalLiving);
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

// Sets all the reasons of death variables for the Livings beings
function generateLivingsDeadReasons(){
	var totalPercent = 0;
	var currentPercent;
	var reasonValue;

	// Defining the modifier
	currentPercent = getCloseModifier(5) + 0.5;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	// Calculating the number of deaths from the percentage
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByZombieBite += reasonValue;
	
	currentPercent = getCloseModifier(3) + 0.15;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByGun += reasonValue;
	totalZombies -= reasonValue;
	DiedWithoutBeingZombified += reasonValue;
	
	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByAccident += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByBladedWeapon += reasonValue;
	totalZombies -= reasonValue;
	DiedWithoutBeingZombified += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByFire += reasonValue;
	totalZombies -= reasonValue;
	DiedWithoutBeingZombified += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByDesease += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByHunger += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByDehydratation += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfLivingsKilled * currentPercent);
	livingsDeadByTrap += reasonValue;
	totalZombies -= reasonValue;
	DiedWithoutBeingZombified += reasonValue;

	livingsDeadFromOtherReason += Math.floor((1 - totalPercent) * numberOfLivingsKilled);
}

// Returns a percentage modifier minor or minor of the given step (Ex : give 3, get a value between 0.03 and -0.03)
function getCloseModifier(step){
	var tempStep = step * 2 + 1;
	random = getRandomInt(tempStep) - step - 1;
	return random / 100;
}

// Kills the Zombies
function killZombies(){
	var tempTotalZombies = totalZombies;
	var ratio = 1 + (getRandomInt(25) / 100);
	var newNumberOfZombies = Math.floor(totalZombies / ratio);
	numberOfZombiesKilled = totalZombies - newNumberOfZombies;
	totalHumans = totalHumans - numberOfZombiesKilled;
	generateZombiesDeadReasons();
	totalZombies = newNumberOfZombies;
	console.log("Killing Zombies : " + tempTotalZombies + " - " + numberOfZombiesKilled + " = " + totalZombies);
}

// Returns a random integer between 1 and max given value
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max + 1));
}

// Sets all the reasons of death variables for the Zombies beings
function generateZombiesDeadReasons(){
	var totalPercent = 0;
	var currentPercent;
	var reasonValue;

	// Defining the modifier
	currentPercent = getCloseModifier(12) + 0.6;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	// Calculating the number of deaths from the percentage
	reasonValue = Math.floor(numberOfZombiesKilled * currentPercent);
	zombiesDeadByGun += reasonValue;

	currentPercent = getCloseModifier(4) + 0.2;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfZombiesKilled * currentPercent);
	zombiesDeadByBladedWeapon += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfZombiesKilled * currentPercent);
	zombiesDeadByAccident += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfZombiesKilled * currentPercent);
	zombiesDeadByHunger += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfZombiesKilled * currentPercent);
	zombiesDeadByFire += reasonValue;

	currentPercent = getCloseModifier(1) + 0.05;
	if (totalPercent + currentPercent >= 1){
		currentPercent = 1 - totalPercent;
		totalPercent = 1;
	}
	totalPercent += currentPercent;
	reasonValue = Math.floor(numberOfZombiesKilled * currentPercent);
	zombiesDeadByTrap += reasonValue;
}

// Adds the current value log to the history
function appendHistory(){
	history.push(currentValues);
}

// Sets the current values
function setCurrentValues(){
	currentValues = {
		totalZombies : totalZombies, 
		totalLiving : totalLiving, 
		weekNumber : weekNumber, 
		livingKilledThisWeek : numberOfLivingsKilled,
		zombiesKilledThisWeek : numberOfZombiesKilled,
		DiedWithoutBeingZombified : DiedWithoutBeingZombified,
		deathReasons : {
			livingsDeadByZombieBite : livingsDeadByZombieBite,
			livingsDeadByGun : livingsDeadByGun,
			livingsDeadByAccident : livingsDeadByAccident,
			livingsDeadByFire : livingsDeadByFire,
			livingsDeadByHunger : livingsDeadByHunger,
			livingsDeadByDesease :livingsDeadByDesease,
			livingsDeadByDehydratation : livingsDeadByDehydratation,
			livingsDeadByBladedWeapon : livingsDeadByBladedWeapon,
			livingsDeadByTrap : livingsDeadByTrap,
			livingsDeadFromOtherReason : livingsDeadFromOtherReason,
			zombiesDeadByGun : zombiesDeadByGun,
			zombiesDeadByAccident : zombiesDeadByAccident,
			zombiesDeadByFire : zombiesDeadByFire,
			zombiesDeadByHunger : zombiesDeadByHunger,
			zombiesDeadByBladedWeapon : zombiesDeadByBladedWeapon,
			zombiesDeadByTrap : zombiesDeadByTrap
		},
		day : date.getDate(), 
		month : date.getMonth(), 
		year : date.getFullYear()
	};
}

// Adds the given number of days to the given date
function addDays(date, days) {
	date.setDate(date.getDate() + days);
	return date;
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
	stopInterval();
	date = new Date(startingYear, startingMonth, startingDay);
	initialPopulation = population;
	totalHumans = population;
	totalZombies = initialNumberOfZombies;
	totalLiving = totalHumans - totalZombies;
	weekNumber = 0;
	weekValue = weekIncrementValue;
	lastWeekValue = 0;
	numberOfLivingsKilled = 0;
	numberOfZombiesKilled = 0;
	DiedWithoutBeingZombified = 0;

	livingsDeadByGun = 0;
	zombiesDeadByGun = 0;
	livingsDeadByAccident = 0;
	zombiesDeadByAccident = 0;
	livingsDeadByFire = 0;
	zombiesDeadByFire = 0;
	livingsDeadByDesease = 0;
	livingsDeadByHunger = 0;
	zombiesDeadByHunger = 0;
	livingsDeadByDehydratation = 0;
	livingsDeadByBladedWeapon = 0;
	zombiesDeadByBladedWeapon = 0;
	livingsDeadByTrap = 0;
	zombiesDeadByTrap = 0;
	livingsDeadByZombieBite = 0;
	livingsDeadFromOtherReason = 0;

	setCurrentValues();
	history = new Array();
	console.log("Server reset to population : " + population);
}

// Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(express.static(__dirname + '/public'));

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