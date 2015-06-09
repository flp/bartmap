var API_KEY = 'QAVH-UAY7-IQZQ-DT35'
var BASE_URL = 'http://api.bart.gov/api'

// Object that represents an estimated time of departure for a station.
// What an estimate means: a train is estimated to leave from 'stationName' 
// towards 'destination' in 'minutes' minutes and 'direction' direction.
var Estimate = function(stationName, stationAbbr, destination, destAbbr,
                        minutes, platform, direction, length, color, hexColor,
                        bikeFlag) {
  this.stationName = stationName;
  this.stationAbbr = stationAbbr;
  this.destination = destination;
  this.destAbbr = destAbbr;
  this.minutes = minutes;
  this.platform = platform;
  this.direction = direction;
  this.length = length;
  this.color = color;
  this.hexColor = hexColor;
  this.bikeFlag = bikeFlag;
}

var AdjacentStations = function(north, east, south, west) {
  this.north = north;
  this.east = east;
  this.south = south;
  this.west = west;
}

var AdjacentDepartures = function(north, east, south, west) {
  this.north = north;
  this.east = east;
  this.south = south;
  this.west = west;
}

// This dictionary maps the html ids of the stations to the station
// abbrevations laid out by BART.
var stationDictionary = {
  "ashby": "ashb",
  "balboa-park": "balb",
  "civic-center": "civc",
  "colma": "colm",
  "daly-city": "daly",
  "downtown-berkeley": "dbrk",
  "el-cerrito-del-norte": "deln",
  "el-cerrito-plaza": "plza",
  "embarcadero": "embr",
  "glen-park": "glen",
  "macarthur": "mcar",
  "millbrae": "mlbr",
  "montgomery-st": "mont",
  "nineteenth-st-oakland": "19th",
  "north-berkeley": "nbrk",
  "powell-st": "powl",
  "richmond": "rich",
  "san-bruno": "sbrn",
  "sixteenth-st-mission": "16th",
  "south-san-francisco": "ssan",
  "twelfth-st-oakland": "12th",
  "twentyfourth-st-mission": "24th",
  "west-oakland": "woak",
}

var adjacentStationsDictionary = {
  // north, east, south, west
  "richmond":
    new AdjacentStations(null, null, 'el-cerrito-del-norte', null),
  "el-cerrito-del-norte":
    new AdjacentStations("richmond", null, "el-cerrito-plaza", null),
  "el-cerrito-plaza":
    new AdjacentStations("el-cerrito-del-norte", null, "north-berkeley", null),
  "north-berkeley":
    new AdjacentStations("el-cerrito-plaza", null, "downtown-berkeley", null),
  "downtown-berkeley":
    new AdjacentStations("north-berkeley", null, "ashby", null),
  "ashby":
    new AdjacentStations("downtown-berkeley", null, "macarthur", null),
  "macarthur":
    new AdjacentStations("ashby", null, "nineteenth-st-oakland", null),
  "nineteenth-st-oakland":
    new AdjacentStations("macarthur", null, "twelfth-st-oakland", null),
  "twelfth-st-oakland":
    new AdjacentStations("nineteenth-st-oakland", null, "west-oakland", null),
  "west-oakland":
    new AdjacentStations("twelfth-st-oakland", null, "embarcadero", null),
  "embarcadero":
    new AdjacentStations("west-oakland", null, "montgomery", null),
  "montgomery":
    new AdjacentStations("embarcadero", null, "powell-st", null),
  "powell-st":
    new AdjacentStations("montgomery", null, "civic-center", null),
  "civic-center":
    new AdjacentStations("powell-st", null, "sixteenth-st-mission", null),
  "sixteenth-st-mission":
    new AdjacentStations("civic-center", null, "twentyfourth-st-mission", null),
  "twentyfourth-st-mission":
    new AdjacentStations("sixteenth-st-mission", null, "glen-park", null),
  "glen-park":
    new AdjacentStations("twentyfourth-st-mission", null, "balboa-park", null),
  "balboa-park":
    new AdjacentStations("glen-park", null, "daly-city", null),
  "daly-city":
    new AdjacentStations("balboa-park", null, "colma", null),
  "colma":
    new AdjacentStations("daly-city", null, "south-san-francisco", null),
  "south-san-francisco":
    new AdjacentStations("colma", null, "san-bruno", null),
  "san-bruno":
    new AdjacentStations("south-san-francisco", null, "millbrae", null),
  "millbrae":
    new AdjacentStations("san-bruno", null, null, null),
}

