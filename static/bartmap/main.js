// Green and Blue go east-west
// Red, Orange, and Yellow go north-south

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
// TODO: do we need this anymore? depends if we want to do anything with the station links
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

var stationNameDictionary = {
  // maps names from Bart API to a standard format
  '12th St. Oakland City Center': 'twelfth-st-oakland',
  '16th St. Mission': 'sixteenth-st-mission',
  '19th St. Oakland': 'nineteenth-st-oakland',
  '24th St. Mission': 'twentyfourth-st-mission',
  'Ashby': 'ashby',
  'Balboa Park': 'balboa-park',
  'Bay Fair': 'bay-fair',
  'Castro Valley': 'castro-valley',
  'Civic Center/UN Plaza': 'civic-center',
  'Colma': 'colma',
  'Coliseum/Oakland Airport': 'coliseum',
  'Concord': 'concord',
  'Daly City': 'daly-city',
  'Downtown Berkeley': 'downtown-berkeley',
  'Dublin/Pleasanton': 'dublin',
  'El Cerrito del Norte': 'el-cerrito-del-norte',
  'El Cerrito Plaza': 'el-cerrito-plaza',
  'Embarcadero': 'embarcadero',
  'Fremont': 'fremont',
  'Fruitvale': 'fruitvale',
  'Glen Park': 'glen-park',
  'Hayward': 'hayward',
  'Lafayette': 'lafayette',
  'Lake Merritt': 'lake-merrit',
  'MacArthur': 'macarthur',
  'Millbrae': 'millbrae',
  'Montgomery St.': 'montgomery-st',
  'North Berkeley': 'north-berkeley',
  'North Concord/Martinez': 'north-concord',
  'Orinda': 'orinda',
  'Rockridge': 'rockridge',
  'Pittsburg/Bay Point': 'pittsburg',
  'Pleasant Hill': 'pleasant-hill',
  'Powell St.': 'powell-st',
  'Richmond': 'richmond',
  'San Bruno': 'san-bruno',
  'San Francisco Int\'l Airport': 'sfo',
  'San Leandro': 'san-leandro',
  'South Hayward': 'south-hayward',
  'South San Francisco': 'south-san-francisco',
  'Union City': 'union-city',
  'Walnut Creek': 'walnut-creek',
  'West Dublin': 'west-dublin',
  'West Oakland': 'west-oakland',
}

var blueStations = {
  'dublin': true,
  'west-dublin': true,
  'castro-valley': true,
  'bay-fair': true,
  'san-leandro': true,
  'coliseum': true,
  'fruitvale': true,
  'lake-merrit': true,
  'west-oakland': true,
  'embarcadero': true,
  'montgomery': true,
  'powell-st': true,
  'civic-center': true,
  'sixteenth-st-mission': true,
  'twentyfourth-st-mission': true,
  'glen-park': true,
  'balboa-park': true,
  'daly-city': true,
}

var greenStations = {
  'fremont': true,
  'union-city': true,
  'south-hayward': true,
  'hayward': true,
  'bay-fair': true,
  'san-leandro': true,
  'coliseum': true,
  'fruitvale': true,
  'lake-merrit': true,
  'west-oakland': true,
  'embarcadero': true,
  'montgomery': true,
  'powell-st': true,
  'civic-center': true,
  'sixteenth-st-mission': true,
  'twentyfourth-st-mission': true,
  'glen-park': true,
  'balboa-park': true,
  'daly-city': true
}

var orangeStations = {
  'richmond': true,
  'el-cerrito-del-norte': true,
  'el-cerrito-plaza': true,
  'north-berkeley': true,
  'downtown-berkeley': true,
  'ashby': true,
  'macarthur': true,
  'nineteenth-st-oakland': true,
  'twelfth-st-oakland': true,
  'lake-merrit': true,
  'fruitvale': true,
  'coliseum': true,
  'san-leandro': true,
  'bay-fair': true,
  'hayward': true,
  'south-hayward': true,
  'union-city': true,
  'fremont': true
}

var redStations = {
  'richmond': true,
  'el-cerrito-del-norte': true,
  'el-cerrito-plaza': true,
  'north-berkeley': true,
  'downtown-berkeley': true,
  'ashby': true,
  'macarthur': true,
  'nineteenth-st-oakland': true,
  'twelfth-st-oakland': true,
  'west-oakland': true,
  'embarcadero': true,
  'montgomery': true,
  'powell-st': true,
  'civic-center': true,
  'sixteenth-st-mission': true,
  'twentyfourth-st-mission': true,
  'glen-park': true,
  'balboa-park': true,
  'daly-city': true,
  'colma': true,
  'south-san-francisco': true,
  'san-bruno': true,
  'millbrae': true
}

var yellowStations = {
  'pittsburg': true,
  'north-concord': true,
  'concord': true,
  'pleasant-hill': true,
  'walnut-creek': true,
  'lafayette': true,
  'orinda': true,
  'rockridge': true,
  'macarthur': true,
  'nineteenth-st-oakland': true,
  'twelfth-st-oakland': true,
  'west-oakland': true,
  'embarcadero': true,
  'montgomery': true,
  'powell-st': true,
  'civic-center': true,
  'sixteenth-st-mission': true,
  'twentyfourth-st-mission': true,
  'glen-park': true,
  'balboa-park': true,
  'daly-city': true,
  'colma': true,
  'south-san-francisco': true,
  'san-bruno': true,
  'sfo': true,
  'millbrae': true
}

