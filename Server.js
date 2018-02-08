var express = require('express');

var app = express();
console.log('__dirname: '+__dirname);

var totalHumans;
var totalZombies;
var totalLiving;
var weekNumber;
var weekValue;
var lastWeekValue;
var interval;

function updateNumbers(){
	weekNumber = weekNumber + 1;
	if (totalZombies > 0 && totalLiving > 0){
		killLivings();
		killZombies();
	}
	lastWeekValue = weekValue;
	weekValue += 30/540;
}

function killLivings(){
	console.log("Killing livings : " + totalLiving);
	var numberOfKilled = getNumberOfKilled();
	console.log(numberOfKilled);
	if (totalLiving - numberOfKilled <= 0){
		totalZombies = totalZombies + totalLiving;
		totalLiving = 0;
	} else {
		totalLiving = totalLiving - numberOfKilled;
		totalZombies = totalZombies + numberOfKilled;
	}
	
}

function getNumberOfKilled(){
	if (lastWeekValue == 0){
		console.log("Ratio : " + getRatio(weekValue));
		console.log(Math.ceil(totalHumans - totalHumans * getRatio(weekValue)));
		return Math.ceil(totalHumans - totalHumans * getRatio(weekValue));
	} else {
		return Math.ceil((totalHumans - totalHumans * getRatio(weekValue)) - (totalHumans - totalHumans * getRatio(lastWeekValue)));
	}
}

function getRatio(x){
	return (6 / (-1 + (-4 * Math.exp(-0.6 * (x -7)))) + 6)/ 5.97683401013034;
}

function killZombies(){
	console.log("Killing Zombies : " + totalZombies);
	var ratio = 1 + (getRandomInt(10) / 10);
	totalZombies = Math.floor(totalZombies / ratio);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max + 1));
}

function resetToPopulation(population){
	totalHumans = population;
	totalZombies = 1;
	totalLiving = totalHumans - totalZombies;
	weekNumber = 0;
	weekValue = 30/540;
	lastWeekValue = 0;
}

// Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(express.static(__dirname + '/public'));

// Testing Route
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json;');
	var object = { name : 'name' , test : 'test', number : 5};
    res.end(JSON.stringify(object));
});

app.get('/getTotalZombifiedHumans', function(req, res) {
    res.setHeader('Content-Type', 'application/json;');
	var responseObject = { totalLiving : totalLiving , totalZombies : totalZombies, totalHumans : totalHumans};
    res.end(JSON.stringify(responseObject));
});

app.get('/resetForPopulation/:population', function(req, res) {
	if (interval != undefined && interval != null){
		clearInterval(interval);
	}
	resetToPopulation(req.params.population);
});

app.get('/start', function(req, res){
	interval = setInterval(updateNumbers, 100);
});

app.get('/stop', function(req, res){
	clearInterval(interval);
});

app.get('/reset', function(req, res){
	resetToPopulation(totalHumans);
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

resetToPopulation(7000000000);
app.listen(8080);