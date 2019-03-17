var inputArtist;
var where;
var blank = "";
var logo = $("#logo");
var key = "fb84c3a57177226f589349b05b02b444";



function lastfm(artist) {

  var key = "fb84c3a57177226f589349b05b02b444";
  var queryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=" + key + "&format=json";
  
  $.ajax({
    url: queryURL,
    method: "GET"
    
  }).then(function (response) {
    console.log("music brainz:" + response.artist.mbid);
    var artid = response.artist.mbid;
    var queryURLtwo = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=" + artid + "&api_key=" + key + "&format=json";
    $.ajax({
      url: queryURLtwo,
      method: "GET"
    }).then(function (response) {
      console.log("potential bio:"+response.artist.bio.summary);
      var bio = response.artist.bio.summary;
      var end = bio.indexOf("<");
      console.log(end);
      //bio.substring(0, end);
      var biop = $("<p>").text(bio.substring(0, end));
      $("#artist-div").append(biop);
    })

  })
};

function evdbapi(artist, loc) {
  console.log("evdbapi called, artist=" + artist + ", loc = " + loc);
  var app_key = "PW24gq77zLtqXLnT";
  var oArgs = {
    app_key: app_key,
    q: artist,
    where: loc,
    "date": "Next week",
    "include": "tags,categories",
    page_size: 20,
    sort_order: "popularity",
  };
  EVDB.API.call("/events/search", oArgs, function (oData) {
    console.log(oData.events);
    var allevents = oData.events.event;
    console.log(allevents);
    $("#cardplace").empty();
    for ( var i=0; i < allevents.length; i++) {
      console.log(allevents[i]);
      var eventcard = $("<div class='card eventful'>")
      var artistName = $("<h1 class='card-title'>").text(allevents[i].title);
      if (allevents[i].image == null){ 
      var artistImage = $("<p>").text("no image avaliable");
      } else {
        var artistImage = $("<img class='card-img-top'>").attr("src", allevents[i].image.medium.url);
      }
      var venue = $("<p>").text(allevents[i].venue_name);
      var vlocal = $("<p>").text(allevents[i].city_name + " ," + allevents[i].region_name + " ," + allevents[i].country_name);
      var date = $("<p>").text(allevents[i].start_time);
      console.log(allevents[i].url);
      var link = $("<a>").attr("href", allevents[i].url);
      $(link).text("Tickets");
      $(eventcard).append(artistName, artistImage, vlocal, link, venue, date);
      $("#cardplace").append(eventcard);
    }
  });
}
function searchBandsInTown(artist) {
  if (artist == "") {
    console.log("no artist")
    return false;
  }

  // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    // Printing the entire object to console
    console.log(response);
    $("#cardplace").empty();
    // Constructing HTML containing the artist information
    
    var artistName = response.name;
    var artistURL = $("<div class=content'").append($("<a class='header'>").attr("href", response.url).append(artistName));
    var artistImage = $("<div class='image'").append($("<img>").attr("src", response.thumb_url))
    var goToArtist = $("<div class='description'").append($("<a>").attr("href", response.url).text("See Tour Dates"));
    console.log(artistName);
    console.log(artistURL);
    console.log(artistImage);
    // Empty the contents of the artist-div, append the new artist content
    var bandcard = $("<div class=' ui card' id='artist-div'>")
    $(bandcard).append(artistURL, artistImage, goToArtist);
    $("#cardplace").append(bandcard);
  });
}
$(document).ready(function () {
  
  $("#artist").on("click", function () {
    $("#dembutts").empty();
    $("#artist-input").css("visibility", "visible");
    $("#select-artist").css("visibility", "visible");
    
  });
  $("#city").on("click", function () {
    $("#dembutts").empty();
    $("#where").css("visibility", "visible");
    $("#select-location").css("visibility", "visible");
    $("#keyword").css("visibility", "visible");
    
  });
  $("#select-location").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    logo.animate({ height: "350px" });
    // Storing the artist name
    var keyword = $("#keyword").val().trim();
    where = $("#where").val().trim();
    evdbapi(keyword, where);
  });


  // Event handler for user clicking the select-artist button
  $("#select-artist").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    logo.animate({ 
      left: "-=400px",
      width: "200px"
  }, "slow");

  });
});