var adjacentStationsDictionary = {
  // north, east, south, west
  "twelfth-st-oakland":
    new AdjacentStations("nineteenth-st-oakland", null, "west-oakland", null),
  "sixteenth-st-mission":
    new AdjacentStations("civic-center", "civic-center", "twentyfourth-st-mission", 
                         "twentyfourth-st-mission"),
  "nineteenth-st-oakland":
    new AdjacentStations("macarthur", null, "twelfth-st-oakland", null),
  "twentyfourth-st-mission":
    new AdjacentStations("sixteenth-st-mission", "sixteenth-st-mission", "glen-park", "glen-park"),
  "ashby":
    new AdjacentStations("downtown-berkeley", null, "macarthur", null),
  "b-bay-fair":
    new AdjacentStations(null, "castro-valley", null, "san-leandro"),
  "balboa-park":
    new AdjacentStations("glen-park", "glen-park", "daly-city", "daly-city"),
  "bay-fair":
    new AdjacentStations("san-leandro", "hayward", "hayward", "san-leandro"),
  "castro-valley":
    new AdjacentStations(null, "west-dublin", null, "bay-fair"),
  "civic-center":
    new AdjacentStations("powell-st", "powell-st", "sixteenth-st-mission",
                         "sixteenth-st-mission"),
  "coliseum":
    new AdjacentStations("fruitvale", "san-leandro", "san-leandro", "fruitvale"),
  "colma":
    new AdjacentStations("daly-city", null, "south-san-francisco", null),
  "concord":
    new AdjacentStations("north-concord", null, "pleasant-hill", null),
  "daly-city":
    new AdjacentStations("balboa-park", "balboa-park", "colma", null),
  "dublin":
    new AdjacentStations(null, null, null, "west-dublin"),
  "downtown-berkeley":
    new AdjacentStations("north-berkeley", null, "ashby", null),
  "el-cerrito-del-norte":
    new AdjacentStations("richmond", null, "el-cerrito-plaza", null),
  "el-cerrito-plaza":
    new AdjacentStations("el-cerrito-del-norte", null, "north-berkeley", null),
  "embarcadero":
    new AdjacentStations("west-oakland", "west-oakland", "montgomery-st", "montgomery-st"),
  "glen-park":
    new AdjacentStations("twentyfourth-st-mission", "twentyfourth-st-mission", "balboa-park",
                         "balboa-park"),
  "fremont":
    new AdjacentStations("union-city", null, null, "union-city"),
  "fruitvale":
    new AdjacentStations("lake-merrit", "coliseum", "coliseum", "lake-merrit"),
  "hayward":
    new AdjacentStations("bay-fair", "south-hayward", "south-hayward", "bay-fair"),
  "lafayette":
    new AdjacentStations("walnut-creek", "fruitvale", "orinda", "west-oakland"),
  "lake-merrit":
    new AdjacentStations("twelfth-st-oakland", "fruitvale", "fruitvale", "west-oakland"),
  "macarthur":
    new AdjacentStations("ashby", null, "nineteenth-st-oakland", null),
  "millbrae":
    new AdjacentStations("san-bruno", null, null, "sfo"),
  "montgomery-st":
    new AdjacentStations("embarcadero", "embarcadero", "powell-st", "powell-st"),
  "north-berkeley":
    new AdjacentStations("el-cerrito-plaza", null, "downtown-berkeley", null),
  "north-concord":
    new AdjacentStations("pittsburg", null, "concord", null),
  "orinda":
    new AdjacentStations("lafayette", null, "rockridge", null),
  "o-twelfth-st-oakland":
    new AdjacentStations("nineteenth-st-oakland", null, "lake-merrit"),
  "pittsburg":
    new AdjacentStations(null, null, "north-concord", null),
  "pleasant-hill":
    new AdjacentStations("concord", null, "walnut-creek", null),
  "powell-st":
    new AdjacentStations("montgomery-st", "montgomery-st", "civic-center", "civic-center"),
  "richmond":
    new AdjacentStations(null, null, 'el-cerrito-del-norte', null),
  "rockridge":
    new AdjacentStations("orinda", null, "macarthur", null),
  "san-bruno":
    new AdjacentStations("south-san-francisco", "sfo", "millbrae", null),
  "san-leandro":
    new AdjacentStations("coliseum", "bay-fair", "bay-fair", "coliseum"),
  "sfo":
    new AdjacentStations("san-bruno", null, "millbrae", null),
  "south-hayward":
    new AdjacentStations("hayward", "union-city", "union-city", "hayward"),
  "south-san-francisco":
    new AdjacentStations("colma", null, "san-bruno", null),
  "union-city":
    new AdjacentStations("south-hayward", "fremont", "fremont", "south-hayward"),
  "walnut-creek":
    new AdjacentStations("pleasant-hill", null, "lafayette", null),
  "west-dublin":
    new AdjacentStations(null, "dublin", null, "castro-valley"),
  "west-oakland":
    new AdjacentStations("twelfth-st-oakland", "lake-merrit", "embarcadero", "embarcadero"),
  "y-macarthur":
    new AdjacentStations("rockridge", null, "nineteenth-st-oakland", null),
  "y-millbrae":
    new AdjacentStations("sfo", null, null, null),
  "y-san-bruno":
    new AdjacentStations("south-san-francisco", null, "sfo", null),
}

// This dictionary maps adjacent stations to the average time, in minutes,
// it takes a train to go from one station to the other.
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

  "pittsburg_north-concord": 6,
  "north-concord_pittsburg": 6,

  "north-concord_concord": 3,
  "concord_north-concord": 3,

  "concord_pleasant-hill": 5,
  "pleasant-hill_concord": 5,

  "pleasant-hill_walnut-creek": 2,
  "walnut-creek_pleasant-hill": 2,

  "walnut-creek_lafayette": 5,
  "lafayette_walnut-creek": 5,

  "lafayette_orinda": 5,
  "orinda_lafayette": 5,

  "orinda_rockridge": 5,
  "rockridge_orinda": 5,

  "rockridge_macarthur": 2,
  "macarthur_rockridge": 2,

  "san-bruno_sfo": 5,
  "sfo_san-bruno": 5,

  "sfo_millbrae": 4,
  "millbrae_sfo": 4,

  "dublin_west-dublin": 2,
  "west-dublin_dublin": 2,

  "west-dublin_castro-valley": 11,
  "castro-valley_west-dublin": 11,

  "castro-valley_bay-fair": 4,
  "bay-fair_castro-valley": 4,

  "bay-fair_san-leandro": 4,
  "san-leandro_bay-fair": 4,

  "san-leandro_coliseum": 4,
  "coliseum_san-leandro": 4,

  "coliseum_fruitvale": 4,
  "fruitvale_coliseum": 4,

  "fruitvale_lake-merrit": 4,
  "lake-merrit_fruitvale": 4,

  "lake-merrit_west-oakland": 6,
  "west-oakland_lake-merrit": 6,

  "bay-fair_hayward": 4,
  "hayward_bay-fair": 4,

  "hayward_south-hayward": 4,
  "south-hayward_hayward": 4,

  "south-hayward_union-city": 5,
  "union-city_south-hayward": 5,

  "union-city_fremont": 5,
  "fremont_union-city": 5,

  "twelfth-st-oakland_lake-merrit": 3,
  "lake-merrit_twelfth-st-oakland": 3,
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

function getAdjacentBlueTrains(station, estimates) {
  /**
   * Finds estimates of adjacent trains for a station on the blue line from an array of estimates.
   * 
   * Args:
   *   station - name of station, e.g. 'dublin'.
   *   estimates - Array of Estimates.
   *
   * Returns:
   *   Dictionary mapping destinations to arrays of adjacent estimates.
   */
  var adjacentStationsLookupKey = station;
  if (station == 'bay-fair') {
    adjacentStationsLookupKey = 'b-' + station;
  }

  // Get adjacent stations.
  var adjacentStations = adjacentStationsDictionary[adjacentStationsLookupKey];
  var adjacentWesternStation = adjacentStations.west;
  var adjacentEasternStation = adjacentStations.east;

  // Get time distances to adjacent stations.
  var westTimeDistance = null;
  var eastTimeDistance = null;
  if (adjacentWesternStation != null) {
    var key = station + '_' + adjacentWesternStation;
    westTimeDistance = stationEstimatesDictionary[key];
  }
  if (adjacentEasternStation != null) {
    var key = station + '_' + adjacentEasternStation;
    eastTimeDistance = stationEstimatesDictionary[key];
  }

  // Find nearby trains.
  var adjacentEstimates = {
    'daly-city': [],
    'dublin': []
  }
  for (var i = 0; i < estimates.length; i++) {
    if (estimates[i].color == 'BLUE') {
      if (station == 'daly-city' || station == 'dublin') { // end-of-line station
        if (station == 'daly-city' && estimates[i].destination == 'dublin' &&
            parseInt(estimates[i].minutes) <= eastTimeDistance) {
          adjacentEstimates['dublin'].push(estimates[i]);
        } else if (
            station == 'dublin' && estimates[i].destination == 'daly-city' &&
            parseInt(estimates[i].minutes) <= westTimeDistance) {
          adjacentEstimates['daly-city'].push(estimates[i]);
        }
      } else {
        if (estimates[i].destination == 'daly-city' &&
            parseInt(estimates[i].minutes) <= eastTimeDistance) {
          adjacentEstimates['daly-city'].push(estimates[i]);
        } else if (
            estimates[i].destination == 'dublin' &&
            parseInt(estimates[i].minutes) <= westTimeDistance) {
          adjacentEstimates['dublin'].push(estimates[i]);
        }
      }
    }
  }
  return adjacentEstimates;
}

