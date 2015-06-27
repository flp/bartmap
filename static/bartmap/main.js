var API_KEY = 'QAVH-UAY7-IQZQ-DT35'
var BASE_URL = 'http://api.bart.gov/api'

/**
 * Object that represents an estimated time of departure for a station.
 * What an estimate means: a train is estimated to leave from 'stationName' 
 * towards 'destination' in 'minutes' minutes and 'direction' direction.
 */
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
    new AdjacentStations("west-oakland", null, "montgomery-st", null),
  "montgomery-st":
    new AdjacentStations("embarcadero", null, "powell-st", null),
  "powell-st":
    new AdjacentStations("montgomery-st", null, "civic-center", null),
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
// Currently, only stations on the Richmond line are present.
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

  "embarcadero_montgomery-st": 2,
  "montgomery-st_embarcadero": 2,

  "montgomery-st_powell-st": 2,
  "powell-st_montgomery-st": 2,

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
  var estimates = parseBartXML(xmlData);
  console.log("Fetched estimates for {0}.".format(estimates[0].stationName));
}

function getAdjacentRedTrains(stationName, estimates) {
  /**
   * Finds estimates of adjacent trains for a station from an array of estimates.
   * 
   * Args:
   *   stationName - name of station, e.g. 'richmond'.
   *   estimates - Array of Estimates.
   *
   * Returns:
   *   Dictionary mapping destinations to arrays of adjacent estimates.
   */
  // Get adjacent stations.
  var adjacentStations = adjacentStationsDictionary[stationName];
  var adjacentMillbraeStation = adjacentStations.south;
  var adjacentRichmondStation = adjacentStations.north;

  // Get time distances to adjacent stations.
  var adjacentMillbraeTimeDistance = null;
  var adjacentRichmondTimeDistance = null;
  if (adjacentMillbraeStation != null) {
    var key = stationName + "_" + adjacentMillbraeStation;
    adjacentMillbraeTimeDistance = stationEstimatesDictionary[key];
  }
  if (adjacentRichmondStation != null) {
    var key = stationName + "_" + adjacentRichmondStation;
    adjacentRichmondTimeDistance = stationEstimatesDictionary[key];
  }

  // Find nearby trains.
  var adjacentEstimates = {
    "millbrae": [],
    "richmond": []
  }
  for (var i = 0; i < estimates.length; i++) {
    // Trains going in the millbrae direction should be compared 
    if (estimates[i].destination.toLowerCase() == "millbrae" &&
        parseInt(estimates[i].minutes) <= adjacentMillbraeTimeDistance &&
        estimates[i].color == "RED") {
      adjacentEstimates["millbrae"].push(estimates[i]);
    } else if (
        estimates[i].destination.toLowerCase() == "richmond" &&
        parseInt(estimates[i].minutes) <= adjacentMillbraeTimeDistance &&
        estimates[i].color == "RED") {
      adjacentEstimates["richmond"].push(estimates[i]);
    }
  }
  return adjacentEstimates;
}

function getAdjacentRedTrainsTEST(stationName) {
  stationAbbr = stationDictionary[stationName];
  bartData = getDeparturesSynchronous(stationAbbr);
  estimates = parseBartXML(bartData);
  adjacentEstimates = getAdjacentRedTrains(stationName, estimates);
  return adjacentEstimates;
}

/* ************************************************************************* */
// DRAWING CODE

/**
 * Dictionary mapping stations to train spots data.
 *
 * Data is in the form of dictionaries mapping destinations to arrays of ids. Arrays are ordered by
 * distance to station in descending order.
 */
