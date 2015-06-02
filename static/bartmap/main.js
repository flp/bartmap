var API_KEY = 'QAVH-UAY7-IQZQ-DT35'
var BASE_URL = 'http://api.bart.gov/api'

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
  "sixteenth-st-mission": "16",
  "south-san-francisco": "ssan",
  "twelfth-st-oakland": "12th",
  "twentyfourth-st-mission": "24",
  "west-oakland": "woak",
}

var Estimate = function (stationName, stationAbbr, destination, destAbbr,
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
  console.log(url);
  $.get(url, function(data) {
    callback(data)
  });
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

$(document).ready(function() {
  $(".station").each(function() {
    $(this).click(function() {
      getDepartures(stationDictionary[$(this).attr("id")], showStationInfo);
    });
  });
});