function getAdjacentGreenTrains(station, estimates) {
  /**
   * Finds estimates of adjacent trains for a station on the green line from an array of estimates.
   * 
   * Args:
   *   station - name of station, e.g. 'fremont'.
   *   estimates - Array of Estimates.
   *
   * Returns:
   *   Dictionary mapping destinations to arrays of adjacent estimates.
   */
  // Get adjacent stations.
  var adjacentStationsLookupKey = station;
  var adjacentStations = adjacentStationsDictionary[adjacentStationsLookupKey];
  var adjacentWesternStation = adjacentStations.west;
  var adjacentEasternStation = adjacentStations.east;

  // Get time distances to adjacent stations.
  var westTimeDistance = null;
  var eastTimeDistance = null;
  if (adjacentWesternStation != null) {
    var key = station + '_' + adjacentWesternStation;
    westTimeDistance = stationEstimatesDictionary[key];
  }
  if (adjacentEasternStation != null) {
    var key = station + '_' + adjacentEasternStation;
    eastTimeDistance = stationEstimatesDictionary[key];
  }

  // Find nearby trains.
  var adjacentEstimates = {
    'daly-city': [],
    'fremont': []
  }
  for (var i = 0; i < estimates.length; i++) {
    if (estimates[i].color == 'GREEN') {
      if (station == 'daly-city' || station == 'fremont') { // end-of-line station
        if (station == 'daly-city' && estimates[i].destination == 'fremont' &&
            parseInt(estimates[i].minutes) <= eastTimeDistance) {
          adjacentEstimates['fremont'].push(estimates[i]);
        } else if (
            station == 'fremont' && estimates[i].destination == 'daly-city' &&
            parseInt(estimates[i].minutes) <= westTimeDistance) {
          adjacentEstimates['daly-city'].push(estimates[i]);
        }
      } else {
        if (estimates[i].destination == 'daly-city' &&
            parseInt(estimates[i].minutes) <= eastTimeDistance) {
          adjacentEstimates['daly-city'].push(estimates[i]);
        } else if (
            estimates[i].destination == 'fremont' &&
            parseInt(estimates[i].minutes) <= westTimeDistance) {
          adjacentEstimates['fremont'].push(estimates[i]);
        }
      }
    }
  }

  return adjacentEstimates;
}

function getAdjacentOrangeTrains(station, estimates) {
  /**
   * Finds estimates of adjacent trains for a station on the orange line from an array of 
   * estimates.
   * 
   * Args:
   *   station - name of station, e.g. 'fremont'.
   *   estimates - Array of Estimates.
   *
   * Returns:
   *   Dictionary mapping destinations to arrays of adjacent estimates.
   */
  var adjacentStationsLookupKey = station;
  if (station == 'twelfth-st-oakland') {
    adjacentStationsLookupKey = 'o-' + station;
  }

  // Get adjacent stations.
  var adjacentStations = adjacentStationsDictionary[adjacentStationsLookupKey];
  var adjacentSouthernStation = adjacentStations.south;
  var adjacentNorthernStation = adjacentStations.north;

  // Get time distances to adjacent stations.
  var southTimeDistance = null;
  var northTimeDistance = null;
  if (adjacentSouthernStation != null) {
    var key = station + '_' + adjacentSouthernStation;
    southTimeDistance = stationEstimatesDictionary[key];
  }
  if (adjacentNorthernStation != null) {
    var key = station + '_' + adjacentNorthernStation;
    northTimeDistance = stationEstimatesDictionary[key];
  }

  // Find nearby trains.
  var adjacentEstimates = {
    'fremont': [],
    'richmond': []
  }
  for (var i = 0; i < estimates.length; i++) {
    if (estimates[i].color == 'ORANGE') {
      if (station == 'richmond' || station == 'fremont') { // end-of-line station
        if (station == 'richmond' && estimates[i].destination == 'fremont' &&
            parseInt(estimates[i].minutes) <= southTimeDistance) {
          adjacentEstimates['fremont'].push(estimates[i]);
        } else if (
            station == 'fremont' && estimates[i].destination == 'richmond' &&
            parseInt(estimates[i].minutes) <= northTimeDistance) {
          adjacentEstimates['richmond'].push(estimates[i]);
        }
      } else {
        if (estimates[i].destination == 'richmond' &&
            parseInt(estimates[i].minutes) <= southTimeDistance) {
          adjacentEstimates['richmond'].push(estimates[i]);
        } else if (
            estimates[i].destination == 'fremont' &&
            parseInt(estimates[i].minutes) <= northTimeDistance) {
          adjacentEstimates['fremont'].push(estimates[i]);
        }
      }
    }
  }
  
  return adjacentEstimates;
}

function getAdjacentRedTrains(station, estimates) {
  /**
   * Finds estimates of adjacent trains for a station on the red line from an array of estimates.
   * 
   * Args:
   *   station - name of station, e.g. 'richmond'.
   *   estimates - Array of Estimates.
   *
   * Returns:
   *   Dictionary mapping destinations to arrays of adjacent estimates.
   */
  // Get adjacent stations.
  var adjacentStations = adjacentStationsDictionary[station];
  var adjacentSouthernStation = adjacentStations.south;
  var adjacentNorthernStation = adjacentStations.north;

  // Get time distances to adjacent stations.
  var southTimeDistance = null;
  var northTimeDistance = null;
  if (adjacentSouthernStation != null) {
    var key = station + '_' + adjacentSouthernStation;
    southTimeDistance = stationEstimatesDictionary[key];
  }
  if (adjacentNorthernStation != null) {
    var key = station + '_' + adjacentNorthernStation;
    northTimeDistance = stationEstimatesDictionary[key];
  }

  // Find nearby trains.
  var adjacentEstimates = {
    'millbrae': [],
    'richmond': []
  }
  for (var i = 0; i < estimates.length; i++) {
    if (estimates[i].color == 'RED') {
      if (station == 'millbrae' || station == 'richmond') { // end-of-line station
        if (station == 'millbrae' && estimates[i].destination == 'richmond' &&
            parseInt(estimates[i].minutes) <= northTimeDistance) {
          adjacentEstimates['richmond'].push(estimates[i]);
        } else if (
            station == 'richmond' && estimates[i].destination == 'millbrae' &&
            parseInt(estimates[i].minutes) <= southTimeDistance) {
          adjacentEstimates['millbrae'].push(estimates[i]);
        }
      } else {
        if (estimates[i].destination == 'millbrae' &&
            parseInt(estimates[i].minutes) <= northTimeDistance) {
          adjacentEstimates['millbrae'].push(estimates[i]);
        } else if (
            estimates[i].destination == 'richmond' &&
            parseInt(estimates[i].minutes) <= southTimeDistance) {
          adjacentEstimates['richmond'].push(estimates[i]);
        }
      }
    }
  }

  return adjacentEstimates;
}