var trainSpotsDictionary = {
  'richmond': // end-of-line station
    {
      'millbrae': ['deln-plza-0', 'rich-deln-3', 'rich-deln-2', 'rich-deln-1'],
      'richmond': []
    },
  'el-cerrito-del-norte':
    {
      'millbrae': ['rich-deln-0', 'rich-deln-1', 'rich-deln-2', 'rich-deln-3'],
      'richmond': ['plza-nbrk-0', 'deln-plza-2', 'deln-plza-1']
    },
  'el-cerrito-plaza':
    {
      'millbrae': ['deln-plza-0', 'deln-plza-1', 'deln-plza-2'],
      'richmond': ['nbrk-dbrk-0', 'plza-nbrk-3', 'plza-nbrk-2', 'plza-nbrk-1']
    },
  'north-berkeley':
    {
      'millbrae': ['plza-nbrk-0', 'plza-nbrk-1', 'plza-nbrk-2', 'plza-nbrk-3'],
      'richmond': ['dbrk-ashb-0', 'nbrk-dbrk-1']
    },
  'downtown-berkeley':
    {
      'millbrae': ['nbrk-dbrk-0', 'nbrk-dbrk-1'],
      'richmond': ['ashb-mcar-0', 'dbrk-ashb-1']
    },
  'ashby':
    {
      'millbrae': ['dbrk-ashb-0', 'dbrk-ashb-1'],
      'richmond': ['mcar-19th-0', 'ashb-mcar-2', 'ashb-mcar-1', 'ashb-mcar-0']
    },
  'macarthur':
    {
      'millbrae': ['ashb-mcar-0', 'ashb-mcar-1', 'ashb-mcar-2'],
      'richmond': ['n19th-12th-0', 'mcar-19th-3', 'mcar-19th-2', 'mcar-19th-1']
    },
  'nineteenth-st-oakland':
    {
      'millbrae': ['mcar-19th-0', 'mcar-19th-1', 'mcar-19th-2', 'mcar-19th-3'],
      'richmond': ['n12th-woak-0', 'n19th-12th-1']
    },
  'twelfth-st-oakland':
    {
      'millbrae': ['n19th-12th-0', 'n19th-12th-1'],
      'richmond': ['woak-embr-0', 'n12th-woak-4', 'n12th-woak-3', 'n12th-woak-2', 'n12th-woak-1']
    },
  'west-oakland':
    {
      'millbrae': ['n12th-woak-0', 'n12th-woak-1', 'n12th-woak-2', 'n12th-woak-3', 'n12th-woak-4'],
      'richmond': ['embr-mont-0', 'woak-embr-7', 'woak-embr-6', 'woak-embr-5', 'woak-embr-4',
                   'woak-embr-3', 'woak-embr-2', 'woak-embr-1']
    },
  'embarcadero':
    {
      'millbrae': ['woak-embr-0', 'woak-embr-1', 'woak-embr-2', 'woak-embr-3', 'woak-embr-4',
                   'woak-embr-5', 'woak-embr-6', 'woak-embr-7'],
      'richmond': ['mont-powl-0', 'embr-mont-1']
    },
  'montgomery-st':
    {
      'millbrae': ['embr-mont-0', 'embr-mont-1'],
      'richmond': ['powl-civc-0', 'mont-powl-1']
    },
  'powell-st':
    {
      'millbrae': ['mont-powl-0', 'mont-powl-1'],
      'richmond': ['civc-16th-0', 'powl-civc-1']
    },
  'civic-center':
    {
      'millbrae': ['powl-civc-0', 'powl-civc-1'],
      'richmond': ['n16th-24th-0', 'civc-16th-1']
    },
  'sixteenth-st-mission':
    {
      'millbrae': ['civc-16th-0', 'civc-16th-1'],
      'richmond': ['n24th-glen-0', 'n16th-24th-1']
    },
  'twentyfourth-st-mission':
    {
      'millbrae': ['n16th-24th-0', 'n16th-24th-1'],
      'richmond': ['glen-balb-0', 'n24th-glen-2', 'n24th-glen-1'],
    },
  'glen-park':
    {
      'millbrae': ['n24th-glen-0', 'n24th-glen-1', 'n24th-glen-2'],
      'richmond': ['balb-daly-0', 'glen-balb-1']
    },
  'balboa-park':
    {
      'millbrae': ['glen-balb-0', 'glen-balb-1'],
      'richmond': ['daly-colm-0', 'balb-daly-3', 'balb-daly-2', 'balb-daly-1']
    },
  'daly-city':
    {
      'millbrae': ['balb-daly-0', 'balb-daly-1', 'balb-daly-2', 'balb-daly-3'],
      'richmond': ['colm-ssan-0', 'daly-colm-3', 'daly-colm-2', 'daly-colm-1']
    },
  'colma':
    {
      'millbrae': ['daly-colm-0', 'daly-colm-1', 'daly-colm-2', 'daly-colm-3'],
      'richmond': ['ssan-sbrn-0', 'colm-ssan-2', 'colm-ssan-1']
    },
  'south-san-francisco':
    {
      'millbrae': ['colm-ssan-0', 'colm-ssan-1', 'colm-ssan-2'],
      'richmond': ['sbrn-mlbr-0', 'ssan-sbrn-3', 'ssan-sbrn-2', 'ssan-sbrn-1']
    },
  'san-bruno':
    {
      'millbrae': ['ssan-sbrn-0', 'ssan-sbrn-1', 'ssan-sbrn-2', 'ssan-sbrn-3'],
      'richmond': ['sbrn-mlbr-6', 'sbrn-mlbr-5', 'sbrn-mlbr-4', 'sbrn-mlbr-3', 'sbrn-mlbr-2', 'sbrn-mlbr-1']
    },
  'millbrae': // end-of-line station
    {
      'millbrae': [],
      'richmond': ['sbrn-mlbr-0', 'sbrn-mlbr-1', 'sbrn-mlbr-2', 'sbrn-mlbr-3', 'sbrn-mlbr-4', 'sbrn-mlbr-5']
    }
}