// This dictionary maps adjacent stations to the average time, in minutes,
// it takes a train to go from one station to the other.
// Currently, only stations on the Richmond line are present and only in
// north - south ordering.
var stationEstimatesDictionary = {
  "richmond_el-cerrito-del-norte": 4,
  "el-cerrito-del-norte_richmond": 4,

  "el-cerrito-del-norte_el-cerrito-plaza": 3,
  "el-cerrito-plaza_el-cerrito-del-norte": 3,

  "el-cerrito-plaza_north-berkeley": 4,
  "north-berkeley_el-cerrito-plaza": 4,

  "north-berkeley_downtown-berkeley": 2,
  "downtown-berkeley_north-berkeley": 2,

  "downtown-berkeley_ashby": 2,
  "ashby_downtown-berkeley": 2,

  "ashby_macarthur": 3,
  "macarthur_ashby": 3,

  "macarthur_nineteenth-st-oakland": 4,
  "nineteenth-st-oakland_macarthur": 4,

  "nineteenth-st-oakland_twelfth-st-oakland": 2,
  "twelfth-st-oakland_nineteenth-st-oakland": 2,

  "twelfth-st-oakland_west-oakland": 5,
  "west-oakland_twelfth-st-oakland": 5,

  "west-oakland_embarcadero": 8,
  "embarcadero_west-oakland": 8,

  "embarcadero_montgomery": 2,
  "montgomery_embarcadero": 2,

  "montgomery_powell-st": 2,
  "powell-st_montgomery": 2,

  "powell-st_civic-center": 2,
  "civic-center_powell-st": 2,

  "civic-center_sixteenth-st-mission": 2,
  "sixteenth-st-mission_civic-center": 2,

  "sixteenth-st-mission_twentyfourth-st-mission": 2,
  "twentyfourth-st-mission_sixteenth-st-mission": 2,

  "twentyfourth-st-mission_glen-park": 3,
  "glen-park_twentyfourth-st-mission": 3,

  "glen-park_balboa-park": 2,
  "balboa-park_glen-park": 2,

  "balboa-park_daly-city": 4,
  "daly-city_balboa-park": 4,

  "daly-city_colma": 4,
  "colma_daly-city": 4,

  "colma_south-san-francisco": 3,
  "south-san-francisco_colma": 3,

  "south-san-francisco_san-bruno": 4,
  "san-bruno_south-san-francisco": 4,

  "san-bruno_millbrae": 6,
  "millbrae_san-bruno": 6,
}

String.prototype.format = function() {
  var str = this;
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    str = str.replace(reg, arguments[i]);
  }
  return str;
}

function getDepartures(station, callback) {
  var url = "{0}/{1}.aspx?key={2}&cmd={1}&orig={3}".format(
      BASE_URL, "etd", API_KEY, station)
  $.get(url, function(data) {
    callback(data)
  });
}

function getDeparturesSynchronous(station) {
  result = null;
  var url = "{0}/{1}.aspx?key={2}&cmd={1}&orig={3}".format(
      BASE_URL, "etd", API_KEY, station)
  $.ajax({
    url: url,
    success: function(data) {
               result = data;
             },
    async: false
  });
  return result;
}

function parseBartXML(xmlData) {
  $xml = $(xmlData);
  $rootXml = $xml.find("root");
  $stationXml = $rootXml.find("station");
  $etdXml = $stationXml.children("etd");

  var estimates = [];
  $etdXml.each(function() {
    $destination = $(this).find("destination").text();
    $destAbbr = $(this).find("abbr").text();
    $(this).children("estimate").each(function() {
      var estimate = new Estimate(
        $stationXml.find("name").text(), // stationName
        $stationXml.find("abbr").text(), // stationAbbr
        $destination, // destination
        $destAbbr, // destAbbr
        $(this).find("minutes").text(), // minutes
        $(this).find("platform").text(), // platform
        $(this).find("direction").text(), // direction
        $(this).find("length").text(), // length
        $(this).find("color").text(), // color
        $(this).find("hexcolor").text(), // hexColor
        $(this).find("bikeflag").text() // bikeFlag
      );
      estimates.push(estimate);
    });
  });

  return estimates;
}

function showStationInfo(xmlData) {
  estimates = parseBartXML(xmlData);
  console.log("Fetched estimates for {0}.".format(estimates[0].stationName));
}

function getAdjacentTrains(stationName, estimates) {
  // I have all of the estimates for the station
  // each estimate is a minute estimate for a destination and direction
  // i want to return only the estimates that put the train between this
  // station and an adjacent station.
  adjacentDepartures = new AdjacentDepartures([], [], [], []);
  adjacentStations = adjacentStationsDictionary[stationName];
}

function getAdjacentRedTrains(stationName, estimates) {
  // Get adjacent stations.
  adjacentStations = adjacentStationsDictionary[stationName];
  adjacentMillbraeStation = adjacentStations.south;
  adjacentRichmondStation = adjacentStations.north;

  // Get time distances to adjacent stations.
  adjacentMillbraeTimeDistance = null;
  adjacentRichmondTimeDistance = null;
  if (adjacentMillbraeStation != null) {
    key = stationName + "_" + adjacentMillbraeStation;
    adjacentMillbraeTimeDistance = stationEstimatesDictionary[key];
  }
  if (adjacentRichmondStation != null) {
    key = stationName + "_" + adjacentRichmondStation;
    adjacentRichmondTimeDistance = stationEstimatesDictionary[key];
  }

  // Find nearby trains.
  adjacentEstimates = {
    "millbrae": [],
    "richmond": []
  }
  for (var i = 0; i < estimates.length; i++) {
    if (estimates[i].destination.lower() == "millbrae" &&
        parseInt(estimates[i].minutes) <= adjacentMillbraeTimeDistance) {
      adjacentEstimates["millbrae"].push(estimates[i]);
    } else if (
        estimates[i].destination.lower() == "richmond" &&
        parseInt(estimates[i].minutes) <= adjacentMillbraeTimeDistance) {
      adjacentEstimates["richmond"].push(estimates[i]);
    }
  }
  return adjacentEstimates;
}

function getAdjacentRedTrainsTEST(stationName) {
  bartData = getDeparturesSynchronous(stationName);
  estimates = parseBartXML(bartData);
  adjacentEstimates = getAdjacentRedTrains(stationName, estimates);
  return adjacentEstimates;
}

$(document).ready(function() {
  $(".station").each(function() {
    $(this).click(function() {
      getDepartures(stationDictionary[$(this).attr("id")], showStationInfo);
    });
  });
});