function getAdjacentYellowTrains(station, estimates) {
  /**
   * Finds estimates of adjacent trains for a station on the yellow line from an array of 
   * estimates.
   * 
   * Args:
   *   station - name of station, e.g. 'concord'.
   *   estimates - Array of Estimates.
   *
   * Returns:
   *   Dictionary mapping destinations to arrays of adjacent estimates.
   */
  var adjacentStationsLookupKey = station;
  // Special case for stations adjacent to SFO.
  if (station == 'millbrae' || station == 'san-bruno') {
    adjacentStationsLookupKey = 'y-' + station;
  }

  // Get adjacent stations.
  var adjacentStations = adjacentStationsDictionary[adjacentStationsLookupKey];
  var adjacentSouthernStation = adjacentStations.south;
  var adjacentNorthernStation = adjacentStations.north;

  // Get time distances to adjacent stations.
  var southTimeDistance = null;
  var northTimeDistance = null;
  if (adjacentSouthernStation != null) {
    var key = station + '_' + adjacentSouthernStation;
    southTimeDistance = stationEstimatesDictionary[key];
  }
  if (adjacentNorthernStation != null) {
    var key = station + '_' + adjacentNorthernStation;
    northTimeDistance = stationEstimatesDictionary[key];
  }

  // Find nearby trains.
  var adjacentEstimates = {
    'millbrae': [],
    'pittsburg': []
  }
  for (var i = 0; i < estimates.length; i++) {
    if (estimates[i].color == 'YELLOW') {
      if (station == 'millbrae' || station == 'pittsburg') { // end-of-line station
        if (station == 'millbrae' && estimates[i].destination == 'pittsburg' &&
            parseInt(estimates[i].minutes) <= northTimeDistance) {
          adjacentEstimates['pittsburg'].push(estimates[i]);
        } else if (
            station == 'pittsburg' && estimates[i].destination == 'millbrae' &&
            parseInt(estimates[i].minutes) <= southTimeDistance) {
          adjacentEstimates['millbrae'].push(estimates[i]);
        }
      } else {
        if (estimates[i].destination == 'millbrae' &&
            parseInt(estimates[i].minutes) <= northTimeDistance) {
          adjacentEstimates['millbrae'].push(estimates[i]);
        } else if (
            estimates[i].destination == 'pittsburg' &&
            parseInt(estimates[i].minutes) <= southTimeDistance) {
          adjacentEstimates['pittsburg'].push(estimates[i]);
        }
      }
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
var blueTrainSpotsDictionary = {
  'dublin': {
    'daly-city': ['b-train-marker-2', 'b-train-marker-1'],
    'dublin': []
  },
  'west-dublin': {
    'daly-city': ['b-train-marker-0', 'b-train-marker-1'],
    'dublin': ['b-train-marker-13', 'b-train-marker-12', 'b-train-marker-11', 'b-train-marker-10',
               'b-train-marker-9', 'b-train-marker-8', 'b-train-marker-7', 'b-train-marker-6',
               'b-train-marker-5', 'b-train-marker-4', 'b-train-marker-3']
  },
  'castro-valley': {
    'daly-city': ['b-train-marker-2', 'b-train-marker-3', 'b-train-marker-4', 'b-train-marker-5',
                  'b-train-marker-6', 'b-train-marker-7', 'b-train-marker-8', 'b-train-marker-9',
                  'b-train-marker-10', 'b-train-marker-11', 'b-train-marker-12'],
    'dublin': ['b-train-marker-17', 'b-train-marker-16', 'b-train-marker-15', 'b-train-marker-14']
  },
  'bay-fair': {
    'daly-city': ['b-train-marker-13', 'b-train-marker-14', 'b-train-marker-15',
                  'b-train-marker-16'],
    'dublin': ['b-train-marker-21', 'b-train-marker-20', 'b-train-marker-19', 'b-train-marker-18']
  },
  'san-leandro': {
    'daly-city': ['b-train-marker-17', 'b-train-marker-18', 'b-train-marker-19',
                  'b-train-marker-20'],
    'dublin': ['b-train-marker-25', 'b-train-marker-24', 'b-train-marker-23', 'b-train-marker-22']
  },
  'coliseum': {
    'daly-city': ['b-train-marker-21', 'b-train-marker-22', 'b-train-marker-23',
                  'b-train-marker-24'],
    'dublin': ['b-train-marker-29', 'b-train-marker-28', 'b-train-marker-27', 'b-train-marker-26']
  },
  'fruitvale': {
    'daly-city': ['b-train-marker-25', 'b-train-marker-26', 'b-train-marker-27',
                  'b-train-marker-28'],
    'dublin': ['b-train-marker-33', 'b-train-marker-32', 'b-train-marker-31', 'b-train-marker-30']
  },
  'lake-merrit': {
    'daly-city': ['b-train-marker-29', 'b-train-marker-30', 'b-train-marker-31',
                  'b-train-marker-32'],
    'dublin': ['b-train-marker-39', 'b-train-marker-38', 'b-train-marker-37',
               'b-train-marker-36', 'b-train-marker-35', 'b-train-marker-34']
  },
  'west-oakland': {
    'daly-city': ['b-train-marker-33', 'b-train-marker-34', 'b-train-marker-35',
                  'b-train-marker-36', 'b-train-marker-37', 'b-train-marker-38'],
    'dublin': ['b-train-marker-47', 'b-train-marker-46', 'b-train-marker-45', 'b-train-marker-44',
               'b-train-marker-43', 'b-train-marker-42', 'b-train-marker-41', 'b-train-marker-40']
  },
  'embarcadero': {
    'daly-city': ['b-train-marker-39', 'b-train-marker-40', 'b-train-marker-41',
                  'b-train-marker-42', 'b-train-marker-43', 'b-train-marker-44',
                  'b-train-marker-45', 'b-train-marker-46'],
    'dublin': ['b-train-marker-49', 'b-train-marker-48']
  },
  'montgomery-st': {
    'daly-city': ['b-train-marker-47', 'b-train-marker-48'],
    'dublin': ['b-train-marker-51', 'b-train-marker-50']
  },
  'powell-st': {
    'daly-city': ['b-train-marker-49', 'b-train-marker-50'],
    'dublin': ['b-train-marker-53', 'b-train-marker-52']
  },
  'civic-center': {
    'daly-city': ['b-train-marker-51', 'b-train-marker-52'],
    'dublin': ['b-train-marker-55', 'b-train-marker-54']
  },
  'sixteenth-st-mission': {
    'daly-city': ['b-train-marker-53', 'b-train-marker-54'],
    'dublin': ['b-train-marker-57', 'b-train-marker-56']
  },
  'twentyfourth-st-mission': {
    'daly-city': ['b-train-marker-55', 'b-train-marker-56'],
    'dublin': ['b-train-marker-60', 'b-train-marker-59', 'b-train-marker-58']
  },
  'glen-park': {
    'daly-city': ['b-train-marker-57', 'b-train-marker-58', 'b-train-marker-59'],
    'dublin': ['b-train-marker-62', 'b-train-marker-61']
  },
  'balboa-park': {
    'daly-city': ['b-train-marker-60', 'b-train-marker-61'],
    'dublin': ['b-train-marker-66', 'b-train-marker-65', 'b-train-marker-64', 'b-train-marker-63']
  },
  'daly-city': {
    'daly-city': [],
    'dublin': ['b-train-marker-62', 'b-train-marker-63', 'b-train-marker-64', 'b-train-marker-65']
  }
}

/**
 * See documentation for blueTrainSpotsDictionary.
 */
var greenTrainSpotsDictionary = {
  'fremont': {
    'daly-city': ['g-train-marker-5', 'g-train-marker-4', 'g-train-marker-3', 'g-train-marker-2',
                  'g-train-marker-1'],
    'fremont': []
  },
  'union-city': {
    'daly-city': ['g-train-marker-0', 'g-train-marker-1', 'g-train-marker-2', 'g-train-marker-3',
                  'g-train-marker-4'],
    'fremont': ['g-train-marker-10', 'g-train-marker-9', 'g-train-marker-8', 'g-train-marker-7',
                'g-train-marker-6']
  },
  'south-hayward': {
    'daly-city': ['g-train-marker-5', 'g-train-marker-6', 'g-train-marker-7', 'g-train-marker-8',
                  'g-train-marker-9'],
    'fremont': ['g-train-marker-14', 'g-train-marker-13', 'g-train-marker-12',
                'g-train-marker-11']
  },
  'hayward': {
    'daly-city': ['g-train-marker-10', 'g-train-marker-11', 'g-train-marker-12',
                  'g-train-marker-13'],
    'fremont': ['g-train-marker-18', 'g-train-marker-17', 'g-train-marker-16', 'g-train-marker-15']
  },
  'bay-fair': {
    'daly-city': ['g-train-marker-14', 'g-train-marker-15', 'g-train-marker-16',
                 'g-train-marker-17'],
    'fremont': ['g-train-marker-22', 'g-train-marker-21', 'g-train-marker-20', 'g-train-marker-19']
  },
  'san-leandro': {
    'daly-city': ['g-train-marker-18', 'g-train-marker-19', 'g-train-marker-20',
                  'g-train-marker-21'],
    'fremont': ['g-train-marker-26', 'g-train-marker-25', 'g-train-marker-24', 'g-train-marker-23']
  },
  'coliseum': {
    'daly-city': ['g-train-marker-22', 'g-train-marker-23', 'g-train-marker-24',
                  'g-train-marker-25'],
    'fremont': ['g-train-marker-30', 'g-train-marker-29', 'g-train-marker-28', 'g-train-marker-27']
  },
  'fruitvale': {
    'daly-city': ['g-train-marker-26', 'g-train-marker-27', 'g-train-marker-28',
                  'g-train-marker-29'],
    'fremont': ['g-train-marker-34', 'g-train-marker-33', 'g-train-marker-32', 'g-train-marker-31']
  },
  'lake-merrit': {
    'daly-city': ['g-train-marker-30', 'g-train-marker-31', 'g-train-marker-32',
                  'g-train-marker-33'],
    'fremont': ['g-train-marker-40', 'g-train-marker-39', 'g-train-marker-38', 'g-train-marker-37',
                'g-train-marker-36', 'g-train-marker-35']
  },
  'west-oakland': {
    'daly-city': ['g-train-marker-34', 'g-train-marker-35', 'g-train-marker-36',
                  'g-train-marker-37', 'g-train-marker-38', 'g-train-marker-39'],
    'fremont': ['g-train-marker-48', 'g-train-marker-47', 'g-train-marker-46', 'g-train-marker-45',
                'g-train-marker-44', 'g-train-marker-43', 'g-train-marker-42', 'g-train-marker-41']
  },
  'embarcadero': {
    'daly-city': ['g-train-marker-40', 'g-train-marker-41', 'g-train-marker-42',
                  'g-train-marker-43', 'g-train-marker-44', 'g-train-marker-45',
                  'g-train-marker-46', 'g-train-marker-47'],
    'fremont': ['g-train-marker-50', 'g-train-marker-49']
  },
  'montgomery-st': {
    'daly-city': ['g-train-marker-48', 'g-train-marker-49'],
    'fremont': ['g-train-marker-52', 'g-train-marker-51']
  },
  'powell-st': {
    'daly-city': ['g-train-marker-50', 'g-train-marker-51'],
    'fremont': ['g-train-marker-54', 'g-train-marker-53']
  },
  'civic-center': {
    'daly-city': ['g-train-marker-52', 'g-train-marker-53'],
    'fremont': ['g-train-marker-56', 'g-train-marker-55']
  },
  'sixteenth-st-mission': {
    'daly-city': ['g-train-marker-54', 'g-train-marker-55'],
    'fremont': ['g-train-marker-58', 'g-train-marker-57']
  },
  'twentyfourth-st-mission': {
    'daly-city': ['g-train-marker-56', 'g-train-marker-57'],
    'fremont': ['g-train-marker-61', 'g-train-marker-60', 'g-train-marker-59']
  },
  'glen-park': {
    'daly-city': ['g-train-marker-58', 'g-train-marker-59', 'g-train-marker-60'],
    'fremont': ['g-train-marker-63', 'g-train-marker-62']
  },
  'balboa-park': {
    'daly-city': ['g-train-marker-61', 'g-train-marker-62'],
    'fremont': ['g-train-marker-67', 'g-train-marker-66', 'g-train-marker-65', 'g-train-marker-64']
  },
  'daly-city': {
    'daly-city': [],
    'fremont': ['g-train-marker-63', 'g-train-marker-64', 'g-train-marker-65',
                'g-train-marker-66']
  }
}

/**
 * See documentation for blueTrainSpotsDictionary.
 */
var orangeTrainSpotsDictionary = {
  'richmond': {
    'fremont': ['o-train-marker-4', 'o-train-marker-3', 'o-train-marker-2', 'o-train-marker-1'],
    'richmond': []
  },
  'el-cerrito-del-norte': {
    'fremont': ['o-train-marker-0', 'o-train-marker-1', 'o-train-marker-2', 'o-train-marker-3'],
    'richmond': ['o-train-marker-7', 'o-train-marker-6', 'o-train-marker-5']
  },
  'el-cerrito-plaza': {
    'fremont': ['o-train-marker-4', 'o-train-marker-5', 'o-train-marker-6'],
    'richmond': ['o-train-marker-11', 'o-train-marker-10', 'o-train-marker-9', 'o-train-marker-8']
  },
  'north-berkeley': {
    'fremont': ['o-train-marker-7', 'o-train-marker-8', 'o-train-marker-9', 'o-train-marker-10'],
    'richmond': ['o-train-marker-13', 'o-train-marker-12']
  },
  'downtown-berkeley': {
    'fremont': ['o-train-marker-11', 'o-train-marker-12'],
    'richmond': ['o-train-marker-15', 'o-train-marker-14']
  },
  'ashby': {
    'fremont': ['o-train-marker-13', 'o-train-marker-14'],
    'richmond': ['o-train-marker-18', 'o-train-marker-17', 'o-train-marker-16']
  },
  'macarthur': {
    'fremont': ['o-train-marker-15', 'o-train-marker-16', 'o-train-marker-17'],
    'richmond': ['o-train-marker-22', 'o-train-marker-21', 'o-train-marker-20',
                 'o-train-marker-19']
  },
  'nineteenth-st-oakland': {
    'fremont': ['o-train-marker-18', 'o-train-marker-19', 'o-train-marker-20', 'o-train-marker-21'],
    'richmond': ['o-train-marker-24', 'o-train-marker-23']
  },
  'twelfth-st-oakland': {
    'fremont': ['o-train-marker-22', 'o-train-marker-23'],
    'richmond': ['o-train-marker-27', 'o-train-marker-26', 'o-train-marker-25']
  },
  'lake-merrit': {
    'fremont': ['o-train-marker-24', 'o-train-marker-25', 'o-train-marker-26'],
    'richmond': ['o-train-marker-31', 'o-train-marker-30', 'o-train-marker-29',
                 'o-train-marker-28']
  },
  'fruitvale': {
    'fremont': ['o-train-marker-27', 'o-train-marker-28', 'o-train-marker-29', 'o-train-marker-30'],
    'richmond': ['o-train-marker-35', 'o-train-marker-34', 'o-train-marker-33',
                 'o-train-marker-32']
  },
  'coliseum': {
    'fremont': ['o-train-marker-31', 'o-train-marker-32', 'o-train-marker-33', 'o-train-marker-34'],
    'richmond': ['o-train-marker-39', 'o-train-marker-38', 'o-train-marker-37',
                 'o-train-marker-36']
  },
  'san-leandro': {
    'fremont': ['o-train-marker-35', 'o-train-marker-36', 'o-train-marker-37', 'o-train-marker-38'],
    'richmond': ['o-train-marker-43', 'o-train-marker-42', 'o-train-marker-41',
                 'o-train-marker-40']
  },
  'bay-fair': {
    'fremont': ['o-train-marker-39', 'o-train-marker-40', 'o-train-marker-41', 'o-train-marker-42'],
    'richmond': ['o-train-marker-47', 'o-train-marker-46', 'o-train-marker-45',
                 'o-train-marker-44']
  },
  'hayward': {
    'fremont': ['o-train-marker-43', 'o-train-marker-44', 'o-train-marker-45', 'o-train-marker-46'],
    'richmond': ['o-train-marker-51', 'o-train-marker-50', 'o-train-marker-49',
                 'o-train-marker-48']
  },
  'south-hayward': {
    'fremont': ['o-train-marker-47', 'o-train-marker-48', 'o-train-marker-49', 'o-train-marker-50'],
    'richmond': ['o-train-marker-56', 'o-train-marker-55', 'o-train-marker-54',
                 'o-train-marker-53', 'o-train-marker-52']
  },
  'union-city': {
    'fremont': ['o-train-marker-51', 'o-train-marker-52', 'o-train-marker-53', 'o-train-marker-54',
                'o-train-marker-55'],
    'richmond': ['o-train-marker-61', 'o-train-marker-60', 'o-train-marker-59',
                 'o-train-marker-58', 'o-train-marker-57']
  },
  'fremont': {
    'fremont': [],
    'richmond': ['o-train-marker-56', 'o-train-marker-57', 'o-train-marker-58',
                 'o-train-marker-59', 'o-train-marker-60']
  },
}

/**
 * See documentation for blueTrainSpotsDictionary.
 */
var redTrainSpotsDictionary = {
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

/**
 * See documentation for blueTrainSpotsDictionary.
 */
var yellowTrainSpotsDictionary = {
  'pittsburg': {
    'millbrae': ['y-train-marker-6', 'y-train-marker-5', 'y-train-marker-4', 'y-train-marker-3',
                 'y-train-marker-2', 'y-train-marker-1'],
    'pittsburg': []
  },
  'north-concord': {
    'millbrae': ['y-train-marker-0', 'y-train-marker-1', 'y-train-marker-2', 'y-train-marker-3',
                 'y-train-marker-4', 'y-train-marker-5'],
    'pittsburg': ['y-train-marker-9', 'y-train-marker-8', 'y-train-marker-7']
  },
  'concord': {
    'millbrae': ['y-train-marker-6', 'y-train-marker-7', 'y-train-marker-8'],
    'pittsburg': ['y-train-marker-14', 'y-train-marker-13', 'y-train-marker-12',
                  'y-train-marker-11', 'y-train-marker-10']
  },
  'pleasant-hill': {
    'millbrae': ['y-train-marker-9', 'y-train-marker-10', 'y-train-marker-11', 'y-train-marker-12',
                 'y-train-marker-13'],
    'pittsburg': ['y-train-marker-16', 'y-train-marker-15']
  },
  'walnut-creek': {
    'millbrae': ['y-train-marker-14', 'y-train-marker-15'],
    'pittsburg': ['y-train-marker-21', 'y-train-marker-20', 'y-train-marker-19',
                  'y-train-marker-18', 'y-train-marker-17']
  },
  'lafayette': {
    'millbrae': ['y-train-marker-16', 'y-train-marker-17', 'y-train-marker-18',
                 'y-train-marker-19', 'y-train-marker-20'],
    'pittsburg': ['y-train-marker-26', 'y-train-marker-25', 'y-train-marker-24',
                  'y-train-marker-23', 'y-train-marker-22']
  },
  'orinda': {
    'millbrae': ['y-train-marker-21', 'y-train-marker-22', 'y-train-marker-23',
                 'y-train-marker-24', 'y-train-marker-25'],
    'pittsburg': ['y-train-marker-31', 'y-train-marker-30', 'y-train-marker-29',
                  'y-train-marker-28', 'y-train-marker-27']
  },
  'rockridge': {
    'millbrae': ['y-train-marker-26', 'y-train-marker-27', 'y-train-marker-28',
                 'y-train-marker-29', 'y-train-marker-30'],
    'pittsburg': ['y-train-marker-33', 'y-train-marker-32']
  },
  'macarthur': {
    'millbrae': ['y-train-marker-31', 'y-train-marker-32'],
    'pittsburg': ['y-train-marker-37', 'y-train-marker-36', 'y-train-marker-35',
                  'y-train-marker-34']
  },
  'nineteenth-st-oakland': {
    'millbrae': ['y-train-marker-33', 'y-train-marker-34', 'y-train-marker-35',
                 'y-train-marker-36'],
    'pittsburg': ['y-train-marker-39', 'y-train-marker-38']
  },
  'twelfth-st-oakland': {
    'millbrae': ['y-train-marker-37', 'y-train-marker-38'],
    'pittsburg': ['y-train-marker-44', 'y-train-marker-43', 'y-train-marker-42',
                  'y-train-marker-41', 'y-train-marker-40']
  },
  'west-oakland': {
    'millbrae': ['y-train-marker-39', 'y-train-marker-40', 'y-train-marker-41',
                 'y-train-marker-42', 'y-train-marker-43'],
    'pittsburg': ['y-train-marker-52', 'y-train-marker-51', 'y-train-marker-50',
                  'y-train-marker-49', 'y-train-marker-48', 'y-train-marker-47',
                  'y-train-marker-46', 'y-train-marker-45']
  },
  'embarcadero': {
    'millbrae': ['y-train-marker-44', 'y-train-marker-45', 'y-train-marker-46',
                 'y-train-marker-47', 'y-train-marker-48', 'y-train-marker-49',
                 'y-train-marker-50', 'y-train-marker-51'],
    'pittsburg': ['y-train-marker-54', 'y-train-marker-53']
  },
  'montgomery-st': {
    'millbrae': ['y-train-marker-52', 'y-train-marker-53'],
    'pittsburg': ['y-train-marker-56', 'y-train-marker-55']
  },
  'powell-st': {
    'millbrae': ['y-train-marker-54', 'y-train-marker-55'],
    'pittsburg': ['y-train-marker-58', 'y-train-marker-57']
  },
  'civic-center': {
    'millbrae': ['y-train-marker-56', 'y-train-marker-57'],
    'pittsburg': ['y-train-marker-60', 'y-train-marker-59']
  },
  'sixteenth-st-mission': {
    'millbrae': ['y-train-marker-58', 'y-train-marker-59'],
    'pittsburg': ['y-train-marker-62', 'y-train-marker-61']
  },
  'twentyfourth-st-mission': {
    'millbrae': ['y-train-marker-60', 'y-train-marker-61'],
    'pittsburg': ['y-train-marker-65', 'y-train-marker-64', 'y-train-marker-63']
  },
  'glen-park': {
    'millbrae': ['y-train-marker-62', 'y-train-marker-63', 'y-train-marker-64'],
    'pittsburg': ['y-train-marker-67', 'y-train-marker-66']
  },
  'balboa-park': {
    'millbrae': ['y-train-marker-65', 'y-train-marker-66'],
    'pittsburg': ['y-train-marker-71', 'y-train-marker-70', 'y-train-marker-69',
                  'y-train-marker-68']
  },
  'daly-city': {
    'millbrae': ['y-train-marker-67', 'y-train-marker-68', 'y-train-marker-69',
                 'y-train-marker-70'],
    'pittsburg': ['y-train-marker-75', 'y-train-marker-74', 'y-train-marker-73',
                  'y-train-marker-72']
  },
  'colma': {
    'millbrae': ['y-train-marker-71', 'y-train-marker-72', 'y-train-marker-73',
                 'y-train-marker-74'],
    'pittsburg': ['y-train-marker-78', 'y-train-marker-77',' y-train-marker-76']
  },
  'south-san-francisco': {
    'millbrae': ['y-train-marker-75', 'y-train-marker-76', 'y-train-marker-77'],
    'pittsburg': ['y-train-marker-82', 'y-train-marker-81', 'y-train-marker-80',
                  'y-train-marker-79']
  },
  'san-bruno': {
    'millbrae': ['y-train-marker-78', 'y-train-marker-79', 'y-train-marker-80',
                 'y-train-marker-81'],
    'pittsburg': ['y-train-marker-87', 'y-train-marker-86', 'y-train-marker-85',
                  'y-train-marker-84', 'y-train-marker-83']
  },
  'sfo': {
    'millbrae': ['y-train-marker-82', 'y-train-marker-83', 'y-train-marker-84',
                 'y-train-marker-85', 'y-train-marker-86'],
    'pittsburg': ['y-train-marker-91', 'y-train-marker-90', 'y-train-marker-89',
                  'y-train-marker-88']
  },
  'millbrae': {
    'millbrae': [],
    'pittsburg': ['y-train-marker-87', 'y-train-marker-88', 'y-train-marker-89',
                 'y-train-marker-90'],
  },
}

function getLiveTrainSpotsBlue(station, adjacentTrains) {
  /**
   * Gets CSS ids of DOM elements where blue trains should be drawn given current estimates.
   *
   * Args:
   *   station - station name, e.g. 'dublin'
   *   estimates - Dictionary of destinations -> arrays of Estimates.
   *
   * Returns:
   *   ids - CSS ids, CSS classes, and image names given as an array of arrays, where each inner
   *         array is [id, class, image].
   */
  var ids = [];
  var trainSpots = blueTrainSpotsDictionary[station];

  var adjacentStationsLookupKey = station;
  // Special case for bay-fair.
  if (station == 'bay-fair') {
    adjacentStationsLookupKey = 'b-' + station;
  }
  var adjacentStations = adjacentStationsDictionary[adjacentStationsLookupKey];

  // Get average time to closest eastern and western stations.
  var easternStation = adjacentStations.east;
  var key = station + "_" + easternStation;
  var avgEastTime = stationEstimatesDictionary[key];
  var westernStation = adjacentStations.west;
  key = station + "_" + westernStation;
  var avgWestTime = stationEstimatesDictionary[key];

  // Use the adjacent estimates and train spots to figure out where to draw trains.
  // Need to check for end-of-line stations. E.g. trains going into Dublin are bound for
  // Daly City but they are going east.
  if (station == 'dublin' || station == 'daly-city') { // end-of-line stations
    for (var i = 0; i < adjacentTrains['daly-city'].length; i++) { // trains going to daly-city
      var estMinutes = adjacentTrains['daly-city'][i].minutes;
      var index = avgWestTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['daly-city'][index], 'train-icon-bottom-left', 'train_icon_east.png']);
    }
    for (var i = 0; i < adjacentTrains['dublin'].length; i++) { // trains going to dublin
      var estMinutes = adjacentTrains['dublin'][i].minutes;
      var index = avgEastTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['dublin'][index], 'train-icon-top-right', 'train_icon_west.png']);
    }
  } else { // all other stations
    for (var i = 0; i < adjacentTrains['daly-city'].length; i++) { // trains going to daly-city
      var estMinutes = adjacentTrains['daly-city'][i].minutes;
      var index = avgEastTime - estMinutes;
      ids.push([trainSpots['daly-city'][index], 'train-icon-top-right', 'train_icon_west.png']);
    }
    for (var i = 0; i < adjacentTrains['dublin'].length; i++) { // trains going to dublin
      var estMinutes = adjacentTrains['dublin'][i].minutes;
      var index = avgWestTime - estMinutes;
      ids.push([trainSpots['dublin'][index], 'train-icon-bottom-left', 'train_icon_east.png']);
    }  
  }

  return ids;
}