function getTrainSpots(station) {
  /**
   * Gets CSS ids of DOM elements where trains could be drawn for given station.
   *
   * Args:
   *   station - station name, e.g. 'richmond'
   *
   * Returns:
   *   Dictionary mapping destinations to arrays of ids. Arrays are ordered by distance to
   *   station in descending order.
   */ 
   return trainSpotsDictionary[station];
}

function getLiveTrainSpots(station, estimates) {
  /**
   * Gets CSS ids of DOM elements where trains should be drawn given current estimates.
   *
   * Args:
   *   station - station name, e.g. 'richmond'
   *   estimates - Array of Estimates.
   *
   * Returns:
   *   ids - CSS ids, CSS classes, and image names given as an array of arrays, where each inner
   *         array is [id, class, image].
   */
  // TODO: currently, two trains can be drawn on the same spot and will overlap one another.
  // there should be some way to tell that two trains are at the same spot, going opposite
  // directions.
  // console.log("Number of estimates for {0}: {1}".format(station, estimates.length));
  var ids = [];
  var adjacentRedTrains = getAdjacentRedTrains(station, estimates);
  // console.log("Number of adjacent estimates for {0}: {1}".format(
    // station, adjacentRedTrains['millbrae'].length + adjacentRedTrains['richmond'].length));
  var trainSpots = getTrainSpots(station);
  var adjacentStations = adjacentStationsDictionary[station];

  // Get average time to closest northern and southern stations.
  var northernStation = adjacentStations.north;
  var key = station + "_" + northernStation;
  var avgNorthTime = stationEstimatesDictionary[key];
  var southernStation = adjacentStations.south;
  key = station + "_" + southernStation;
  var avgSouthTime = stationEstimatesDictionary[key];

  // Use the adjacent estimates and train spots to figure out where to draw trains.
  // Need to check for end-of-line stations. E.g. trains going into Richmond are bound for
  // Millbrae but they are going north.
  if (station == 'richmond' || station == 'millbrae') { // end-of-line stations
    for (var i = 0; i < adjacentRedTrains['millbrae'].length; i++) {
      var estMinutes = adjacentRedTrains['millbrae'][i].minutes;
      var index = avgSouthTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['millbrae'][index], 'train-icon-top-right', 'train_icon_south.png']);
    }
    for (var i = 0; i < adjacentRedTrains['richmond'].length; i++) {
      var estMinutes = adjacentRedTrains['richmond'][i].minutes;
      var index = avgNorthTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['richmond'][index], 'train-icon-bottom-left', 'train_icon_north.png']);
    }
  } else { // all other stations
    for (var i = 0; i < adjacentRedTrains['millbrae'].length; i++) {
      var estMinutes = adjacentRedTrains['millbrae'][i].minutes;
      var index = avgNorthTime - estMinutes;
      ids.push([trainSpots['millbrae'][index], 'train-icon-bottom-left', 'train_icon_north.png']);
    }
    for (var i = 0; i < adjacentRedTrains['richmond'].length; i++) {
      var estMinutes = adjacentRedTrains['richmond'][i].minutes;
      var index = avgSouthTime - estMinutes;
      ids.push([trainSpots['richmond'][index], 'train-icon-top-right', 'train_icon_south.png']);
    }  
  }

  return ids;
}

