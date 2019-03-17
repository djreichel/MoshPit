// global variables
var inputArtist;
var where;
var blank = "";
var logo = $("#logo");
var key = "fb84c3a57177226f589349b05b02b444";


//function for fetching band bios
function lastfm(artist) {
  // ajax call to last fm API
  var key = "fb84c3a57177226f589349b05b02b444";
  var queryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=" + key + "&format=json";
  
  $.ajax({
    url: queryURL,
    method: "GET"
    
  }).then(function (response) {
    // console log music brainz artist id and assign to art id variable
    console.log("music brainz:" + response.artist.mbid);
    var artid = response.artist.mbid;
    // make second ajax call using music brainz artist id
    var queryURLtwo = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=" + artid + "&api_key=" + key + "&format=json";
    $.ajax({
      url: queryURLtwo,
      method: "GET"
    }).then(function (response) {
      // console log and assign the bio response to a variable
      console.log("potential bio:"+response.artist.bio.summary);
      var bio = response.artist.bio.summary;
      // finds first occurance of < in the bio, assign that number to a variable
      var end = bio.indexOf("<");
      // grab usable bio starting from the beginning and ending at the end variable
      var biop = $("<p>").text(bio.substring(0, end));
      // append text to artist card
      $("#artist-div").append(biop);
    })

  })
};

// ajax call for keyword and location
function evdbapi(keyword, where) {
  // console log both input parameters
  console.log("evdbapi called, artist=" + keyword + ", loc = " + where);
  var app_key = "PW24gq77zLtqXLnT";
  // object of arguments to be passed into API call
  var oArgs = {
    app_key: app_key,
    q: keyword,
    where: where,
    "date": "Next week",
    "include": "tags,categories",
    page_size: 20,
    sort_order: "popularity",
  };
  EVDB.API.call("/events/search", oArgs, function (oData) {
    // console log object containing events array
    console.log(oData.events);
    // assign events array to variable for manipulation
    var allevents = oData.events.event;
    //console log array
    console.log(allevents);
    // clear any cards already built
    $("#cardplace").empty();
    // starting at index 0 of all events array, for each event, do the following...
    for ( var i=0; i < allevents.length; i++) {
      // console log the event at [i]
      console.log(allevents[i]);
      // craet a card
      var eventcard = $("<div class='card eventful'>")
      // find the artist name using the title key and create a header card title
      var artistName = $("<h1 class='card-title'>").text(allevents[i].title);
      // if there is no image, then...
      if (allevents[i].image == null){ 
        // set artist image equal to a paragraph element with the text "no image available"
      var artistImage = $("<p>").text("no image avaliable");
      } else {
        // else find image url and assign to image element
        // assign image element to variable for manipulation
        var artistImage = $("<img class='card-img-top' alt='no image available'>").attr("src", allevents[i].image.medium.url);
      }
      // create a paragraph element with the venue name and assign it to a variable for manipulation
      var venue = $("<p>").text(allevents[i].venue_name);
      // create a paragraph element with the city, regin and country name and assign it to a variable for manipulation
      var vlocal = $("<p>").text(allevents[i].city_name + " ," + allevents[i].region_name + " ," + allevents[i].country_name);
      // create a paragraph element with the date and assign it to a variable for manipulation
      var date = $("<p>").text(allevents[i].start_time);
      // console log eventful artist url
      console.log(allevents[i].url);
      // create an anchor tag with the eventful artist url and assign oit to a variable for manipulation
      var link = $("<a>").attr("href", allevents[i].url);
      // assign anchor tag to tickets
      $(link).text("Tickets");
      // append all info to event card
      $(eventcard).append(artistName, artistImage, vlocal, link, venue, date);
      // append event card to the DOM
      $("#cardplace").append(eventcard);
    }
  });
}
function searchBandsInTown(artist) {
  if (artist == "") {
    console.log("no artist")
    return false;
  }

  // Querying the bandsintown api for the selected artist
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    // Printing the entire object to console
    console.log(response);
    // clear any cards already built
    $("#cardplace").empty();
    // Constructing HTML containing the artist information
    var artistName = $("<h1 class='card-title'>").text(response.name);
    var artistURL = $("<a>").attr("href", response.url).append(artistName);
    var artistImage = $("<img class='card-img-top'>").attr("src", response.thumb_url);
    var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates");
    // create a card element and assign to a variable for manipulation
    var bandcard = $("<div class='card' id='artist-div'>");
    // append the new artist content to the band card
    $(bandcard).append(artistURL, artistImage, goToArtist);
    // append card to DOM
    $("#cardplace").append(bandcard);
  });
}
$(document).ready(function () {
  // 
  $("#artist").on("click", function () {
    $("#dembutts").empty();
    $("#artist-form").css("visibility", "visible");
    $("#artist-input").css("visibility", "visible");
    
  });
  $("#city").on("click", function () {
    $("#dembutts").empty();
    $("#where-form").css("visibility", "visible");
    $("#f_elem_city").css("visibility", "visible");
    $("#keyword").css("visibility", "visible");
    
  });
  $("#select-location").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    logo.animate({ height: "350px" });
    // Storing the artist name
    var keyword = $("#keyword").val().trim();
    where = $("#f_elem_city").val().trim();
    evdbapi(keyword, where);
  });


  // Event handler for user clicking the select-artist button
  $("#select-artist").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    logo.animate({ height: "400px" });
    // Storing the artist name
    inputArtist = $("#artist-input").val().trim();
    where = $("#f_elem_city").val().trim();
    // Running the searchBandsInTown function(passing in the artist as an argument)
    lastfm(inputArtist);
    // evdbapi(inputArtist, where);
    searchBandsInTown(inputArtist);
  });
});