function getLiveTrainSpotsGreen(station, adjacentTrains) {
  /**
   * Gets CSS ids of DOM elements where green trains should be drawn given current estimates.
   *
   * Args:
   *   station - station name, e.g. 'fremont'
   *   estimates - Dictionary of destinations -> arrays of Estimates.
   *
   * Returns:
   *   ids - CSS ids, CSS classes, and image names given as an array of arrays, where each inner
   *         array is [id, class, image].
   */
  var ids = [];
  var trainSpots = greenTrainSpotsDictionary[station];

  var adjacentStationsLookupKey = station;
  var adjacentStations = adjacentStationsDictionary[adjacentStationsLookupKey];

  // Get average time to closest eastern and western stations.
  var easternStation = adjacentStations.east;
  var key = station + "_" + easternStation;
  var avgEastTime = stationEstimatesDictionary[key];
  var westernStation = adjacentStations.west;
  key = station + "_" + westernStation;
  var avgWestTime = stationEstimatesDictionary[key];

  // Use the adjacent estimates and train spots to figure out where to draw trains.
  // Need to check for end-of-line stations. E.g. trains going into Dublin are bound for
  // Daly City but they are going east.
  if (station == 'fremont' || station == 'daly-city') { // end-of-line stations
    for (var i = 0; i < adjacentTrains['daly-city'].length; i++) { // trains going to daly-city
      var estMinutes = adjacentTrains['daly-city'][i].minutes;
      var index = avgWestTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['daly-city'][index], 'train-icon-bottom-left', 'train_icon_east.png']);
    }
    for (var i = 0; i < adjacentTrains['fremont'].length; i++) { // trains going to fremont
      var estMinutes = adjacentTrains['fremont'][i].minutes;
      var index = avgEastTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['fremont'][index], 'train-icon-top-right', 'train_icon_west.png']);
    }
  } else { // all other stations
    for (var i = 0; i < adjacentTrains['daly-city'].length; i++) { // trains going to daly-city
      var estMinutes = adjacentTrains['daly-city'][i].minutes;
      var index = avgEastTime - estMinutes;
      ids.push([trainSpots['daly-city'][index], 'train-icon-top-right', 'train_icon_west.png']);
    }
    for (var i = 0; i < adjacentTrains['fremont'].length; i++) { // trains going to fremont
      var estMinutes = adjacentTrains['fremont'][i].minutes;
      var index = avgWestTime - estMinutes;
      ids.push([trainSpots['fremont'][index], 'train-icon-bottom-left', 'train_icon_east.png']);
    }  
  }

  return ids;
}