function clearTrains() {
  /**
   * Removes train icons from the DOM.
   */
  $('.train-icon').remove();
}

function drawTrains(idsAndClassesAndImages) {
  /**
   * Draws trains.
   *
   * Args:
   *   idsAndClassesAndImages - Array of [CSS id to draw train in, CSS class to use for train icon,
                                          base name of image file].
   */
  for (var i = 0; i < idsAndClassesAndImages.length; i++) {
    var cssId = idsAndClassesAndImages[i][0];
    var cssClass = idsAndClassesAndImages[i][1];
    var imageName = idsAndClassesAndImages[i][2];
    var trainDiv = $('#' + cssId);
    trainDiv.append('<img class="train-icon {0}" src="/static/bartmap/images/{1}" />'.format(
      cssClass, imageName));
  }
}

// END DRAWING CODE
/* ************************************************************************* */

function run() {
  /**
   * Main event loop.
   */
  stations = Object.keys(stationDictionary);

  function logAdjacentTrains(stationName) {

    function doWork(xmlData) {
      estimates = parseBartXML(xmlData);
      if (estimates.length > 1) {
        adjacents = getAdjacentRedTrains(stationName, estimates);
        console.log("Adjacent trains for {0}:".format(stationName));
        millbraeAdjacents = adjacents["millbrae"];
        richmondAdjacents = adjacents["richmond"];
        for (var i = 0; i < millbraeAdjacents.length; i++) {
          console.log("Destination: {0}. Time to departure from {1}: {2}".format(
                      millbraeAdjacents[i].destination, stationName, 
                      millbraeAdjacents[i].minutes));
        }
        for (var i = 0; i < richmondAdjacents.length; i++) {
          console.log("Destination: {0}. Time to departure from {1}: {2}".format(
                      richmondAdjacents[i].destination, stationName, 
                      richmondAdjacents[i].minutes));
        }
        console.log("End output for {0}.".format(stationName));
        console.log("-------------------------------------------------------");
      }
    }

    return doWork;
  }

  // console.log("BEGIN NEW DATA");
  // for (var i = 0; i < stations.length; i++) {
  //   stationName = stations[i];
  //   stationAbbr = stationDictionary[stations[i]];
  // }

  function drawAdjacentTrains(station) {

    var fn = function(xmlData) {
      // TODO: test this
      // get adjacent train estimates
      var estimates = parseBartXML(xmlData);
      var drawIdsAndClasses = getLiveTrainSpots(station, estimates);
      // console.log("CSS ids to draw for {0}: {1}".format(station, drawIds));

      // draw on the draw spots
      drawTrains(drawIdsAndClasses);
    }
    return fn

  }
  
  // TODO: gather all train data in a single request
  clearTrains();
  for (var i = 0; i < stations.length; i++) {
    stationName = stations[i];
    stationAbbr = stationDictionary[stations[i]];
    //getDepartures(stationAbbr, logAdjacentTrains(stationName));
    getDepartures(stationAbbr, drawAdjacentTrains(stationName));
  }

}

$(document).ready(function() {
  $(".station").each(function() {
    $(this).click(function() {
      getDepartures(stationDictionary[$(this).attr("id")], showStationInfo);
    });
  });
  interval = 5*1000; // 5 seconds
  setInterval(run, interval);
});