function getLiveTrainSpotsOrange(station, adjacentTrains) {
  /**
   * Gets CSS ids of DOM elements where orange trains should be drawn given current estimates.
   *
   * Args:
   *   station - station name, e.g. 'fremont'
   *   estimates - Dictionary of destinations -> arrays of Estimates.
   *
   * Returns:
   *   ids - CSS ids, CSS classes, and image names given as an array of arrays, where each inner
   *         array is [id, class, image].
   */
  var ids = [];
  var trainSpots = orangeTrainSpotsDictionary[station];

  var adjacentStationsLookupKey = station;
  // Special case for twelfth-st-oakland.
  if (station == 'twelfth-st-oakland') {
    adjacentStationsLookupKey = 'o-' + station;
  }
  var adjacentStations = adjacentStationsDictionary[adjacentStationsLookupKey];

  // Get average time to closest northern and southern stations.
  var northernStation = adjacentStations.north;
  var key = station + "_" + northernStation;
  var avgNorthTime = stationEstimatesDictionary[key];
  var southernStation = adjacentStations.south;
  key = station + "_" + southernStation;
  var avgSouthTime = stationEstimatesDictionary[key];

  // Use the adjacent estimates and train spots to figure out where to draw trains.
  // Need to check for end-of-line stations. E.g. trains going into Fremont are bound for
  // Richmond but they are going south.
  if (station == 'richmond' || station == 'fremont') { // end-of-line stations
    for (var i = 0; i < adjacentTrains['fremont'].length; i++) { // trains going to fremont
      var estMinutes = adjacentTrains['fremont'][i].minutes;
      var index = avgSouthTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['fremont'][index], 'train-icon-bottom-left', 'train_icon_north.png']);
    }
    for (var i = 0; i < adjacentTrains['richmond'].length; i++) { // trains going to richmond
      var estMinutes = adjacentTrains['richmond'][i].minutes;
      var index = avgNorthTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['richmond'][index], 'train-icon-top-right', 'train_icon_south.png']);
    }
  } else { // all other stations
    for (var i = 0; i < adjacentTrains['fremont'].length; i++) { // trains going to fremont
      var estMinutes = adjacentTrains['fremont'][i].minutes;
      var index = avgNorthTime - estMinutes;
      ids.push([trainSpots['fremont'][index], 'train-icon-top-right', 'train_icon_south.png']);
    }
    for (var i = 0; i < adjacentTrains['richmond'].length; i++) { // trains going to richmond
      var estMinutes = adjacentTrains['richmond'][i].minutes;
      var index = avgSouthTime - estMinutes;
      ids.push([trainSpots['richmond'][index], 'train-icon-bottom-left', 'train_icon_north.png']);
    }  
  }

  return ids;
}

function getLiveTrainSpotsRed(station, adjacentTrains) {
  /**
   * Gets CSS ids of DOM elements where trains should be drawn given current estimates.
   *
   * Args:
   *   station - station name, e.g. 'richmond'
   *   estimates - Dictionary of destinations -> arrays of Estimates.
   *
   * Returns:
   *   ids - CSS ids, CSS classes, and image names given as an array of arrays, where each inner
   *         array is [id, class, image].
   */
  var ids = [];  
  var trainSpots = redTrainSpotsDictionary[station];
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
    for (var i = 0; i < adjacentTrains['millbrae'].length; i++) { // trains going to millbrae
      var estMinutes = adjacentTrains['millbrae'][i].minutes;
      var index = avgSouthTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['millbrae'][index], 'train-icon-bottom-left', 'train_icon_north.png']);
    }
    for (var i = 0; i < adjacentTrains['richmond'].length; i++) { // trains going to richmond
      var estMinutes = adjacentTrains['richmond'][i].minutes;
      var index = avgNorthTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['richmond'][index], 'train-icon-top-right', 'train_icon_south.png']);
    }
  } else { // all other stations
    for (var i = 0; i < adjacentTrains['millbrae'].length; i++) { // trains going to millbrae
      var estMinutes = adjacentTrains['millbrae'][i].minutes;
      var index = avgNorthTime - estMinutes;
      ids.push([trainSpots['millbrae'][index], 'train-icon-top-right', 'train_icon_south.png']);
    }
    for (var i = 0; i < adjacentTrains['richmond'].length; i++) { // trains going to richmond
      var estMinutes = adjacentTrains['richmond'][i].minutes;
      var index = avgSouthTime - estMinutes;
      ids.push([trainSpots['richmond'][index], 'train-icon-bottom-left', 'train_icon_north.png']);
    }  
  }

  return ids;
}

function getLiveTrainSpotsYellow(station, adjacentTrains) {
  /**
   * Gets CSS ids of DOM elements where yellow trains should be drawn given current estimates.
   *
   * Args:
   *   station - station name, e.g. 'concord'
   *   estimates - Dictionary of destinations -> arrays of Estimates.
   *
   * Returns:
   *   ids - CSS ids, CSS classes, and image names given as an array of arrays, where each inner
   *         array is [id, class, image].
   */
  var ids = [];
  var trainSpots = yellowTrainSpotsDictionary[station];

  var adjacentStationsLookupKey = station;
  // Special case for stations adjacent to SFO.
  if (station == 'millbrae' || station == 'san-bruno') {
    adjacentStationsLookupKey = 'y-' + station;
  }
  var adjacentStations = adjacentStationsDictionary[adjacentStationsLookupKey];

  // Get average time to closest northern and southern stations.
  var northernStation = adjacentStations.north;
  var key = station + "_" + northernStation;
  var avgNorthTime = stationEstimatesDictionary[key];
  var southernStation = adjacentStations.south;
  key = station + "_" + southernStation;
  var avgSouthTime = stationEstimatesDictionary[key];

  // Use the adjacent estimates and train spots to figure out where to draw trains.
  // Need to check for end-of-line stations. E.g. trains going into Pittsburg are bound for
  // Millbrae but they are going north.
  if (station == 'pittsburg' || station == 'millbrae') { // end-of-line stations
    for (var i = 0; i < adjacentTrains['millbrae'].length; i++) { // trains going to millbrae
      var estMinutes = adjacentTrains['millbrae'][i].minutes;
      var index = avgSouthTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['millbrae'][index], 'train-icon-bottom-left', 'train_icon_north.png']);
    }
    for (var i = 0; i < adjacentTrains['pittsburg'].length; i++) { // trains going to pittsburg
      var estMinutes = adjacentTrains['pittsburg'][i].minutes;
      var index = avgNorthTime - estMinutes; // direction flipped because of end-of-line
      ids.push([trainSpots['pittsburg'][index], 'train-icon-top-right', 'train_icon_south.png']);
    }
  } else { // all other stations
    for (var i = 0; i < adjacentTrains['millbrae'].length; i++) { // trains going to millbrae
      var estMinutes = adjacentTrains['millbrae'][i].minutes;
      var index = avgNorthTime - estMinutes;
      ids.push([trainSpots['millbrae'][index], 'train-icon-top-right', 'train_icon_south.png']);
    }
    for (var i = 0; i < adjacentTrains['pittsburg'].length; i++) { // trains going to pittsburg
      var estMinutes = adjacentTrains['pittsburg'][i].minutes;
      var index = avgSouthTime - estMinutes;
      ids.push([trainSpots['pittsburg'][index], 'train-icon-bottom-left', 'train_icon_north.png']);
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

function getEstimatesFromXml(stationXml) {
  /**
   * Get array of estimates from XML for one station.
   *
   * Args:
   *   stationXml - XML data for a single station.
   *
   * Returns:
   *   An array of estimates.
   */
  var $stationXml = $(stationXml);
  var $etdXml = $stationXml.children("etd");

  var estimates = [];
  $etdXml.each(function() {
    var $destination = stationNameDictionary[$(this).find("destination").text()];
    if ($destination == null) {
      $destination = "millbrae";
    }
    var $destAbbr = $(this).find("abbr").text();
    $(this).children("estimate").each(function() {
      var estimate = new Estimate(
        stationNameDictionary[$stationXml.find("name").text()], // stationName
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

function processRealtimeEstimates(station, estimates) {
  /**
   *
   */
  if (station in blueStations) {
    var adjacentEstimates = getAdjacentBlueTrains(station, estimates);
    var drawSpots = getLiveTrainSpotsBlue(station, adjacentEstimates);
    drawTrains(drawSpots);
  }

  if (station in greenStations) {
    var adjacentEstimates = getAdjacentGreenTrains(station, estimates);
    var drawSpots = getLiveTrainSpotsGreen(station, adjacentEstimates);
    drawTrains(drawSpots);
  }

  if (station in orangeStations) {
    var adjacentEstimates = getAdjacentOrangeTrains(station, estimates);
    var drawSpots = getLiveTrainSpotsOrange(station, adjacentEstimates);
    drawTrains(drawSpots);
  }

  if (station in redStations) {
    var adjacentEstimates = getAdjacentRedTrains(station, estimates);
    var drawSpots = getLiveTrainSpotsRed(station, adjacentEstimates);
    drawTrains(drawSpots);
  }

  if (station in yellowStations) {
    var adjacentEstimates = getAdjacentYellowTrains(station, estimates);
    var drawSpots = getLiveTrainSpotsYellow(station, adjacentEstimates);
    drawTrains(drawSpots);
  }
}

function run(xmlData) {
  var $xml = $(xmlData);
  var $rootXml = $xml.find('root');
  var $stationXml = $rootXml.find('station');
  clearTrains(); // TODO: do this at the station level

  $stationXml.each(function() {
    var $stationNameBart = $(this).find('name').text();
    var $stationName = stationNameDictionary[$stationNameBart];
    var estimates = getEstimatesFromXml($(this));
    processRealtimeEstimates($stationName, estimates);
  });
}

$(document).ready(function() {
  // $(".station").each(function() {
  //   $(this).click(function() {
  //     getDepartures(stationDictionary[$(this).attr("id")], showStationInfo);
  //   });
  // });

  interval = 5*1000; // 5 seconds
  setInterval(getDepartures, interval, 'all', run);
  //getDepartures('all', run);
});
